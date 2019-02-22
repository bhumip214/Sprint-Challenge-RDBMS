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

//Get project by id
router.get("/:id", async (req, res) => {
  try {
    const project = await db("projects")
      .where({ id: req.params.id })
      .first();
    const actions = await db("actions").where("project_id", req.params.id);
    if (project) {
      res.status(200).json({
        ...project,
        completed: project.completed === 1 ? true : false,
        actions
      });
    } else {
      res
        .status(404)
        .json({ message: "The project with the specified ID does not exist." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The project information could not be retrieved." });
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
      res.status(201).json({
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

// Update project request
router.put("/:id", async (req, res) => {
  try {
    const count = await db("projects")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const project = await db("projects")
        .where({ id: req.params.id })
        .first();
      res.status(200).json(project);
    } else {
      res.status(404).json({
        message: "The project with the specified ID does not exist."
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The project information could not be modified." });
  }
});

//delete project request
router.delete("/:id", async (req, res) => {
  try {
    const count = await db("projects")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res
        .status(404)
        .json({ message: "The project with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ message: "The project could not be deleted" });
  }
});

module.exports = router;
