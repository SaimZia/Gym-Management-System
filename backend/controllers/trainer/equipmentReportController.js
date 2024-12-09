// controllers/trainer/equipmentReportController.js
const Equipment = require('../../models/Equipment');

exports.reportDamagedEquipment = async (req, res) => {
    try {
        const { equipmentId, description, severity } = req.body;

        // Ensure req.user._id is populated (Trainer's ID)
        if (!req.user || !req.user._id) {
            return res.status(400).json({
                success: false,
                message: 'Trainer ID is missing or invalid.'
            });
        }

        const equipment = await Equipment.findByIdAndUpdate(
            equipmentId,
            {
                $push: {
                    maintenanceHistory: {
                        type: 'damage_report',
                        description,
                        severity,
                        reportedBy: req.user._id, // Trainer's ID from authenticated user
                        date: new Date()
                    }
                },
                status: 'under_maintenance'
            },
            { new: true }
        );

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        res.status(201).json({
            success: true,
            data: equipment
        });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getReports = async (req, res) => {
    try {
        const reports = await Equipment.find({
            'maintenanceHistory.reportedBy': req.user?._id
        }).select('name maintenanceHistory');

        res.json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateReport = async (req, res) => {
    try {
        const { equipmentId, reportId } = req.params;
        const { status, resolution } = req.body;

        const equipment = await Equipment.findOneAndUpdate(
            {
                _id: equipmentId,
                'maintenanceHistory._id': reportId
            },
            {
                $set: {
                    'maintenanceHistory.$.status': status,
                    'maintenanceHistory.$.resolution': resolution
                }
            },
            { new: true }
        );

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        res.json({
            success: true,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};