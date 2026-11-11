import Report from '../models/Report.js';

export const createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, reason, description } = req.body;
    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ success: false, message: 'Target type, target ID and reason required' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted. Our moderation team will review this shortly.',
      report
    });
  } catch (error) {
    next(error);
  }
};
