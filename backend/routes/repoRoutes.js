const express = require('express');
const axios = require('axios');
const supabase = require('../config/supabaseClient');
const { verifyToken } = require('../utils/jwtHelpers');

const router = express.Router();

const getUserAccessToken = async (token) => {
  const decoded = verifyToken(token);
  if (!decoded) throw new Error('Invalid token');
  
  const { data: user, error } = await supabase
    .from('users')
    .select('access_token, username')
    .eq('id', decoded.userId)
    .single();

  if (error || !user?.access_token) throw new Error(error?.message || 'GitHub access token not found');

  const githubUser = await axios.get('https://api.github.com/user', {
    headers: { Authorization: `token ${user.access_token}` }
  });

  return {
    token: user.access_token,
    username: user.username || githubUser.data.login
  };
};

router.use(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authorization required' });
    
    const { token: access_token, username } = await getUserAccessToken(token);
    req.github_token = access_token;
    req.username = username;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
});

router.get('/repos', async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${req.github_token}`,
        Accept: 'application/vnd.github.v3+json'
      },
      params: {
        per_page: 100,
        sort: 'updated'
      }
    });

    res.json(response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: repo.owner,
      html_url: repo.html_url,
      private: repo.private,
      description: repo.description
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

router.get('/repos/:owner/:repo', async (req, res) => {
  try {
    const owner = req.params.owner === 'unknown' ? req.username : req.params.owner;
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${req.params.repo}`,
      {
        headers: {
          Authorization: `token ${req.github_token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    res.json({
      name: data.name,
      full_name: data.full_name,
      private: data.private,
      default_branch: data.default_branch,
      description: data.description
    });
  } catch (err) {
    res.status(404).json({ error: 'Repository not found' });
  }
});

router.get('/repos/:owner/:repo/contents', async (req, res) => {
  try {
    const owner = req.params.owner === 'unknown' ? req.username : req.params.owner;
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${req.params.repo}/contents`,
      {
        headers: {
          Authorization: `token ${req.github_token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    res.json(data.map(item => ({
      name: item.name,
      path: item.path,
      type: item.type,
      size: item.size
    })));
  } catch (err) {
    res.status(404).json({ error: 'Contents not found' });
  }
});

module.exports = router;