const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const api = require('../../api/index');

const prettyStringify = require('json-stringify-pretty-compact');
const request = require('request-promise');


router.get(
    '/public_did',
    async (req, res) => {
        console.log("In public_did");

        try {
            await api.wallet.fetchCurrentPublicDID().then(function (resp) {
                console.log("api.wallet.fetchCurrentPublicDID()", resp);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(resp));
            });
        } catch (error) {
            console.log(error);
            console.log(`Error to get Access token :${JSON.stringify(error)}`);
        }
    }
);

module.exports = router;
