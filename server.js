const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");


dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use(errorMiddleware);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
