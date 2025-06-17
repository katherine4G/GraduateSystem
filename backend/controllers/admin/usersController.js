// backend/controllers/admin/usersController.js
const { listUsersPaginated } = require('../../models/admin/usersModel');

async function getUsers(req, res) {
  try {
    const { search, role, page, limit } = req.query;
    const pageNum = parseInt(page)  || 1;
    const limNum  = parseInt(limit) || 10;

    const result = await listUsersPaginated({
      search,
      role,
      page: pageNum,
      limit: limNum,
    });
    res.json(result); // { users, totalPages }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
}

module.exports = { getUsers };
