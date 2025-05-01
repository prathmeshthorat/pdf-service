const handlebars = require("handlebars");
const puppeteer = require("puppeteer");

class PDFService {
  async getHTMLContent(source, page = null) {
    if (source.html) {
      console.log("Using provided HTML string.");
      return source.html;
    } else if (source.url) {
      console.log(`Handling URL: ${source.url}`);
      return source.url;
    }
  }

  async renderTemplate(htmlContent, data) {
    try {
      console.log("Compiling Handlebars template...");
      const template = handlebars.compile(htmlContent);
      const finalHtml = template(data);
      console.log("Handlebars template rendered successfully.");
      return finalHtml;
    } catch (error) {
      console.error("Handlebars rendering error:", error.message);
      throw new Error("Error processing HTML template.");
    }
  }

  async generatePDF(html, isUrl = false) {
    let browser = null;
    try {
      console.log("Launching Puppeteer...");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      if (isUrl) {
        console.log(`Navigating to URL: ${html}`);
        await page.goto(html, {
          waitUntil: "networkidle0",
          timeout: 60000,
        });

        // Try to accept cookies after page load
        console.log("Attempting to accept cookies...");
        try {
          // Common selectors for cookie consent buttons
          const cookieSelectors = [
            ".accept-cookies",
            ".accept-all-cookies",
            ".cookie-accept",
            ".cookie-consent-accept",
            "#accept-cookies",
            "#acceptCookies",
            ".cc-accept",
            ".cc-accept-all",
            "#cookie-banner button",
            "#cookie-consent button",
            "#cookieConsent button",
            ".cookie-banner button",
            ".cookie-consent button",
            '[aria-label="Accept cookies"]',
            '[data-testid="cookie-accept"]',
            "#sp-cc-accept",
            "#sp-cc-accept-all",
          ];

          // Try each selector
          for (const selector of cookieSelectors) {
            try {
              const cookieButton = await page.$(selector);
              if (cookieButton) {
                console.log(
                  `Found cookie consent button with selector: ${selector}`
                );
                await cookieButton.click();
                console.log("Clicked cookie consent button");
                await page.waitForTimeout(1000);
                break;
              }
            } catch (selectorError) {
              continue;
            }
          }

          // Try to find buttons by their text content
          const buttonTexts = [
            "Accept All",
            "Accept all",
            "Accept",
            "I Agree",
            "I agree",
            "Agree",
            "OK",
            "Ok",
          ];

          for (const buttonText of buttonTexts) {
            try {
              const found = await page.evaluate((text) => {
                const elements = Array.from(
                  document.querySelectorAll("button")
                );
                const textButton = elements.find(
                  (el) => el.textContent.trim() === text
                );
                if (textButton) {
                  textButton.click();
                  return true;
                }
                return false;
              }, buttonText);

              if (found) {
                console.log(`Clicked button with text: ${buttonText}`);
                await page.waitForTimeout(1000);
                break;
              }
            } catch (err) {
              continue;
            }
          }

          // Wait for any cookie consent dialogs to disappear
          await page.waitForTimeout(1000);
        } catch (cookieError) {
          console.log(
            "No cookie consent dialog found or unable to accept cookies:",
            cookieError.message
          );
        }
      } else {
        console.log("Setting page content...");
        await page.setContent(html, { waitUntil: "networkidle0" });
      }

      console.log("Generating PDF...");
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      });
      console.log("PDF generated successfully.");
      return pdfBuffer;
    } finally {
      if (browser) {
        console.log("Closing Puppeteer browser...");
        await browser.close();
        console.log("Browser closed.");
      }
    }
  }

  async createPDF(source, data) {
    try {
      const htmlContent = await this.getHTMLContent(source);

      if (source.url) {
        return await this.generatePDF(htmlContent, true);
      } else {
        const renderedHtml = await this.renderTemplate(htmlContent, data);
        return await this.generatePDF(renderedHtml);
      }
    } catch (error) {
      console.error("Error in PDF generation process:", error);
      throw error;
    }
  }
}

module.exports = new PDFService();
