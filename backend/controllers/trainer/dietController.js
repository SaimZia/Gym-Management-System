// controllers/trainer/dietController.js
const Diet = require('../../models/Diet');

exports.addDietPlan = async (req, res) => {
    try {
        const { customerId } = req.params;
        const trainerId = req.user?._id;

        const dietPlan = await Diet.create({
            ...req.body,
            customer: customerId,
            trainer: trainerId,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            data: dietPlan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateDietPlan = async (req, res) => {
    try {
        const { dietId } = req.params;
        const trainerId = req.user?._id;

        const dietPlan = await Diet.findOneAndUpdate(
            { _id: dietId, trainer: trainerId },
            req.body,
            { new: true }
        );

        if (!dietPlan) {
            return res.status(404).json({
                success: false,
                message: 'Diet plan not found'
            });
        }

        res.json({
            success: true,
            data: dietPlan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteDietPlan = async (req, res) => {
    try {
        const { dietId } = req.params;
        const trainerId = req.user?._id;

        const dietPlan = await Diet.findOneAndDelete({
            _id: dietId,
            trainer: trainerId
        });

        if (!dietPlan) {
            return res.status(404).json({
                success: false,
                message: 'Diet plan not found'
            });
        }

        res.json({
            success: true,
            message: 'Diet plan deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getCustomerDietPlans = async (req, res) => {
    try {
        const { customerId } = req.params;
        const trainerId = req.user?._id;

        const dietPlans = await Diet.find({
            customer: customerId,
            trainer: trainerId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: dietPlans
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
        const { dietId } = req.params;
        const trainerId = req.user?._id;

        const dietPlan = await Diet.findOneAndUpdate(
            { _id: dietId, trainer: trainerId },
            { $push: { progress: req.body } },
            { new: true }
        );

        if (!dietPlan) {
            return res.status(404).json({
                success: false,
                message: 'Diet plan not found'
            });
        }

        res.json({
            success: true,
            data: dietPlan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};