import Sport from '../models/Sport.js';

export const getAllSports = async (req, res, next) => {
  try {
    const sports = await Sport.find({}).sort({ isPopular: -1, name: 1 });
    res.status(200).json({ success: true, count: sports.length, sports });
  } catch (error) {
    next(error);
  }
};

export const getSportBySlug = async (req, res, next) => {
  try {
    const sport = await Sport.findOne({ slug: req.params.slug.toLowerCase() });
    if (!sport) {
      return res.status(404).json({ success: false, message: 'Sport not found' });
    }
    res.status(200).json({ success: true, sport });
  } catch (error) {
    next(error);
  }
};

export const createSport = async (req, res, next) => {
  try {
    const { name, slug, icon, description, categories, isPopular } = req.body;
    const sport = await Sport.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      icon: icon || 'Trophy',
      description: description || '',
      categories: categories || ['International', 'National', 'Domestic', 'Local League', 'Friendly'],
      isPopular: Boolean(isPopular)
    });
    res.status(201).json({ success: true, sport });
  } catch (error) {
    next(error);
  }
};
