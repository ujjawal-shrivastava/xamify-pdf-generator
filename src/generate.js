const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const router = require("express").Router();
const chrome = require("chrome-aws-lambda");

router.get("/", async(req, res, next) => {
    try {
        var dataBinding = {
            id: "b121db01-b380-40bc-9f65-74073e77db18",
            type: "ONLINE",
            createdAt: "2021-09-21T15:00:45.938Z",
            student: {
                id: "97a36cce-5f2d-4525-b460-fcfa03cc2657",
                name: "Exam Student",
                email: "examstudent@test.com",
                profile: {
                    rollNo: "4046",
                    course: {
                        name: "B.Sc. (Hons.) Computer Science",
                    },
                    year: {
                        label: "2nd Year",
                    },
                },
            },
            assessment: {
                id: "c28b87af-6dee-4a1b-b256-2d795727c21a",
                startTime: "2021-09-21T14:00:54.376Z",
                endTime: "2021-09-25T17:23:41.376Z",
                type: "DIGITAL",
                subject: {
                    id: "1333f643-def1-4b3d-9ee8-6c652f2d7839",
                    name: "DBMS",
                },
            },
            answers: [{
                    id: "a2455e3e-004e-4685-945d-a9378029136d",
                    text: null,
                    choice: null,
                    images: [{
                            id: "edd07068-fff4-4a30-8f32-1e6207933c18",
                            data: "https://uploads-ssl.webflow.com/603146d723a42e3d06a72e02/607db9ffd34f550b0ff9f0d8_Home%20Testimonials.jpg",
                        },
                        {
                            id: "ecdcb277-4042-4b8b-b298-d980df3bf41e",
                            data: "https://www.jagranjosh.com/imported/images/E/Articles/CBSE-12th-Geography-board-exam-2017-Toppers-answer-sheet.jpeg",
                        },
                    ],
                    question: {
                        id: "7d66a1ba-1e30-418d-86de-e6c9596fb981",
                        type: "IMAGE",
                        text: "A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. ... Paragraphs can contain many different kinds of information. A paragraph could contain a series of brief examples or a single long illustration of a general point.",
                        choices: [],
                    },
                },
                {
                    id: "e016e2aa-5406-468e-bf6f-2f4fc4a0cea1",
                    text: null,
                    choice: {
                        id: "1296e067-69ac-46d8-a6da-29e95e281f72",
                        text: "Option 4",
                    },
                    images: [],
                    question: {
                        id: "3d0c432e-c2f1-4b36-8a06-24cc4b8519cf",
                        type: "MCQ",
                        text: "This is a MCQ Question",
                        choices: [{
                                id: "813a7f70-20e3-495a-a63b-d995c20d2607",
                                text: "Option 1",
                            },
                            {
                                id: "3ecab0bb-07e4-408f-87ff-945f69c01fa9",
                                text: "Option 2",
                            },
                            {
                                id: "ee9e4113-89c4-4e37-8d60-a2e8a530d4d5",
                                text: "Option 3",
                            },
                            {
                                id: "1296e067-69ac-46d8-a6da-29e95e281f72",
                                text: "Option 4",
                            },
                        ],
                    },
                },
                {
                    id: "98d4d8f1-8142-440b-8b3e-a0eb7fa93c67",
                    text: "Some text answer",
                    choice: null,
                    images: [],
                    question: {
                        id: "bd9e6ebc-41d9-46a3-a4b6-c47e45cbecef",
                        type: "TYPE",
                        text: "This is a TYPE Question",
                        choices: [],
                    },
                },
            ],
        };

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
            path: "answerSheet.pdf",
        };

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

        const page = await browser.newPage();
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
        next(error);
    }
});

module.exports = router;