const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateToken } = require("../auth/loginAuth");

router.get("/", userController.getAllUser);

router.get("/:id", userController.getOneUser);

router.post("/register", userController.regUser);

router.post("/login", userController.logUser);

// router.put("/:id", userController.updateUser);

router.put("/gantiuser/:id", validateToken, userController.updateUsername);

router.put("/gantipass/:id", validateToken, userController.updatePassword);

router.delete("/:id", validateToken, userController.deleteUser);

router.get("/auth", validateToken, userController.userAuth);

module.exports = router;
