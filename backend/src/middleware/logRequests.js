// Simple request/response logger that prints concise info to stdout.
// Logs: timestamp, method, url, status, response time, content-length, user id (if available), and a truncated request body for write methods.
module.exports = (req, res, next) => {
  const start = process.hrtime();
  const { method, originalUrl } = req;

  // Wait for response to finish so we can report status and duration
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const ms = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);
    const status = res.statusCode;
    const len = res.getHeader('content-length') || '-';
    const userId = (req.user && (req.user._id || req.user.id)) || '-';

    let bodyInfo = '-';
    if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
      try {
        bodyInfo = JSON.stringify(req.body);
      } catch (e) {
        bodyInfo = '[unserializable]';
      }
      if (bodyInfo.length > 200) bodyInfo = bodyInfo.slice(0, 200) + '...';
    }

    // Keep the log concise and human readable for terminal output
    console.info(`[${new Date().toISOString()}] ${method} ${originalUrl} -> ${status} ${ms}ms len=${len} user=${userId} body=${bodyInfo}`);
  });

  next();
};
