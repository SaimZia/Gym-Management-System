// controllers/management/paymentController.js
const Payment = require('../../models/Payment');
const User = require('../../models/User');

exports.processTrainerPayment = async (req, res) => {
    try {
        const { trainerId, amount, description } = req.body;
        
        const payment = await Payment.create({
            amount,
            type: 'salary',
            description,
            recipient: trainerId,
            status: 'completed'
        });

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.recordCustomerPayment = async (req, res) => {
    try {
        const { customerId, amount, packageId } = req.body;

        const payment = await Payment.create({
            amount,
            type: 'subscription',
            payer: customerId,
            package: packageId,
            status: 'completed'
        });

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('payer', 'firstName lastName')
            .populate('recipient', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPaymentAnalytics = async (req, res) => {
    try {
        const analytics = await Payment.aggregate([
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

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

exports.processRefund = async (req, res) => {
    try {
        const { paymentId } = req.params;
        
        const payment = await Payment.findByIdAndUpdate(
            paymentId,
            { 
                status: 'refunded',
                refundDate: new Date()
            },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};