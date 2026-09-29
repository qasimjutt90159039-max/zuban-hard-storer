const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);

module.exports = router;
