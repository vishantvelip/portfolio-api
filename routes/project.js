const { Router } = require("express");
const Project = require("../models/project");
const fs = require("fs").promises;
const path = require("path");
const upload = require("../middleware/multerConfig");
const mongoose = require("mongoose");

const router = Router();

// Render all projects (normal view)
router.get("/view", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const query = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { title: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};
    const projects = await Project.find(query);
    res.render("view-project", { projects, message: null, searchQuery });
  } catch (error) {
    res.status(500).render("view-project", {
      projects: [],
      message: error.message,
      searchQuery: "",
    });
  }
});

// All projects in JSON format
router.get("/json", async (req, res) => {
  try {
    const projects = await Project.find();
    // Add base URL to projectImg for frontend consumption
    const projectsWithFullImagePath = projects.map(project => ({
      ...project.toObject(),
      projectImg: project.projectImg
        ? `https://portfolio-api-epzm.onrender.com/${project.projectImg}`
        : "",
    }));
    res.json(projectsWithFullImagePath);
  } catch (error) {
    res.status(500).json({ message: "Failed to load projects", error: error.message });
  }
});

// Create Project (form)
router.get("/create", (req, res) => {
  res.render("edit-project", { project: {}, message: null });
});

router.post("/create", upload.single("projectImg"), async (req, res) => {
  try {
    const { name, title, description, projectsUrl } = req.body;
    if (!name || !title || !description || !projectsUrl) {
      return res.status(400).render("edit-project", {
        project: req.body,
        message: "All fields are required, including Project URL",
      });
    }
    let projectImg = "";
    if (req.file) {
      projectImg = `uploads/${req.file.filename}`;
    }
    const newProject = new Project({ name, title, description, projectImg, projectsUrl });
    await newProject.save();
    res.redirect("/api/projects/view");
  } catch (error) {
    res.status(500).render("edit-project", {
      project: req.body,
      message: error.message || "Failed to create project",
    });
  }
});

// Edit project form
router.get("/edit/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).render("view-project", {
        projects: await Project.find(),
        message: "Project not found",
        searchQuery: "",
      });
    }
    res.render("edit-project", { project, message: null });
  } catch (error) {
    res.status(500).render("view-project", {
      projects: await Project.find(),
      message: error.message,
      searchQuery: "",
    });
  }
});

// Update a project
router.post("/update/:id", upload.single("projectImg"), async (req, res) => {
  try {
    const { name, title, description, projectsUrl } = req.body;
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).render("view-project", {
        projects: await Project.find(),
        message: "Project not found",
        searchQuery: "",
      });
    }
    if (!name || !title || !description || !projectsUrl) {
      return res.status(400).render("edit-project", {
        project,
        message: "All fields are required, including Project URL",
      });
    }
    let projectImg = project.projectImg;
    if (req.file) {
      if (projectImg) {
        try {
          await fs.unlink(path.join(__dirname, "../public", projectImg));
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      projectImg = `uploads/${req.file.filename}`;
    }
    await Project.findByIdAndUpdate(req.params.id, {
      name,
      title,
      description,
      projectImg,
      projectsUrl,
    });
    res.redirect("/api/projects/view");
  } catch (error) {
    res.status(500).render("edit-project", {
      project: await Project.findById(req.params.id),
      message: error.message || "Failed to update project",
    });
  }
});

// Delete a project
router.post("/delete/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).render("view-project", {
        projects: await Project.find(),
        message: "Project not found",
        searchQuery: "",
      });
    }
    if (project.projectImg) {
      try {
        await fs.unlink(path.join(__dirname, "../public", project.projectImg));
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    await Project.findByIdAndDelete(req.params.id);
    res.redirect("/api/projects/view");
  } catch (error) {
    res.status(500).render("view-project", {
      projects: await Project.find(),
      message: "Failed to delete project",
      searchQuery: "",
    });
  }
});

module.exports = router;
