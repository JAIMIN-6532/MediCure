import dotenv from "dotenv";
dotenv.config();

export const sendToken = async (user, token, res, statusCode) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 //5 hours
    ),
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({ success: true, user, token });
};
