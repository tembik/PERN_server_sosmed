// const { Post } = require("../models");
// const { User } = require("../models");
const db = require("../config/dbConnection");
const cloudinary = require("../utils/cloudinary");
// const fs = require("fs");

// const getAllData = async (req, res) => {
//   try {
//     const hasil = await Post.findAll({
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
    const q =
      "SELECT post.id, isi, gambar, post.created_at, users.id AS user_id, username FROM post LEFT OUTER JOIN users ON post.users_id = users.id ORDER BY post.created_at DESC";
    const hasil = await db.query(q);
    res.json(hasil.rows);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const getUserPost = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const hasil = await Post.findAll({
//       where: { userId: id },
//       include: [{ model: User, attributes: ["id", "username"] }],
//       order: [["createdAt", "DESC"]],
//     });
//     res.json(hasil);
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const getUserPost = async (req, res) => {
  try {
    const id = req.params.id;
    const q =
      "SELECT post.id, isi, gambar, post.created_at, users.id AS user_id, username FROM post LEFT OUTER JOIN users ON post.users_id = users.id WHERE post.users_id = $1 ORDER BY post.created_at DESC";
    const hasil = await db.query(q, [id]);
    res.json(hasil.rows);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const getOneData = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const hasil = await Post.findOne({
//       where: { id: id },
//       include: [{ model: User, attributes: ["id", "username"] }],
//     });
//     res.json(hasil);
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const getOneData = async (req, res) => {
  try {
    const id = req.params.id;
    const q =
      "SELECT post.id, isi, gambar, post.created_at, users.id AS user_id, username FROM post LEFT OUTER JOIN users ON post.users_id = users.id WHERE post.id = $1 ORDER BY post.created_at DESC";
    const hasil = await db.query(q, [id]);
    res.json(hasil.rows[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const createPost = async (req, res) => {
//   try {
//     if (req.file) {
//       // const hasil = await cloudinary.uploader.upload(req.file.path);
//       // req.body.gambar = hasil.secure_url;
//       // req.body.cloudinary_id = hasil.public_id;
//       req.body.gambar = req.file.path;
//     }
//     req.body.userId = req.user.id;
//     await Post.create(req.body);
//     res.json({ message: "data berhasil ditambah" });
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const createPost = async (req, res) => {
  try {
    if (req.file) {
      const hasil = await cloudinary.uploader.upload(req.file.path);
      req.body.gambar = hasil.secure_url;
      req.body.cloudinary_id = hasil.public_id;
      // req.body.gambar = req.file.path;
    }
    req.body.users_id = req.user.id;
    const q =
      "INSERT INTO post(isi, gambar, users_id, cloudinary_id) VALUES($1, $2, $3, $4)";
    await db.query(q, [
      req.body.isi,
      req.body.gambar,
      req.body.users_id,
      req.body.cloudinary_id,
    ]);
    res.json({ message: "data berhasil ditambah" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const updatePost = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const post = await Post.findOne({ where: { id: id } });
//     if (req.user.id === post.userId) {
//       if (req.file) {
//         if (post.gambar !== null) {
//           // cloudinary.uploader.destroy(post.cloudinary_id);
//           const filepath = `./${post.gambar}`;
//           fs.unlinkSync(filepath);
//         }
//         req.body.gambar = req.file.path;
//         // const hasil = await cloudinary.uploader.upload(req.file.path);
//         // req.body.gambar = hasil.secure_url;
//         // req.body.cloudinary_id = hasil.public_id;
//       }
//       await Post.update(req.body, { where: { id: id } });
//       res.json({ message: "data berhasil di update" });
//     } else {
//       res.json({ message: "user not authorized" });
//     }
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const q = "SELECT * FROM post WHERE id = $1";
    const post = await db.query(q, [id]);
    if (req.user.id === post.rows[0].users_id) {
      if (req.file) {
        if (post.rows[0].gambar !== null) {
          await cloudinary.uploader.destroy(post.rows[0].cloudinary_id);
          // const filepath = `./${post.rows[0].gambar}`;
          // fs.unlinkSync(filepath);
        }
        // req.body.gambar = req.file.path;
        const hasil = await cloudinary.uploader.upload(req.file.path);
        req.body.gambar = hasil.secure_url;
        req.body.cloudinary_id = hasil.public_id;

        const q2 =
          "UPDATE post SET isi = $1, gambar = $2, cloudinary_id = $3 WHERE id = $4";
        await db.query(q2, [
          req.body.isi,
          req.body.gambar,
          req.body.cloudinary_id,
          id,
        ]);
      } else {
        const q3 = "UPDATE post SET isi = $1 WHERE id = $2";
        await db.query(q3, [req.body.isi, id]);
      }
      res.json({ message: "data berhasil di update" });
    } else {
      res.json({ message: "user not authorized" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const deleteData = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const post = await Post.findOne({ where: { id: id } });
//     if (req.user.id === post.userId) {
//       if (post.gambar !== null) {
//         // await cloudinary.uploader.destroy(post.cloudinary_id);
//         const filepath = `./${post.gambar}`;
//         fs.unlinkSync(filepath);
//       }
//       await Post.destroy({ where: { id: id } });
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
    const q = "SELECT * FROM post WHERE id = $1";
    const post = await db.query(q, [id]);
    if (req.user.id === post.rows[0].users_id) {
      if (post.rows[0].gambar !== null) {
        await cloudinary.uploader.destroy(post.rows[0].cloudinary_id);
        // const filepath = `./${post.rows[0].gambar}`;
        // fs.unlinkSync(filepath);
      }
      const q2 = "DELETE FROM post WHERE id = $1";
      await db.query(q2, [id]);
      res.json({ message: "data berhasil dihapus" });
    } else {
      res.json({ message: "user not authorized" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  getAllData,
  getUserPost,
  getOneData,
  createPost,
  updatePost,
  deleteData,
};
