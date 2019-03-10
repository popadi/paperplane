const utilsService = require('../utils/utilsService');
const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {
    utilsService.solveCorsProblems(res);
    res.send("It works!");
});

module.exports = router;