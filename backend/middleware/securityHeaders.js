module.exports = (req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=63072000');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
};
