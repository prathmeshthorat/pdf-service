const express = require("express");
const pdfController = require("./controller/pdfController");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/", pdfController);

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
