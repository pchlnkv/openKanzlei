const credentials = `${process.env.FLOWABLE_USERNAME}:${process.env.FLOWABLE_PASSWORD}`;
const FLOWABLE_AUTH_HEADER = `Basic ${Buffer.from(credentials).toString("base64")}`;

module.exports = {
    FLOWABLE_AUTH_HEADER
};

console.log("FLOWABLE_AUTH_HEADER erstellt");

