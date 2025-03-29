
const errorHandler = (err, req, res, next) => {
    if (err instanceof Error) {
      const statusCode = err.status || 500; 
      const errorMessage = err.message || "An unknown error occurred";
  
      return res.status(statusCode).json({
        error: errorMessage,
      });
    }
  
    return res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  };
  
export default errorHandler;
  