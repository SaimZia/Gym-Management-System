// controllers/management/customerController.js
const User = require("../../models/User");
const Subscription = require("../../models/Subscription");

// List all customers
exports.listCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password");
    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single customer details
exports.getCustomerDetails = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    }).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await User.findOneAndUpdate(
      { _id: req.params.id, role: "customer" },
      req.body,
      { new: true }
    ).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get customer's attendance
exports.getCustomerAttendance = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Placeholder for attendance data
    res.json({
      success: true,
      data: {
        customerId: req.params.id,
        attendance: [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
