// controllers/management/equipmentController.js
const Equipment = require('../../models/Equipment');
const MaintenanceLog = require('../../models/MaintenanceLog');

exports.addEquipment = async (req, res) => {
    try {
        const newEquipment = await Equipment.create(req.body);
        res.status(201).json({
            success: true,
            data: newEquipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
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

exports.listEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find()
            .sort({ createdAt: -1 });

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

exports.deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        res.json({
            success: true,
            message: 'Equipment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.logMaintenance = async (req, res) => {
    try {
        const { equipmentId } = req.params;
        const maintenanceData = req.body;

        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        const maintenanceLog = await MaintenanceLog.create({
            equipment: equipmentId,
            ...maintenanceData
        });

        // Update equipment's last maintenance date
        equipment.lastMaintenance = maintenanceLog.date;
        equipment.nextMaintenanceDue = maintenanceLog.nextMaintenanceDate;
        await equipment.save();

        res.status(201).json({
            success: true,
            data: maintenanceLog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMaintenanceHistory = async (req, res) => {
    try {
        const { equipmentId } = req.params;
        const history = await MaintenanceLog.find({ equipment: equipmentId })
            .sort({ date: -1 });

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};