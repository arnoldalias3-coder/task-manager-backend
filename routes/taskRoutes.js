const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const getUserId = (req) => req.user?._id || req.user?.id;

const isValidStatus = (status) => ["pending", "completed"].includes(status);

const isValidPriority = (priority) =>
  ["low", "medium", "high"].includes(priority);

const isValidCategory = (category) =>
  ["Work", "Personal", "Study"].includes(category);

// CREATE TASK
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description = "",
      status = "pending",
      priority = "medium",
      category = "Work",
      dueDate,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!isValidStatus(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!isValidPriority(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    if (!isValidCategory(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      category,
      dueDate: dueDate || null,
      createdBy: getUserId(req),
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// GET CURRENT USER TASKS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: getUserId(req),
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching tasks",
      error: error.message,
    });
  }
});

// GET SINGLE CURRENT USER TASK
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: getUserId(req),
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching task",
      error: error.message,
    });
  }
});

// UPDATE TASK
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description = "",
      status = "pending",
      priority = "medium",
      category = "Work",
      dueDate,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!isValidStatus(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!isValidPriority(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    if (!isValidCategory(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: getUserId(req),
      },
      {
        title,
        description,
        status,
        priority,
        category,
        dueDate: dueDate || null,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

// QUICK STATUS UPDATE
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !isValidStatus(status)) {
      return res.status(400).json({
        message: "Valid status is required",
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: getUserId(req),
      },
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating task status",
      error: error.message,
    });
  }
});

// DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: getUserId(req),
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting task",
      error: error.message,
    });
  }
});

module.exports = router;