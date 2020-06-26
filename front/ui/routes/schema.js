const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const api = require('../../api/index');

const prettyStringify = require('json-stringify-pretty-compact');
const request = require('request-promise');


router.post('/create_schema', auth.isLoggedIn, async function (req, res) {
    console.log("----------------------------------Start  Create Schema ----------------------------------------")
    let schemaDetails =  req.body;
    let schema_name = schemaDetails.schema_name;
    let schema_version = schemaDetails.schema_version;
    let schema_attributes = JSON.parse(schemaDetails.schema_attributes);
    let schemeRes;
    console.log("schemaDetails",JSON.stringify(schemaDetails));
    await api.schemas.sendSchemaToLedger(schema_name,schema_version,schema_attributes).then(function(resp) {
        schemeRes=resp;
        console.log(" The resulting Scheme Details ", schemeRes);
    });
    console.log("-------------------------------- End  Create Schema ------------------------------------------")
    res.redirect('/#issuing');
});


router.get(
    '/schema_definitions',
    async (req, res) => {
        console.log("credential_definitions");
        let schema_id,schema_version,schema_issuer_did,schema_name;

        if (req.query.schema_id)  schema_id=req.query.schema_id;
        if (req.query.schema_version)  schema_version=req.query.schema_version;
        if (req.query.schema_issuer_did)  schema_issuer_did=req.query.schema_issuer_did;
        if (req.query.schema_name)  schema_name=req.query.schema_name;

        try {
            await api.schemas.getMySentSchemasFromLedger(schema_id,schema_version,schema_issuer_did,schema_name).then(function(resp) {
                console.log("api.schemas.getMySentSchemasFromLedger()", resp);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(resp));
            });
        } catch (error) {
            console.log(error);
            console.log(`Error to get Access token :${JSON.stringify(error)}`);
        }
    }
);

router.get(
    '/schema_definition',
    async (req, res) => {
        const schema_id = req.query.schema_id;
        console.log("/schema_definition schema_id ....",schema_id);
        try {
            await api.schemas.getSchemaFromLedger(schema_id).then(function(resp) {
                console.log("api.credentialDefinitions.getCredentialDefinitionFromLedger(schema_id)", resp);
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
