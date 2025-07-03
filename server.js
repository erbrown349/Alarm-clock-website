
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:5500"];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db, alarms;

async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
    db = client.db("alarmclock");
    alarms = db.collection("alarms");
    console.log("MongoDB connected");
  }
}

async function closeDB() {
  await client.close();
}

app.post("/api/alarms", async (req, res) => {
  const { time } = req.body;
  if (!time) return res.status(400).json({ error: "Missing time" });

  await connectDB();
  const result = await alarms.insertOne({ time, createdAt: new Date() });
  res.json({ success: true, id: result.insertedId });
});

app.get("/api/alarms", async (req, res) => {
  await connectDB();
  const saved = await alarms.find().sort({ createdAt: -1 }).limit(10).toArray();
  res.json(saved);
});

export { app as default, closeDB };