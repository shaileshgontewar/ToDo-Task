const Task = require("../models/Task");
const User = require("../models/User");

exports.createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    console.log(req.body, "req.body");
    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const task = new Task({
      userId: req.user.id,
      title,
      description,
      date,
    });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, date } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    console.log(task.userId !== req.user.id);
    console.log(task.userId.toString(), req.user.id);

    if (task.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.date = date || task.date;

    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this task" });
    }
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};
exports.getAllTasks = async (req, res) => {
  const { userId } = req.params;
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const tasks = await Task.find({ userId }).populate("userId", "name email");
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "_id name email"
    );
    const tasks = await Task.find();
    const usersWithTasks = users.map((user) => ({
      userId: user._id,
      name: user.name,
      email: user.email,
      tasks: tasks.filter(
        (task) => task.userId.toString() === user._id.toString()
      ),
    }));
    res.status(200).json(usersWithTasks);
  } catch (error) {
    console.error("Error fetching users and tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks" });
  }
};
