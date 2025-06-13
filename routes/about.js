
const { Router } = require("express");
const About = require("../models/about");
const router = Router();

// Render all about entries (normal view)
router.get("/view", async (req, res) => {
  const abouts = await About.find();
  res.render("view-about", { abouts, message: null });
});

// About in JSON format
router.get("/json", async (req, res) => {
  const abouts = await About.find();
  res.json(abouts);
});

router.get("/create", (req, res) => {
  res.render("edit-about", { about: {}, message: null });
});

router.post("/create", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).render("edit-about", { about: req.body, message: "About field is required" });
    }
    await About.create({ content });
    res.redirect("/api/about/view");
  } catch (error) {
    res.status(500).render("edit-about", { about: req.body, message: error.message });
  }
});

router.get("/edit/:id", async (req, res) => {
  const about = await About.findById(req.params.id);
  res.render("edit-about", { about, message: null });
});

router.post("/update/:id", async (req, res) => {
  try {
    await About.findByIdAndUpdate(req.params.id, { content: req.body.content });
    res.redirect("/api/about/view");
  } catch (error) {
    res.status(500).render("edit-about", { about: req.body, message: error.message });
  }
});

router.post("/delete/:id", async (req, res) => {
  await About.findByIdAndDelete(req.params.id);
  res.redirect("/api/about/view");
});

module.exports = router;