const { AuditLog } = require("../models");

const auditLogMiddleware = async (req, res, next) => {
  const startTime = Date.now();

  const originalJson = res.json;
  res.json = async function (data) {
    const duration = Date.now() - startTime;

    try {
      await AuditLog.create({
        adminId: req.user?.role === "admin" ? req.user.id : null,
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        method: req.method,
        requestData: {
          body: req.body || null,
          query: req.query || null,
        },
        responseData: data || null,
        statusCode: res.statusCode,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Failed to log audit data:", err);
    }

    return originalJson.call(this, data);
  };

  next();
};

module.exports = auditLogMiddleware;
