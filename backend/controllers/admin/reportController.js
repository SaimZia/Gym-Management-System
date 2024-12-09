// controllers/admin/reportController.js
const User = require('../../models/User');
const Gym = require('../../models/Gym');
const Payment = require('../../models/Payment');

// Export functions directly
exports.generateCityReport = async (req, res) => {
    try {
        const { city } = req.params;
        const gymsInCity = await Gym.find({ 'address.city': city });
        
        if (gymsInCity.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No gyms found in this city'
            });
        }

        // Get IDs of all gyms in the city
        const gymIds = gymsInCity.map(gym => gym._id);

        // Get all users associated with these gyms
        const users = await User.aggregate([
            { $match: { assignedGym: { $in: gymIds } } },
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get payment statistics
        const payments = await Payment.aggregate([
            { $match: { gym: { $in: gymIds } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    averagePayment: { $avg: '$amount' },
                    totalTransactions: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                city,
                gymCount: gymsInCity.length,
                userStatistics: users,
                paymentStatistics: payments[0] || {
                    totalRevenue: 0,
                    averagePayment: 0,
                    totalTransactions: 0
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating city report',
            error: error.message
        });
    }
};

exports.getMonthlyReport = async (req, res) => {
    try {
        const { month, year } = req.params;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Get monthly payment statistics
        const paymentStats = await Payment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get new memberships in the month
        const newMembers = await User.countDocuments({
            role: 'customer',
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        res.json({
            success: true,
            data: {
                month,
                year,
                paymentStatistics: paymentStats,
                newMemberships: newMembers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating monthly report',
            error: error.message
        });
    }
};

exports.getCustomReport = async (req, res) => {
    try {
        const { startDate, endDate, metrics } = req.query;

        let report = {};

        if (metrics.includes('revenue')) {
            const revenueStats = await Payment.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: '$amount' }
                    }
                }
            ]);
            report.revenue = revenueStats;
        }

        if (metrics.includes('memberships')) {
            const membershipStats = await User.aggregate([
                {
                    $match: {
                        role: 'customer',
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                }
            ]);
            report.memberships = membershipStats;
        }

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating custom report',
            error: error.message
        });
    }
};