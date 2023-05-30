const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const upload = require("../utils/multer");
const { validateToken } = require("../auth/loginAuth");

router.get("/", validateToken, postController.getAllData);

router.get("/userpost/:id", validateToken, postController.getUserPost);

router.get("/:id", validateToken, postController.getOneData);

router.post("/", validateToken, upload.single("image"), postController.createPost);

router.put("/:id", validateToken, upload.single("image"), postController.updatePost);

router.delete("/:id", validateToken, postController.deleteData);

module.exports = router;
