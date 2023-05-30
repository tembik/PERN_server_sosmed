// const { User } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const db = require("../config/dbConnection");

// const getAllUser = async (req, res) => {
//   try {
//     const hasil = await User.findAll({
//       attributes: ["id", "username", "createdAt", "updatedAt"],
//     });
//     res.json(hasil);
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const getAllUser = async (req, res) => {
  try {
    const q = "SELECT * FROM users ORDER BY created_at DESC";
    const hasil = await db.query(q);
    res.json(hasil.rows);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const getOneUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const hasil = await User.findOne({
//       where: { id: id },
//       attributes: ["id", "username", "createdAt", "updatedAt"],
//     });
//     res.json(hasil);
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const getOneUser = async (req, res) => {
  try {
    const id = req.params.id;
    const q = "SELECT * FROM users WHERE id = $1";
    const hasil = await db.query(q, [id]);
    res.json(hasil.rows);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// register user
// const regUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const userCek = await User.findOne({ where: { username: username } });
//     if (userCek) {
//       res.json({ gagal: "username sudah dipakai" });
//     } else {
//       const hashedPass = await bcrypt.hash(password, 10);
//       await User.create({
//         username: username,
//         password: hashedPass,
//       });
//       res.json({ message: "berhasil melakukan pandaftaran" });
//     }
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const regUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const q = "SELECT * FROM users WHERE username = $1";
    const userCek = await db.query(q, [username]);
    if (userCek.rows[0]) {
      res.json({ message: "username sudah dipakai" });
    } else {
      const q2 = "INSERT INTO users(username, password) VALUES($1, $2)";
      const hashedPass = await bcrypt.hash(password, 10);
      await db.query(q2, [username, hashedPass]);
      res.json({ message: "register berhasil" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

// login user
// const logUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const userCek = await User.findOne({ where: { username: username } });
//     if (!userCek) {
//       res.json({ message: "username belum terdaftar" });
//     } else {
//       const passCek = await bcrypt.compare(password, userCek.password);
//       if (!passCek) {
//         res.json({ message: "password salah" });
//       } else {
//         // res.json({ message: "log in berhasil" });
//         const accessToken = sign(
//           { username: userCek.username, id: userCek.id },
//           "rahasia"
//         );
//         res.json({
//           token: accessToken,
//           username: userCek.username,
//           id: userCek.id,
//         });
//       }
//     }
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

// login user
const logUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const q = "SELECT * FROM users WHERE username = $1";
    const userCek = await db.query(q, [username]);
    if (!userCek.rows[0]) {
      res.json({ message: "username belum terdaftar" });
    } else {
      const passCek = await bcrypt.compare(password, userCek.rows[0].password);
      if (!passCek) {
        res.json({ message: "password salah" });
      } else {
        const accessToken = sign(
          { username: userCek.rows[0].username, id: userCek.rows[0].id },
          "rahasia"
        );
        res.json({
          token: accessToken,
          username: userCek.rows[0].username,
          id: userCek.rows[0].id,
        });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const updateUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     await User.update(req.body, { where: { id: id } });
//     res.json({ message: "data berhasil di update" });
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

// ganti username
// const updateUsername = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const userCek = await User.findOne({ where: { id: id } });
//     if (req.user.id === userCek.id) {
//       const username = req.body.username;
//       const usernameCek = await User.findOne({ where: { username: username } });
//       if (usernameCek) {
//         res.json({ message: "username sudah dipakai" });
//       } else {
//         await User.update({ username: username }, { where: { id: id } });
//         res.json({ message: "username berhasil diubah" });
//       }
//     } else {
//       res.json({ message: "user not authorized" });
//     }
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

// ganti username
const updateUsername = async (req, res) => {
  try {
    const id = req.params.id;
    const q = "SELECT * FROM users WHERE id = $1";
    const userCek = await db.query(q, [id]);
    if (req.user.id === userCek.rows[0].id) {
      const q2 = "SELECT * FROM users WHERE username = $1";
      const username = req.body.username;
      const usernameCek = await db.query(q2, [username]);
      if (usernameCek.rows[0]) {
        res.json({ message: "username sudah dipakai" });
      } else {
        const q3 = "UPDATE users SET username = $1 WHERE id = $2";
        await db.query(q3, [username, id]);
        res.json({ message: "username berhasil diubah" });
      }
    } else {
      res.json({ message: "user not authorized" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

// ganti password
// const updatePassword = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const userCek = await User.findOne({ where: { id: id } });
//     if (req.user.id === userCek.id) {
//       const { passwordLama, passwordBaru } = req.body;
//       const passCek = await bcrypt.compare(passwordLama, userCek.password);
//       if (passCek) {
//         const hashPassword = await bcrypt.hash(passwordBaru, 10);
//         await User.update({ password: hashPassword }, { where: { id: id } });
//         res.json({ message: "password berhasil diubah" });
//       } else {
//         res.json({ message: "masukkan password lama anda dengan benar" });
//       }
//     } else {
//       res.json({ message: "user not authorized" });
//     }
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

// ganti password
const updatePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const q = "SELECT * FROM users WHERE id = $1";
    const userCek = await db.query(q, [id]);
    if (req.user.id === userCek.rows[0].id) {
      const password = req.body.password;
      const q2 = "UPDATE users SET password = $1 WHERE id = $2";
      const hashPassword = await bcrypt.hash(password, 10);
      await db.query(q2, [hashPassword, id]);
      res.json({ message: "password berhasil diubah" });
    } else {
      res.json({ message: "user not authorized" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

// const deleteUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const userCek = await User.findOne({ where: { id: id } });
//     if (req.user.id === userCek.id) {
//       await User.destroy({ where: { id: id } });
//       res.json({ message: "user berhasil dihapus" });
//     } else {
//       res.json({ message: "user not authorized" });
//     }
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const q = "SELECT * FROM users WHERE id = $1";
    const userCek = await db.query(q, [id]);
    if (!userCek.rows[0]) {
      res.json({ message: "user tidak ditemukan" });
    } else {
      if (req.user.id === userCek.rows[0].id) {
        const q2 = "DELETE FROM users WHERE id = $1";
        await db.query(q2, [id]);
        res.json({ message: "user berhasil dihapus" });
      } else {
        res.json({ message: "user not authorized" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

const userAuth = (req, res) => {
  res.json(req.user);
};

module.exports = {
  getAllUser,
  getOneUser,
  regUser,
  logUser,
  // updateUser,
  updateUsername,
  updatePassword,
  deleteUser,
  userAuth,
};
