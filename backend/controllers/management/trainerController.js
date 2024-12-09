const User = require('../../models/User');

// Export functions directly
exports.listTrainers = async (req, res) => {
    try {
        const trainers = await User.find({ role: 'trainer' });
        res.json({
            success: true,
            data: trainers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.addTrainer = async (req, res) => {
    try {
        const newTrainer = await User.create({
            ...req.body,
            role: 'trainer'
        });
        res.status(201).json({
            success: true,
            data: newTrainer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateTrainer = async (req, res) => {
    try {
        const trainer = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: 'Trainer not found'
            });
        }
        res.json({
            success: true,
            data: trainer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getTrainerSchedule = async (req, res) => {
    try {
        const trainer = await User.findById(req.params.id);
        if (!trainer) {
            return res.status(404).json({
                success: false,
                message: 'Trainer not found'
            });
        }
        res.json({
            success: true,
            data: trainer.schedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};