// const { User } = require("../models");
// const { Post } = require("../models");
// const { Komentar } = require("../models");
const db = require("../config/dbConnection");

// const getAllData = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const hasil = await Komentar.findAll({
//       where: { postId: id },
//       include: [
//         {
//           model: User,
//           attributes: ["id", "username"],
//         },
//       ],
//       order: [["createdAt", "DESC"]],
//     });
//     res.json(hasil);
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const getAllData = async (req, res) => {
  try {
    const id = req.params.id;
    const q =
      "SELECT komentar.id, isi, komentar.created_at, users.id AS user_id, username FROM komentar LEFT OUTER JOIN users ON komentar.users_id = users.id WHERE komentar.post_id = $1 ORDER BY komentar.created_at DESC";
    const hasil = await db.query(q, [id])
    res.json(hasil.rows);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const createData = async (req, res) => {
//   try {
//     await Komentar.create({
//       isi: req.body.isi,
//       userId: req.user.id,
//       postId: req.body.postId,
//     });
//     res.json({ message: "data berhasil ditambah" });
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const createData = async (req, res) => {
  try {
    const q = "INSERT INTO komentar(isi, users_id, post_id) VALUES($1, $2, $3)";
    await db.query(q, [req.body.isi, req.user.id, req.body.post_id])
    res.json({ message: "data berhasil ditambah" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const deleteData = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const komentar = await Komentar.findOne({ where: { id: id } });
//     if (req.user.id === komentar.userId) {
//       await Komentar.destroy({ where: { id: id } });
//       res.json({ message: "data berhasil dihapus" });
//     } else {
//       res.json({ message: "user not authorized" });
//     }
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    const q = "SELECT * FROM komentar WHERE id = $1";
    const komentar = await db.query(q, [id])
    if (req.user.id === komentar.rows[0].users_id) {
      const q2 = "DELETE FROM komentar where id = $1";
      await db.query(q2, [id])
      res.json({ message: "data berhasil dihapus" });
    } else {
      res.json({ message: "user not authorized" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = { getAllData, createData, deleteData };
