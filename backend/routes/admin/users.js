// backend/routes/admin/users.js
const router = require('express').Router();
const { getUsers } = require('../../controllers/admin/usersController');

// GET /api/admin/users?search=&role=&active=&page=&limit=
router.get('/', getUsers);

module.exports = router;
