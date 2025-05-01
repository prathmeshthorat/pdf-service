const { body, validationResult, oneOf } = require("express-validator");

const pdfValidationRules = [
  body("data")
    .isObject()
    .withMessage('The "data" field must be a JSON object.'),

  body("source").exists().withMessage('The "source" field is required.'),

  oneOf(
    [
      body("source.html")
        .isString()
        .notEmpty()
        .withMessage('If provided, "source.html" must be a non-empty string.'),
      body("source.url")
        .isURL()
        .withMessage('If provided, "source.url" must be a valid URL.'),
    ],
    'Provide either "source.html" (string) or "source.url" (URL), but not both.'
  ),

  body().custom((value, { req }) => {
    const hasHtml =
      req.body.source &&
      typeof req.body.source.html === "string" &&
      req.body.source.html.length > 0;
    const hasUrl =
      req.body.source &&
      typeof req.body.source.url === "string" &&
      req.body.source.url.length > 0;
    if (hasHtml && hasUrl) {
      throw new Error(
        'Provide either "source.html" or "source.url", but not both.'
      );
    }
    if (!hasHtml && !hasUrl) {
      throw new Error(
        'Missing required field: either "source.html" or "source.url" must be provided.'
      );
    }
    return true;
  }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  pdfValidationRules,
  validate,
};
