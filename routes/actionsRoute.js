const express = require("express");
const router = express.Router();
const knex = require("knex");
const knexConfig = require("../knexfile");

const db = knex(knexConfig.development);

router.use(express.json());

const charlimit = (req, res, next) => {
  const description = req.body.description;
  if (description.length <= 128) {
    next();
  } else {
    res
      .status(400)
      .json({ message: "Description must be 128 characters or less." });
  }
};

// GET all actions
router.get("/", async (req, res) => {
  try {
    const actions = await db("actions");
    res.status(200).json(actions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The actions information could not be retrieved."
    });
  }
});

// Create action request
router.post("/", async (req, res) => {
  try {
    if (req.body.description && req.body.notes && req.body.project_id) {
      const [id] = await db("actions").insert(req.body);

      const action = await db("actions")
        .where({ id })
        .first();
      res
        .status(201)
        .json({ ...action, completed: action.completed === 1 ? true : false });
    } else {
      res.status(400).json({
        errorMessage:
          "Please provide the description, notes, and project_id for an action."
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error while saving an action to the database"
    });
  }
});

// Update action request
router.put("/:id", async (req, res) => {
  try {
    const count = await db("actions")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const action = await db("actions")
        .where({ id: req.params.id })
        .first();
      res.status(200).json(action);
    } else {
      res.status(404).json({
        message: "The action with the specified ID does not exist."
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "The action information could not be modified." });
  }
});

//delete action request
router.delete("/:id", async (req, res) => {
  try {
    const count = await db("actions")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res
        .status(404)
        .json({ message: "The action with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ message: "The action could not be deleted" });
  }
});

module.exports = router;
