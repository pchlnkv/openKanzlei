require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});

const shutdown = () => {
    console.log("Server wird heruntergefahren...");
    server.close(() => {
        process.exit(0);
    });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);