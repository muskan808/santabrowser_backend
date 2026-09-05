import { Router } from 'express';
import { emitUploadNotification } from '../socket.js';

const router = Router();

// Simple unprotected endpoint for testing only: POST { userId, message }
router.post('/notify', (req, res) => {
  const { userId, message } = req.body || {};
  if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

  emitUploadNotification({ userId, file: null, message: message || 'Test notification' });
  res.json({ success: true });
});

export default router;
