const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwtHelpers = require('../utils/jwtHelpers');
const rateLimit = require('express-rate-limit');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 60, // Limit to 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later'
  }
});

// Middleware stack
router.use(jwtHelpers.verifyToken);
router.use(apiLimiter);

router.post('/generate', async (req, res) => {
    try {
      const { code, language, context } = req.body;
      
      // Enhanced validation
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ 
          error: 'Invalid code content',
          details: 'Code must be a non-empty string'
        });
      }
  
      if (!language || typeof language !== 'string') {
        return res.status(400).json({
          error: 'Invalid language',
          details: 'Language must be specified'
        });
      }
  
      // Size check
      if (code.length > 100000) {
        return res.status(413).json({
          error: 'Code too large',
          details: `Max 100k characters, received ${code.length}`
        });
      }
  
      // Proceed with generation...
      const result = await generateWithGemini(code, language, context);
      
      res.json({
        success: true,
        documentation: result
      });
  
    } catch (error) {
      // Improved error logging
      console.error('Generation Error:', {
        timestamp: new Date(),
        error: error.message,
        stack: error.stack,
        requestBody: req.body 
      });
  
      res.status(500).json({
        error: 'Documentation generation failed',
        details: process.env.NODE_ENV === 'development' 
          ? error.message 
          : undefined
      });
    }
  });
  
module.exports = router;