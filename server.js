const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const Logs = require("./log.model");
const authentication = require("./authenticate");

const app = express();

app.get("/create-token", async (req, res) => {
  const token = jwt.sign({ name: "new user" }, "top-secret");
  res.status(200).json({ token });
});

app.get("/nodetest/combined", authentication, async (req, res) => {
  try {
    const user1 = axios.get("https://dummyjson.com/users", { timeout: 5000 });
    const user2 = axios.get("https://reqres.in/api/users?delay=6", {
      timeout: 5000,
    });

    const [data1, data2] = await Promise.allSettled([user1, user2]);
    const combinedData = [];
    let requestData = [];
    if (data1.status == "fulfilled") {
      requestData = [...requestData, ...data1.value.data.users];
      data1.value.data.users.forEach((user) => {
        combinedData.push({
          firstname: user.firstName,
          lastname: user.lastName,
          email: user.email,
        });
      });
    }
    if (data2.status == "fulfilled") {
      requestData = [...requestData, ...data2.value.data.data];
      data2.value.data.data.forEach((user) => {
        combinedData.push({
          firstname: user.first_name,
          lastname: user.last_name,
          email: user.email,
        });
      });
    }

    await Logs.create({ response: combinedData, request: requestData });
    res.status(200).json(combinedData);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(4000, () => {
  mongoose.connect("mongodb://127.0.0.1:27017/api-log");
  console.log("server running on port 4000");
});
