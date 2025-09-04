const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log(`🔵 [${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';
    
    console.log(
      `${statusColor} [${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ` +
      `Status: ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};

export default logger;
