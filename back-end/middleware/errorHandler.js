// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
  console.error(err);
  const status  = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
};