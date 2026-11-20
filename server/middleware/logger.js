/**
 * Standard HTTP Request Logger Middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    const statusBadge =
      statusCode >= 500
        ? '[ERROR]'
        : statusCode >= 400
        ? '[WARN]'
        : statusCode >= 300
        ? '[REDIRECT]'
        : '[INFO]';

    console.log(
      `${statusBadge} [${timestamp}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`
    );
  });

  next();
};

module.exports = requestLogger;
