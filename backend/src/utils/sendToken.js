import dotenv from "dotenv";
dotenv.config();

export const sendToken = async (user, token, res, statusCode) => {
  
  res
    .status(statusCode)
    .cookie("token", token)
    .json({ success: true, user, token });

};
