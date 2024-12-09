// controllers/admin/accountController.js
const User = require('../../models/User');

// Defining each function separately for clarity
const listManagementAccounts = async (req, res) => {
    try {
        const accounts = await User.find({ role: 'management' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: accounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createManagementAccount = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const newAccount = await User.create({
            ...req.body,
            role: 'management'
        });

        res.status(201).json({
            success: true,
            data: newAccount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateManagementAccount = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedAccount = await User.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.json({
            success: true,
            data: updatedAccount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteManagementAccount = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAccount = await User.findByIdAndDelete(id);

        if (!deletedAccount) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const viewAccountsDetails = async (req, res) => {
    try {
        const accounts = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                    users: {
                        $push: {
                            _id: '$_id',
                            name: { $concat: ['$firstName', ' ', '$lastName'] },
                            email: '$email',
                            status: '$isActive'
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: accounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export all functions
module.exports = {
    listManagementAccounts,
    createManagementAccount,
    updateManagementAccount,
    deleteManagementAccount,
    viewAccountsDetails
};