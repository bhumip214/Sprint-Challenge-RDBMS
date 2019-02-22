const express = require("express");
const router = express.Router();
const knex = require("knex");
const knexConfig = require("../knexfile");

const db = knex(knexConfig.development);

router.use(express.json());

const charlimit = (req, res, next) => {
  const name = req.body.name;
  if (name.length <= 128) {
    next();
  } else {
    res.status(400).json({ message: "Name must be 128 characters or less." });
  }
};

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await db("projects");
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The projects information could not be retrieved."
    });
  }
});

// Create project request
router.post("/", charlimit, async (req, res) => {
  try {
    if (req.body.name && req.body.description) {
      const [id] = await db("projects").insert(req.body);

      const project = await db("projects")
        .where({ id })
        .first();
      res
        .status(201)
        .json({
          ...project,
          completed: project.completed === 1 ? true : false
        });
    } else {
      res.status(400).json({
        errorMessage: "Please provide the name and description for the project."
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error while saving the project to the database"
    });
  }
});

module.exports = router;
