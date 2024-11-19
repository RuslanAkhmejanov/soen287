import express from "express";
import mysql from "mysql";

const app = express();
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "soen287"
})

db.connect((err) => {
    if (err) {
      console.log("Error connecting to DB.");
    } else {
      console.log("Connected.");
    }
  });

app.get("/", (req, res) => {
    res.send("Hey");
});

app.listen(5000, () => {

});