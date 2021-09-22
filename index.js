require("dotenv").config();

// express
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

// routes
app.use("/generate", require("./src/generate"));
app.get("/ping", (_, res) => res.send("pong"));

// error handler
app.use(async(err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res
        .status(err.status || 500)
        .send({ error: err.message || "Some error occured" });
});

const PORT = process.env.PORT || 8000;

module.export = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});