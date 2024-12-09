// controllers/management/packageController.js
const Package = require('../../models/Package');

exports.listPackages = async (req, res) => {
    try {
        const packages = await Package.find().sort({ createdAt: -1 });
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

exports.createPackage = async (req, res) => {
    try {
        const newPackage = await Package.create(req.body);
        res.status(201).json({
            success: true,
            data: newPackage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updatePackage = async (req, res) => {
    try {
        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        res.json({
            success: true,
            data: updatedPackage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deletePackage = async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);

        if (!deletedPackage) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        res.json({
            success: true,
            message: 'Package deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPackageDetails = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);

        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        res.json({
            success: true,
            data: package
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};