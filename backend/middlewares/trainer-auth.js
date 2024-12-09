const trainerAuth = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'trainer') {
      return res.status(403).json({ 
        message: 'Access denied. Trainer privileges required.' 
      });
    }

    if (!req.user.assignedGym) {
      return res.status(403).json({ 
        message: 'No gym assigned to trainer account' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = trainerAuth;