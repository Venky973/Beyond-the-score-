import Follow from '../models/Follow.js';

export const toggleFollow = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.body;

    if (!targetType || !targetId) {
      return res.status(400).json({ success: false, message: 'Target type and target ID required' });
    }

    const existing = await Follow.findOne({
      user: req.user._id,
      targetType,
      targetId
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        success: true,
        isFollowing: false,
        message: `Unfollowed ${targetType}`
      });
    } else {
      await Follow.create({
        user: req.user._id,
        targetType,
        targetId
      });
      return res.status(201).json({
        success: true,
        isFollowing: true,
        message: `Now following ${targetType}`
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getMyFollows = async (req, res, next) => {
  try {
    const follows = await Follow.find({ user: req.user._id });
    res.status(200).json({ success: true, follows });
  } catch (error) {
    next(error);
  }
};
