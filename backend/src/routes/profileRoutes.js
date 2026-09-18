const express = require("express");

const {
  getProfile,
  create,
  update,
} = require("../controllers/profileController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getProfile);
router.post("/", authenticateToken, create);
router.put("/", authenticateToken, update);

module.exports = router;
