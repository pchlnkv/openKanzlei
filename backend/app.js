const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

//Routes
const casesRoute = require("./routes/cases");
const passRoute = require("./routes/pass");


const errorHandler = require("./etc/errorHandler")

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true })); 
app.use(express.json()); 

app.use(
    rateLimit({
        windowMs: 10000,  //Zeitraum in ms
        max: 100  //Maximale Anfragen im Zeitraum
    })
);

app.get("/", (req, res) => {
    res.sendStatus(200);
});


//Routes

app.use("/cases", casesRoute);
app.use("/api", passRoute);


app.use(errorHandler);

module.exports = app;


