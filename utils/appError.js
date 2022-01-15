class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.construtor);
  }
}

// const AppError = (message, statusCode) => {
//   const err = new Error(message);
//   err.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
//   err.statusCode = statusCode;
//   console.log(err);
//   return err;
// };

module.exports = AppError;
