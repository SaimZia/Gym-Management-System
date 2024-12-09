// controllers/customer/dietController.js
const Diet = require('../../models/Diet');

exports.getCurrentDiet = async (req, res) => {
    try {
        const diet = await Diet.findOne({
            customer: req.user?._id,
            status: 'active'
        }).populate('trainer', 'firstName lastName');

        if (!diet) {
            return res.status(404).json({
                success: false,
                message: 'No active diet plan found'
            });
        }

        res.json({
            success: true,
            data: diet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getDietHistory = async (req, res) => {
    try {
        const diets = await Diet.find({
            customer: req.user?._id
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: diets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateDietProgress = async (req, res) => {
    try {
        const diet = await Diet.findOneAndUpdate(
            {
                _id: req.params.dietId,
                customer: req.user?._id,
                status: 'active'
            },
            {
                $push: { progress: req.body }
            },
            { new: true }
        );

        if (!diet) {
            return res.status(404).json({
                success: false,
                message: 'Diet plan not found'
            });
        }

        res.json({
            success: true,
            data: diet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getDietAnalytics = async (req, res) => {
    try {
        const diet = await Diet.findOne({
            customer: req.user?._id,
            status: 'active'
        });

        if (!diet) {
            return res.status(404).json({
                success: false,
                message: 'No active diet plan found'
            });
        }

        // Calculate basic analytics
        const analytics = {
            totalDays: diet.progress.length,
            averageAdherence: diet.progress.reduce((acc, curr) => acc + curr.adherence, 0) / diet.progress.length,
            currentCalories: diet.dailyCalories,
            startDate: diet.startDate,
            lastUpdated: diet.progress[diet.progress.length - 1]?.date
        };

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};