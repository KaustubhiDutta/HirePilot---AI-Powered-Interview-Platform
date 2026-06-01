import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

router.post('/verify-token', async (req, res) => {
  const { token } = req.body;
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ 
      valid: true, 
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name 
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: error.message });
  }
});

router.post('/logout', async (req, res) => {
  // Client-side logout handled by Firebase
  res.json({ success: true });
});

export default router;