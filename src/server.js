import express from "express";

const app = express();

// setting pug
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// seting static
app.use("/public", express.static(__dirname + "/public"));

// setting route
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);