// controllers/admin/statsController.js
const User = require('../../models/User');
const Gym = require('../../models/Gym');
const Payment = require('../../models/Payment');
const Package = require('../../models/Package');

exports.getSystemStats = async (req, res) => {
    try {
        // Get user statistics
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get gym statistics
        const gymStats = await Gym.aggregate([
            {
                $group: {
                    _id: null,
                    totalGyms: { $sum: 1 },
                    activeGyms: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get payment statistics
        const paymentStats = await Payment.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    totalPayments: { $sum: 1 }
                }
            }
        ]);

        // Get package statistics
        const packageStats = await Package.aggregate([
            {
                $group: {
                    _id: null,
                    totalPackages: { $sum: 1 },
                    activePackages: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                users: userStats,
                gyms: gymStats[0] || { totalGyms: 0, activeGyms: 0 },
                payments: paymentStats[0] || { totalRevenue: 0, totalPayments: 0 },
                packages: packageStats[0] || { totalPackages: 0, activePackages: 0 }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching system stats',
            error: error.message
        });
    }
};

exports.getRevenueStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const matchStage = {};
        if (startDate && endDate) {
            matchStage.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const revenueStats = await Payment.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json({
            success: true,
            data: revenueStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching revenue stats',
            error: error.message
        });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const activeUsers = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    total: { $sum: 1 },
                    active: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    }
                }
            }
        ]);

        const newUsersThisMonth = await User.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setDate(1)) // First day of current month
            }
        });

        res.json({
            success: true,
            data: {
                activeUsers,
                newUsersThisMonth
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user stats',
            error: error.message
        });
    }
};

exports.getEquipmentStats = async (req, res) => {
    try {
        const equipmentStats = await Gym.aggregate([
            {
                $group: {
                    _id: '$city',
                    totalEquipment: { $sum: { $size: '$facilities' } },
                    gymCount: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: equipmentStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching equipment stats',
            error: error.message
        });
    }
};