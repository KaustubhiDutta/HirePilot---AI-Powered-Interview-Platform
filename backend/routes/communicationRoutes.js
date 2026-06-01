import express from 'express';
import { analyzeCommunication } from '../services/openaiService.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  const { answer, context } = req.body;
  
  try {
    const analysis = await analyzeCommunication(answer, context);
    res.json(analysis);
  } catch (error) {
    console.error('Communication analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;