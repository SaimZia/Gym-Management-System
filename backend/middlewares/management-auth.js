const managementAuth = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'management') {
      return res.status(403).json({ 
        message: 'Access denied. Management privileges required.' 
      });
    }

    if (!req.user.assignedGym) {
      return res.status(403).json({ 
        message: 'No gym assigned to management account' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = managementAuth;