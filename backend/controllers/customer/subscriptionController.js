// controllers/customer/subscriptionController.js
const Subscription = require('../../models/Subscription');
const Package = require('../../models/Package');

exports.getAvailablePackages = async (req, res) => {
    try {
        const packages = await Package.find({ isActive: true });
        res.json({
            success: true,
            data: packages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.subscribeToPackage = async (req, res) => {
    try {
        const { packageId } = req.body;
        const customerId = req.user?._id;

        const subscription = await Subscription.create({
            customer: customerId,
            package: packageId,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            data: subscription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMySubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            customer: req.user?._id
        }).populate('package');

        res.json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        const subscription = await Subscription.findOneAndUpdate(
            {
                _id: subscriptionId,
                customer: req.user?._id
            },
            {
                status: 'cancelled',
                cancelDate: new Date()
            },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        res.json({
            success: true,
            message: 'Subscription cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};