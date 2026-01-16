const express = require("express");

const { FLOWABLE_AUTH_HEADER } = require("../etc/flowableAuth");
const FLOWABLE_REST = process.env.FLOWABLE_REST;

const router = express.Router();

router.get("/", (req, res) => {
    res.send("OK");
});

router.get("/active-cases", async(req, res) => {
try {
    const url = `${FLOWABLE_REST}/cmmn-api/cmmn-runtime/case-instances`;
    const r = await fetch(url, {
        headers: {
            Authorization: FLOWABLE_AUTH_HEADER,
            Accept: "application/json"
        },
    });

    const text = await r.text();
    res.status(r.status).type(r.headers.get("content-type") || "application/json").send(text);
} catch(e) {
    res.status(500).json({error: String(e)});
}

});

module.exports = router;