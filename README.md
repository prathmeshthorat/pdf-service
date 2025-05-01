# PDF Generation Service

This project is a PDF generation service built with Node.js. It provides functionality to generate PDFs using predefined templates.

## Prerequisites

Before running the project locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

Follow these steps to set up and run the project locally:

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd pdf-generation-service
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Project**

   ```bash
   node server.js
   ```

4. **Access the Service**
   The service will be running at `http://localhost:3000` (or the port specified in your `server.js` file).

## Project Structure

- `controller/`: Contains the controllers for handling requests (e.g., `pdfController.js`).
- `middleware/`: Contains middleware for request validation (e.g., `validation.js`).
- `service/`: Contains the business logic (e.g., `pdfService.js`).
- `templates/`: Contains HTML templates used for PDF generation.
- `utils/`: Utility functions used across the project.

## Example CURL Request

To generate a PDF using the service, you can use the following `curl` command:

```bash
curl --location 'http://localhost:3000/generate-pdf' \
--header 'Content-Type: application/json' \
--data-raw '{
  "source": {
    "url": "https://www.amazon.de/-/en/ref=nav_logo"
  },
  "data": {
    "username": "Bob",
    "generationDate": "2025-05-01",
    "email": "bob@example.com",
    "details": "This user is currently active."
  }
}'
```

Replace `amazon-de-home` with the desired template name and provide the appropriate data in the JSON payload.

## Notes

- Ensure that the `templates/` directory contains the required HTML files for PDF generation.
- Modify the `server.js` file if you need to change the default port or add additional configurations.

## License

This project is licensed under the MIT License.
