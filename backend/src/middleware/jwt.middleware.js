import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtAuth = (req, res, next) => {
  // 1. Read the token.
  const token = req.headers.authorization?.split(" ")[1] ;  // Ensure the token is prefixed with "Bearer "
  // console.log(req.headers);
  // console.log(req.cookies);
  // const token = req.headers.authorization;

  console.log(token);
  // 2. if no token, return the error.
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  // 3. check if token is valid.
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userID = payload.userID;
    req.userType = payload.userType; // include the user type in the request
  } catch (err) {
    // 4. return error.
    console.log(err);
    return res.status(401).send('Unauthorized');
  }
  // 5. call next middleware
  next();
};

export default jwtAuth;
