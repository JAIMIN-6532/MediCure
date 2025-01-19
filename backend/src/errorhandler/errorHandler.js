// errorHandler.js (middleware)

const errorHandler = (err, req, res, next) => {
    if (err instanceof Error) {
      // Custom error
      const statusCode = err.status || 500; // Default to 500 if no status code is provided
      const errorMessage = err.message || "An unknown error occurred";
  
      // Send a structured error response to the client
      return res.status(statusCode).json({
        error: errorMessage,
      });
    }
  
    // Handle unexpected errors (in case it's not an instance of Error)
    return res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  };
  
export default errorHandler;
  