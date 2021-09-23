const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const router = require("express").Router();
const chrome = require("chrome-aws-lambda");

router.post("/", async(req, res, next) => {
    try {
        var dataBinding = req.body.submission;

        // handlebars
        // increase index by 1
        handlebars.registerHelper("inc", function(value, options) {
            return parseInt(value) + 1;
        });
        // check MCQ
        handlebars.registerHelper("isMCQ", function(value) {
            return value == "MCQ";
        });
        // check TEXT
        handlebars.registerHelper("isTYPE", function(value) {
            return value == "TYPE";
        });
        // check IMAGE
        handlebars.registerHelper("isIMAGE", function(value) {
            return value == "IMAGE";
        });

        var templateHtml = fs.readFileSync(
            path.join(process.cwd(), "./src/template.html"),
            "utf8"
        );
        var template = handlebars.compile(templateHtml);
        var finalHtml = encodeURIComponent(template(dataBinding));

        // pdf
        var options = {
            format: "A4",
            headerTemplate: "<p></p>",
            footerTemplate: "<p></p>",
            displayHeaderFooter: false,
            margin: {
                top: "30px",
                bottom: "40px",
                left: "20px",
                right: "20px",
            },
            printBackground: true,
        };

        async function getNewPage(browser) {
            let page = await browser.newPage();
            page.on("error", (err) => {
                if (!page.isClosed()) {
                    //Close page if not closed already
                    page.close();
                }
            });
            return page;
        }

        const browser = await puppeteer.launch(
            process.env.AWS_EXECUTION_ENV ?
            {
                args: chrome.args,
                executablePath: await chrome.executablePath,
                headless: chrome.headless,
            } :
            {
                args: ["--no-sandbox"],
                headless: true,
            }
        );

        const page = await getNewPage(browser);

        while (true) {
            try {
                if (page.isClosed()) {
                    page = await getNewPage(browser);
                }

                await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
                    waitUntil: "networkidle0",
                });
                const pdf = await page.pdf(options);
                await browser.close();
                res.set({
                    "Content-Type": "application/pdf",
                    "Content-Length": pdf.length,
                });
                res.send(pdf);
            } catch (error) {
                console.log(
                    "FE error with\n\n" +
                    error +
                    "\n\nRefreshing page and continuing profile switching"
                );
                await page.reload();
                continue;
            }
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;