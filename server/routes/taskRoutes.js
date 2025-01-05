const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getUserTasks,
  getAllUsers,
} = require("../controllers/taskController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, createTask);
router.put("/:taskId", verifyToken, updateTask);
router.delete("/:taskId", verifyToken, deleteTask);
router.get("/alltasks/:userId", verifyToken, getAllTasks);
router.get("/user", verifyToken, getUserTasks);
router.get("/allusers", verifyToken, getAllUsers);

module.exports = router;
