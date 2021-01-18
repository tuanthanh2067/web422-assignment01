/*********************************************************************************
 * WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Tuan Thanh Tan Student ID: 102183191 Date: January 17, 2021
 * Heroku Link: https://afternoon-peak-82019.herokuapp.com/
 *
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB(process.env.MONGODB_CONN_STRING);

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

db.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.status(201).json({ message: "API Listening" });
});

app.post("/api/restaurants", (req, res) => {
  db.addNewRestaurant(req.body)
    .then((result) => {
      res.status(201).json({ message: result });
    })
    .catch((error) => {
      res.status(404).json({ message: "Can not add restaurant" });
    });
});

app.get("/api/restaurants", (req, res) => {
  // query
  const page = req.query.page;
  const perPage = req.query.perPage;
  const borough = req.query.borough;
  db.getAllRestaurants(page, perPage, borough)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(404).json({ message: "Resource not found" });
    });
});

app.get("/api/restaurants/:id", (req, res) => {
  const id = req.params.id;
  db.getRestaurantById(id)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(404).json({ message: `Error getting restaurant id ${id}` });
    });
});

app.put("/api/restaurants/:id", (req, res) => {
  const id = req.params.id;
  if (id != req.body.id) {
    res.status(404).json({ message: "Resource not found" });
  } else {
    const data = req.body;
    db.updateRestaurantById(data, id)
      .then((result) => {
        res.status(201).json({ message: result });
      })
      .catch((error) => {
        res.status(404).json({ message: `Error with updating ${id}` });
      });
  }
});

app.delete("/api/restaurants/:id", (req, res) => {
  const id = req.params.id;
  db.getRestaurantById(id)
    .then((result) => {
      if (result === null) {
        res.status(404).json({ message: `${id} can not be found` });
      } else {
        db.deleteRestaurantById(id)
          .then((result) => {
            res.status(201).json({ message: result });
          })
          .catch((error) => {
            res.status(404).json({ message: `Error deleting ${id}` });
          });
      }
    })
    .catch((error) => {
      res.status(404).json({ message: `Error getting restaurant ${id}` });
    });
});
