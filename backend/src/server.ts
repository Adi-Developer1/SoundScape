import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import weatherRoute from "./routes/weather";
import musicRoute from "./routes/music";

dotenv.config();
const app = express();

app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend running successfully!!!!"));
app.use("/api/weather", weatherRoute);
app.use("/api/music", musicRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Backend running successfully on port ${PORT}`));
