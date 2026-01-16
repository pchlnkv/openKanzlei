const express = require("express");

const { FLOWABLE_AUTH_HEADER } = require("../etc/flowableAuth");
const FLOWABLE_REST = process.env.FLOWABLE_REST;

const router = express.Router();

router.all("/{*rest}", async(req, res) => {
try {
    const url = FLOWABLE_REST + req.url;

    const options = {
        method: req.method,
        headers: {
            Authorization: FLOWABLE_AUTH_HEADER,
            Accept: req.headers.accept || "application/json",
            "Content-Type": req.headers["content-type"] || undefined
        },
    };
    if(!["GET", "HEAD"].includes(req.method)) {
        options.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }
    const r = await fetch(url, options);
    const text = await r.text();
    res
        .status(r.status)
        .type(r.headers.get("content-type") || "application/json")
        .send(text);

} catch(e) {
    res.status(500).json({error: String(e)});
}
});

module.exports = router;
