const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const filesDir = path.join(__dirname, "files");

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure files directory exists
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

// Default content to show in the editor if no file is selected
const defaultContent = "// Welcome! Start coding here.\n\nconsole.log('Hello, World!');";

// Render the index page with the list of files and default content
app.get("/", (req, res) => {
  fs.readdir(filesDir, (err, files) => {
    if (err) throw err;
    res.render("index", { files, defaultContent });
  });
});

// Create a new file
app.post("/create-file", (req, res) => {
  const fileName = req.body.fileName.trim();
  if (!fileName) return res.redirect("/");

  const filePath = path.join(filesDir, fileName);

  fs.writeFile(filePath, "", (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Fetch file content
app.get("/open-file/:fileName", (req, res) => {
  const filePath = path.join(filesDir, req.params.fileName);

  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) return res.status(404).json({ error: "File not found" });
    res.json({ content });
  });
});

// Save file content
app.post("/save-file", (req, res) => {
  const { fileName, content } = req.body;
  const filePath = path.join(filesDir, fileName);

  fs.writeFile(filePath, content, (err) => {
    if (err) return res.status(500).json({ error: "Failed to save file" });
    res.status(200).send("File saved successfully");
  });
});

// Delete a file
app.delete("/delete-file/:fileName", (req, res) => {
  const filePath = path.join(filesDir, req.params.fileName);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).json({ error: "File not found" });
    res.status(200).send("File deleted successfully");
  });
});


// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
 