const express = require('express');
const router = express.Router();

const {
  SUPABASE_URL,
  SUPABASE_KEY,
  GITHUB_CLIENT_ID,
  JWT_SECRET,
  FRONTEND_URL
} = process.env;

router.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Server is operational',
    routes: {
      health: '/health',
      testSupabase: '/test-supabase',
      checkEnv: '/check-env',
      auth: {
        github: '/auth/github',
        githubCallback: '/auth/github/callback'
      },
      repos: '/api/repos'
    }
  });
});

router.get('/health', (req, res) => res.status(200).send('OK'));

router.get('/check-env', (req, res) => {
  res.json({
    envLoaded: !!SUPABASE_URL && !!SUPABASE_KEY,
    githubConfigured: !!GITHUB_CLIENT_ID,
    jwtConfigured: !!JWT_SECRET && JWT_SECRET !== 'development-secret-change-me',
    frontendUrl: FRONTEND_URL
  });
});

module.exports = router;
