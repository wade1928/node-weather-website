/* eslint-disable no-console */
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup Handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather App",
        name: "Ryan Wade"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Ryan Wade"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        name: "Ryan Wade",
        message: "Contact someone else for help."
    });
});

app.get("/weather", (req, res) => {
    const address = req.query.address;

    if (!address) {
        return res.send({ error: "Please provide a valid address!" });
    }
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                location,
                address: address,
                forecast: forecastData
            });
        });
    });
});

app.get("/products", (req, res) => {
    if (!req.query.search) {
        return res.send({ error: "You must provide a search term." });
    }

    console.log(req.query);
    res.send({ products: [] });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Ryan Wade",
        errorMessage: "Help Page Not Found."
    });
});

app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Ryan Wade",
        errorMessage: "Page Not Found."
    });
});

app.listen(3000, () => {
    console.log("Server has started!");
});
