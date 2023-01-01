const express = require("express");
const { getProductStaticRoute, getProductRoute } = require("../controllers/products");

const router = express.Router();


router.route("/").get(getProductRoute);
router.route("/static").get(getProductStaticRoute);

module.exports = router;