const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/history");
const upload = require("./routes/upload");
const aiRoutes = require("./routes/ai");
const settingRoutes =require('./routes/settings');
const adminRoutes = require("./routes/admin");
const cors = require("cors");

connectDB();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb',  extended: true }))
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/history",historyRoutes);
app.use("/api/upload",upload);
app.use('/api/ai', aiRoutes);
app.use('/api/settings',settingRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
