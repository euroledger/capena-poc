const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const api = require('../../api/index');

const prettyStringify = require('json-stringify-pretty-compact');
const request = require('request-promise');


router.post('/create_cred_def', auth.isLoggedIn, async function (req, res) {
    console.log("-------------------------------- Start Create Credential Definition ------------------------------------------")
    let credDefDetails =  req.body;
    let schema_id = credDefDetails.schema_id;
    let cred_def_tag = credDefDetails.cred_def_tag;
    let cred_def_support_revocation = credDefDetails.cred_def_support_revocation;
    console.log("create_cred_def credDefDetails",credDefDetails);
    let credeDef;
    await api.credentialDefinitions.sendCredentialDefinitionToLedger(cred_def_tag, cred_def_support_revocation, schema_id).then(function(resp) {
        credeDef=resp;
        console.log(" The resulting Credential Definitions ", credeDef);
    });
    console.log("------------------------------ End Create Credential Definition --------------------------------------------")
    res.redirect('/#issuing');
});

router.get(
    '/credential_definitions',
    async (req, res) => {
        console.log("credential_definitions");
        let schema_version,cred_def_id,schema_issuer_did,issuer_did,schema_id,schema_name;

        if (req.query.schema_version)  schema_version=req.query.schema_version;
        if (req.query.cred_def_id)  cred_def_id=req.query.cred_def_id;
        if (req.query.schema_issuer_did)  schema_issuer_did=req.query.schema_issuer_did;
        if (req.query.issuer_did)  issuer_did=req.query.issuer_did;
        if (req.query.schema_id)  schema_id=req.query.schema_id;
        if (req.query.schema_name)  schema_name=req.query.schema_name;

        try {
            await api.credentialDefinitions.getMySentCredentialDefinitionFromLedger(schema_version,cred_def_id, schema_issuer_did, issuer_did, schema_id, schema_name).then(function(resp) {
                console.log("api.credentialDefinitions.getMySentCredentialDefinitionFromLedger()", resp);
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
    '/credential_definition',
    async (req, res) => {
        const cred_id = req.query.cred_id;
        console.log("/credential_definition cred_id ....",cred_id);
        try {
            await api.credentialDefinitions.getCredentialDefinitionFromLedger(cred_id).then(function(resp) {
                console.log("api.credentialDefinitions.getCredentialDefinitionFromLedger(cred_id)", resp);
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
