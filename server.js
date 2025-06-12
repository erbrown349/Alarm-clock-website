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

const port = 5001;  

const client = new MongoClient(process.env.MONGO_URI); 
let db, alarms;  

async function startServer() { 
    await client.connect();  
    console.log("MongoDB connected"); 
    db = client.db("alarmclock"); 
    alarms = db.collection("alarms"); 

    app.listen(port, () => { 
        console.log(`Server running on http://localhost:${port}`);
    });
} 
startServer(); 

app.post("/api/alarms", async(req, res) => { 
    const { time } = req.body;
    if (!time) return res.status(400).json({ error: "Missing time" }); 

    const result = await alarms.insertOne({ time, createdAt: new Date()}); 
    res.json({ success: true, id: result.insertedId });
}); 

app.get("/api/alarms", async (req, res) => { 
    const saved = await alarms.find() 
        .sort({ createdAt: -1})
        .limit(10)
        .toArray(); 
    res.json(saved); 
});

/**import express from "express";
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

const port = 5001;  

const client = new MongoClient(process.env.MONGO_URI); 
let db, alarms;  

async function startServer() { 
    await client.connect();  
    console.log("MongoDB connected"); 
    db = client.db("alarmclock"); 
    alarms = db.collection("alarms"); 

    app.listen(port,() => { 
        console.log(`Server running on http://localhost:${port}`);
    });
} 
startServer(); 

app.post("/api/alarms", async(req, res) => { 
    const { time } = req.body;
    if (!time) return res.status(400).json({ error: "Missing time" }); 

    const result = await alarms.insertOne({ time, createdAt: new Date()}); 
    res.json({ success: true, id: result.insertedId });
}); 

app.get("/api/alarms", async (req, res) => { 
    const saved = await alarms.find() 
        .sort({ createdAt: -1})
        .limit(10)
        .toArray(); 
        res.json(saved); 
}); 
**/