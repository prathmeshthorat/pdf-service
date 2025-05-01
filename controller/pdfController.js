const express = require("express");
const router = express.Router();
const { pdfValidationRules, validate } = require("../middleware/validation");
const pdfService = require("../service/pdfService");

router.post("/generate-pdf", pdfValidationRules, validate, async (req, res) => {
  try {
    const { source, data } = req.body;
    const pdfBuffer = await pdfService.createPDF(source, data);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="generated.pdf"'
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error during PDF generation process:", error);
    res.status(500).json({
      errors: [
        { msg: "An internal server error occurred during PDF generation." },
      ],
    });
  }
});

router.get("/", (req, res) => {
  res.send("Handlebars PDF Generation API is running. Use POST /generate-pdf");
});

module.exports = router;
