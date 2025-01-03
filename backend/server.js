import server from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";

dotenv.config();

console.log(process.env.PORT);
const serverStart = server.listen(process.env.PORT, async (err) => {
  if (err) {
    console.log(`server failed with error ${err}`);
  } else {
    await connectDB();
    console.log(`server is running at http://localhost:${process.env.PORT}`);
  }
});
