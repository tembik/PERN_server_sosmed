const express = require("express");
const router = express.Router();
const { validateToken } = require("../auth/loginAuth");
const komenControlller = require("../controllers/komenController")

router.get('/:id', validateToken, komenControlller.getAllData)

router.post('/', validateToken, komenControlller.createData)

router.delete('/:id', validateToken, komenControlller.deleteData)

module.exports = router