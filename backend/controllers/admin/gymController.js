// controllers/admin/gymController.js
const Gym = require('../../models/Gym');
const User = require('../../models/User');

// Using exports directly instead of class
exports.addGym = async (req, res) => {
    try {
        const { name, address, contactNumber, email, managerId } = req.body;

        // Verify if manager exists and is not already assigned to a gym
        if (managerId) {
            const existingManager = await User.findById(managerId);
            console.log('Existing manager:', existingManager); // Debugging log
            if (!existingManager) {
                return res.status(400).json({ message: 'Invalid manager ID' });
            }

            const existingGymForManager = await Gym.findOne({ manager: managerId });
            console.log('Existing gym for manager:', existingGymForManager); // Debugging log
            if (existingGymForManager) {
                return res.status(400).json({ message: 'Manager is already assigned to another gym' });
            }
        }

        const newGym = new Gym({
            name,
            address,
            contactNumber,
            email,
            manager: managerId || null,
            isActive: true
        });

        console.log('New gym data:', newGym); // Debugging log

        await newGym.save();
        console.log('Saved gym:', newGym); // Debugging log

        if (managerId) {
            await User.findByIdAndUpdate(managerId, { assignedGym: newGym._id });
        }

        res.status(201).json({
            message: 'Gym added successfully',
            gym: newGym
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding gym', error: error.message });
    }
};


exports.updateGym = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.manager) {
            const existingGymForManager = await Gym.findOne({ manager: updateData.manager });
            
            if (existingGymForManager && existingGymForManager._id.toString() !== id) {
                return res.status(400).json({ message: 'Manager is already assigned to another gym' });
            }
        }

        const updatedGym = await Gym.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedGym) {
            return res.status(404).json({ message: 'Gym not found' });
        }

        res.json({
            message: 'Gym updated successfully',
            gym: updatedGym
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating gym', error: error.message });
    }
};

exports.deleteGym = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGym = await Gym.findByIdAndDelete(id);

        if (!deletedGym) {
            return res.status(404).json({ message: 'Gym not found' });
        }

        if (deletedGym.manager) {
            await User.findByIdAndUpdate(deletedGym.manager, { assignedGym: null });
        }

        res.json({ message: 'Gym deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting gym', error: error.message });
    }
};

exports.listGyms = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const searchQuery = search 
            ? { 
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { 'address.city': { $regex: search, $options: 'i' } }
                ] 
            } 
            : {};

        const gyms = await Gym.find(searchQuery)
            .populate('manager', 'firstName lastName email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Gym.countDocuments(searchQuery);

        res.json({
            gyms,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving gyms', error: error.message });
    }
};

exports.getGymDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const gym = await Gym.findById(id).populate('manager', 'firstName lastName email');

        if (!gym) {
            return res.status(404).json({ message: 'Gym not found' });
        }

        res.json({
            success: true,
            data: gym
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving gym details', error: error.message });
    }
};