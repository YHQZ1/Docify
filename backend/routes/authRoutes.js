const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

const router = express.Router();
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } = process.env;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/auth/github/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

router.get('/github', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scope=user,repo`);
});

router.get('/github/callback', async (req, res) => {
  if (!req.query.code) {
    return res.redirect(`${FRONTEND_URL}/?error=auth_failed`);
  }

  try {
    const { data } = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: req.query.code,
      redirect_uri: GITHUB_CALLBACK_URL
    }, { headers: { Accept: 'application/json' } });

    const githubUser = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${data.access_token}` }
    });

    const { data: dbUser } = await supabase.from('users').upsert({
      github_id: githubUser.data.id,
      username: githubUser.data.login,
      name: githubUser.data.name || githubUser.data.login,
      avatar_url: githubUser.data.avatar_url,
      access_token: data.access_token
    }, { onConflict: 'github_id' }).select().single();

    const token = jwt.sign({ userId: dbUser.id }, JWT_SECRET, { expiresIn: '1h' });

    res.redirect(`${FRONTEND_URL}/dashboard?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: dbUser.id,
      username: dbUser.username,
      name: dbUser.name,
      avatar: dbUser.avatar_url
    }))}`);
  } catch (err) {
    console.error('OAuth error:', err);
    res.redirect(`${FRONTEND_URL}/?error=auth_failed`);
  }
});

module.exports = router;