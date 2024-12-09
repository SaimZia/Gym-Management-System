// controllers/trainer/traineeController.js
const User = require('../../models/User');

// Using exports directly to ensure the functions are available
exports.getTrainees = async (req, res) => {
    try {
        const trainees = await User.find({ role: 'customer' }).select('-password');
        res.json({
            success: true,
            data: trainees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getTraineeDetails = async (req, res) => {
    try {
        const trainee = await User.findOne({
            _id: req.params.id,
            role: 'customer'
        }).select('-password');

        if (!trainee) {
            return res.status(404).json({
                success: false,
                message: 'Trainee not found'
            });
        }

        res.json({
            success: true,
            data: trainee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.assignWorkout = async (req, res) => {
    try {
        const trainee = await User.findByIdAndUpdate(
            req.params.id,
            { $push: { workouts: req.body } },
            { new: true }
        );

        if (!trainee) {
            return res.status(404).json({
                success: false,
                message: 'Trainee not found'
            });
        }

        res.json({
            success: true,
            data: trainee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};