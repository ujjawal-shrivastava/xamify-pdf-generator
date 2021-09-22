const router = require("express").Router();

router.get("/", async(req, res, next) => {
    res.send("Generator");
});

module.exports = router;