import express from 'express';

const router = express.Router();
const reports = new Map(); // In production, use Firestore

router.get('/:sessionId', async (req, res) => {
  const report = reports.get(req.params.sessionId);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});

router.post('/save', async (req, res) => {
  const { sessionId, report } = req.body;
  reports.set(sessionId, report);
  res.json({ success: true });
});

router.get('/user/:userId', async (req, res) => {
  const userReports = Array.from(reports.entries())
    .filter(([_, report]) => report.userId === req.params.userId)
    .map(([id, report]) => ({ id, ...report }));
  res.json(userReports);
});

export default router;