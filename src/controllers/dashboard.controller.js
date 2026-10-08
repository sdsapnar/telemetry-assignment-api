const telemetryService = require('../services/telemetry.service');

exports.getDashboard = (req, res) => {
  try {
    const data = telemetryService.getDashboardData();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to retrieve telemetry data',
      message: err.message
    });
  }
};
