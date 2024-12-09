// services/reportService.js
const Report = require('../models/Report');
const User = require('../models/User');
const Gym = require('../models/Gym');
const Payment = require('../models/Payment');
const Equipment = require('../models/Equipment');
const ExcelJS = require('exceljs');

class ReportService {
  async generateMonthlyReport(gymId, month, year) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Gather all necessary data
      const [
        memberships,
        payments,
        equipment,
        trainers,
        customers
      ] = await Promise.all([
        this.getMembershipStats(gymId, startDate, endDate),
        this.getPaymentStats(gymId, startDate, endDate),
        this.getEquipmentStats(gymId),
        this.getTrainerStats(gymId),
        this.getCustomerStats(gymId, startDate, endDate)
      ]);

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      
      // Add memberships sheet
      const membershipSheet = workbook.addWorksheet('Memberships');
      membershipSheet.addRows([
        ['New Memberships', memberships.new],
        ['Cancelled Memberships', memberships.cancelled],
        ['Total Active Memberships', memberships.active],
        ['Renewal Rate', `${memberships.renewalRate}%`]
      ]);

      // Add payments sheet
      const paymentSheet = workbook.addWorksheet('Payments');
      paymentSheet.addRows([
        ['Total Revenue', payments.totalRevenue],
        ['Subscription Revenue', payments.subscriptionRevenue],
        ['Other Revenue', payments.otherRevenue],
        ['Pending Payments', payments.pendingPayments]
      ]);

      // Add equipment sheet
      const equipmentSheet = workbook.addWorksheet('Equipment');
      equipmentSheet.addRows([
        ['Total Equipment', equipment.total],
        ['Active Equipment', equipment.active],
        ['Under Maintenance', equipment.underMaintenance],
        ['Out of Order', equipment.outOfOrder]
      ]);

      const fileName = `gym-report-${gymId}-${month}-${year}.xlsx`;
      await workbook.xlsx.writeFile(fileName);

      return fileName;
    } catch (error) {
      throw error;
    }
  }

  async generateCustomReport(params) {
    try {
      const {
        startDate,
        endDate,
        metrics,
        groupBy,
        gymId
      } = params;

      const aggregation = [];

      // Match stage
      const matchStage = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
      if (gymId) matchStage.gym = gymId;
      aggregation.push({ $match: matchStage });

      // Group stage
      const groupStage = {
        _id: null
      };
      metrics.forEach(metric => {
        if (metric === 'revenue') {
          groupStage.totalRevenue = { $sum: '$amount' };
        }
        if (metric === 'memberships') {
          groupStage.totalMembers = { $sum: 1 };
        }
      });
      
      if (groupBy === 'daily') {
        groupStage._id = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      } else if (groupBy === 'monthly') {
        groupStage._id = { 
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        };
      }

      aggregation.push({ $group: groupStage });

      const results = await Report.aggregate(aggregation);
      return results;
    } catch (error) {
      throw error;
    }
  }

  // Helper methods
  async getMembershipStats(gymId, startDate, endDate) {
    // Implementation for membership statistics
  }

  async getPaymentStats(gymId, startDate, endDate) {
    // Implementation for payment statistics
  }

  async getEquipmentStats(gymId) {
    // Implementation for equipment statistics
  }

  async getTrainerStats(gymId) {
    // Implementation for trainer statistics
  }

  async getCustomerStats(gymId, startDate, endDate) {
    // Implementation for customer statistics
  }
}

module.exports = new ReportService();