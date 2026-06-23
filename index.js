const express = require("express");

const app = express();

app.use(express.json());

let students = [
  { id: 1, name: "Aldin", course: "MERN" },
  { id: 2, name: "John", course: "Node.js" }
];

// GET route
app.get("/", (req, res) => {
  res.send("API is working");
});

// GET all students
app.get("/students", (req, res) => {
  res.json(students);
});

// GET single student
app.get("/students/:id", (req, res) => {
  const student = students.find(s => s.id == req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// POST new student
app.post("/students", (req, res) => {
  const newStudent = {
    id: students.length + 1,
    name: req.body.name,
    course: req.body.course
  };

  students.push(newStudent);

  res.status(201).json({
    message: "Student added successfully",
    student: newStudent
  });
});

// PUT update student
app.put("/students/:id", (req, res) => {
  const student = students.find(s => s.id == req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  student.name = req.body.name;
  student.course = req.body.course;

  res.json({
    message: "Student updated successfully",
    student: student
  });
});

// DELETE student
app.delete("/students/:id", (req, res) => {
  students = students.filter(s => s.id != req.params.id);

  res.json({
    message: "Student deleted successfully"
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});