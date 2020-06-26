const path = require('path');
const uuid = require('uuid');
const express = require('express');
const prettyStringify = require('json-stringify-pretty-compact');
const router = express.Router();
const config = require('../../config');
const messageParsers = require('../messageParsers');
const auth = require('../authentication');

const api = require('../../api/index');

/*const messageTypes = {
    connections: indy.connections.MESSAGE_TYPES,
    credentials: indy.credentials.MESSAGE_TYPES,
    proofs: indy.proofs.MESSAGE_TYPES
};*/

const THEME = process.env["THEME"] || "black"

/* GET home page. */
router.get('/', auth.isLoggedIn, async function (req, res) {
    ////////////////// *******  Get my end point DID *******  //////////////////
    let myPublicDidObject;
    let credentials = [];
    let relationships = [];
    let schemas = [];
    let credentialDefinitions = [];
    let proofRequests = {};
    let proofsToBeValidated = [];
    let messages = [];
    let proofExchangeRecords = [];
    let issuedCredentials = [];

    await fetchCurrentPublicDID().then(function (resp) {
        myPublicDidObject = resp;
        console.log(" Fetching Current Public DID", myPublicDidObject);
    });;

    //In case there is no end point DID, a new one is created, registered in the blockchain ledger, and assigned as the public DID
    if (!myPublicDidObject) {
        await createLocalDID().then(function (resp) {
            myPublicDidObject = resp;
            console.log(" Creating Local DID ", myPublicDidObject);
        });
        await registerDID(myPublicDidObject).then(function (resp) {
            console.log(" Registering DID ", resp);
        });
        await assignCurrentPublicDID(myPublicDidObject).then(function (resp) {
            console.log(" Assigning Current Public DID ", resp);
        });
    }

    ////////////////// *******  Get the list of Credentials *******  //////////////////
    await api.credentials.fetchAllCredentials().then(function (resp) {
        console.log(resp);
        let res = resp.results;
        console.log(res);
        if (res) {
            res.forEach(function (cred) {
                console.log(JSON.stringify(cred));
                credentials.push(cred);
            });
        }
    });
    console.log(" credentials: ", credentials);

    ////////////////// *******  Get the list of Relationships *******  //////////////////
    await api.connections.queryConnections().then(function (resp) {
        console.log(resp);
        let res = resp.results;
        if (res) {
            res.forEach(function (con) {
                console.log(con);
                if (con.state == 'active') {
                    relationships.push(con);
                }
            });
        }
    });
    console.log("relationships: ", relationships);

    ////////////////// *******  Get the list of schemas And Credential Definitions *******  //////////////////
    await api.schemas.getMySentSchemasFromLedger().then(function (resp) {
        console.log("api.schemas.getMySentSchemasFromLedger()",resp);
        let res = resp.schema_ids;
        if (res) {
            res.forEach(function (schema_id) {
                console.log("schema:",schema_id);
                let schema = { "id": schema_id};
                schemas.push(schema);
            });
        }
    });
    console.log("schemas: ", schemas);


    await api.credentialDefinitions.getMySentCredentialDefinitionFromLedger().then(function (resp) {
        console.log("api.credentialDefinitions.getMySentCredentialDefinitionFromLedger()",resp);
        let res = resp.credential_definition_ids;
        if (res) {
            res.forEach(function (cred_def_id) {
                console.log("cred_def_id:",cred_def_id);
                let cred_def = { "id": cred_def_id};
                credentialDefinitions.push(cred_def);
            });
        }
    });


    //Construction of Ebay Proof Request
    let req_attrs_ebay = [
        { "name": "name", "restrictions": [{ "schema_name": "faber_ebay_schema" }] },
        { "name": "registrationdate", "restrictions": [{ "schema_name": "faber_ebay_schema" }] },
        { "name": "negfeedbackcount", "restrictions": [{ "schema_name": "faber_ebay_schema" }] },
        { "name": "posfeedbackcount", "restrictions": [{ "schema_name": "faber_ebay_schema" }] },
        { "name": "posfeedbackpercent", "restrictions": [{ "schema_name": "faber_ebay_schema" }] }
    ];
    let req_preds_ebay = [
        {
            "name": "feedbackscore",
            "p_type": ">=",
            "p_value": 0,
            "restrictions": [{ "schema_name": "faber_ebay_schema" }],
        }
    ];
    let requested_attributes_ebay = {};
    req_attrs_ebay.forEach(function (att) {
        let key = "0_" + att.name + "_uuid";
        requested_attributes_ebay[key] = att;
    });

    let requested_predicates_ebay = {};
    req_preds_ebay.forEach(function (att) {
        let key = "0_" + att.name + "_GE_uuid";
        requested_predicates_ebay[key] = att;
    });
    let indy_proof_request_ebay = {
        "name": "Verification for Ebay Data request",
        "version": "1.0",
        "requested_attributes": requested_attributes_ebay,
        "requested_predicates": requested_predicates_ebay,
        "non_revoked": {"to": Math.round(+new Date()/1000)},
    }
    
    //Construction of Etsy Proof Request
    let req_attrs_etsy = [
        { "name": "etsy_name", "restrictions": [{ "schema_name": "faber_etsy_schema" }] },
        { "name": "etsy_feedbackcount", "restrictions": [{ "schema_name": "faber_etsy_schema" }] },
        { "name": "etsy_registrationdate", "restrictions": [{ "schema_name": "faber_etsy_schema" }] },
        { "name": "etsy_posfeedbackpercent", "restrictions": [{ "schema_name": "faber_etsy_schema" }] }
    ];
    let requested_attributes_etsy = {};
    let requested_predicates_etsy = {};
    req_attrs_etsy.forEach(function (att) {
        let key = "0_" + att.name + "_uuid";
        requested_attributes_etsy[key] = att;
    });

    let indy_proof_request_etsy = {
        "name": "Verification for Etsy Data request",
        "version": "1.0",
        "requested_attributes": requested_attributes_etsy,
        "requested_predicates": requested_predicates_etsy,
        "non_revoked": {"to": Math.round(+new Date()/1000)},
    }

    proofRequests["EBAY-DATA"] = JSON.stringify(indy_proof_request_ebay);
    proofRequests["ETSY-DATA"] = JSON.stringify(indy_proof_request_etsy);
    console.log(" proof Requests: ", proofRequests);



    /************** Get all the proof exchange ************/
    await api.presentProof.fetchAllPresentProofExchangeRecords().then(function (resp) {
        console.log(" Results for api.presentProof.fetchAllPresentProofExchangeRecords(): ", resp);
        let res = resp.results;
        if (res) {
            res.forEach(function (prfexc) {
                console.log(JSON.stringify(prfexc));
                proofExchangeRecords.push(prfexc);
            });
        }
    });
    console.log("PROOF EXCHANGE Records: ", proofExchangeRecords);
    //Get List of exchanged proofs
    for (let proofExchangeRecord of proofExchangeRecords) {
        if (proofExchangeRecord['state'] == 'presentation_received' || proofExchangeRecord['state'] == 'verified') {
            console.log(" Hello World! ", prettyStringify(proofExchangeRecord.presentation.requested_proof.revealed_attrs));
            proofsToBeValidated.push(proofExchangeRecord);
        }
    }

    console.log(" proofsToBeValidated: ", prettyStringify(proofsToBeValidated));

    //A message can either be a direct message, connection request, credential request, or proof request
    // We will here focus on the Poff request
    for (let proofExchangeRecord of proofExchangeRecords) {
        if (proofExchangeRecord['state'] == 'request_received') {
            let msg = {
                "id": proofExchangeRecord['presentation_exchange_id'],
                "relationshipName": proofExchangeRecord['connection_id'],
                "type": "PROOF_REQUEST",
                "timestamp": proofExchangeRecord['created_at'],
                "content": proofExchangeRecord
            };
            messages.push(msg);
        }
    }

    /***************************Get ALL Issued Credentials */
    await api.issueCredential.fetchAllCredentialExchangeRecords().then(function (resp) {
        console.log(" Results for api.issueCredential.fetchAllCredentialExchangeRecords(): ", resp);
        let res = resp.results;
        if (res) {
            res.forEach(function (ic) {
                console.log(JSON.stringify(ic));
                issuedCredentials.push(ic);
            });
        }
    });
    
    console.log(" List of messages: ", messages);

    res.render('index', {
        messages: messages,
        messageTypes: [], //messageTypes,
        relationships: relationships,
        credentials: credentials,
        issuedCredentials: issuedCredentials,
        schemas: schemas,
        credentialDefinitions: credentialDefinitions,
        endpointDid: myPublicDidObject.did,
        proofRequests: proofRequests,
        name: config.userInformation.name,
        srcId: config.userInformation.icon_src,
        proofsToBeValidated: proofsToBeValidated,
        theme: THEME,
        icon_front: config.userInformation.icon_front,
        text_color: config.userInformation.text_color,
    });

    for (let prKey of Object.keys(proofRequests)) {
        delete proofRequests[prKey].string;
    }
    
});

router.post('/login', async function (req, res) {
    if (req.body.username === config.userInformation.username &&
        req.body.password === config.userInformation.password) {
        let token = uuid();
        req.session.token = token;
        req.session.save((err) => {
            auth.validTokens.push(token);
            res.redirect('/');
        });
    }
    else {
        res.redirect('/login?msg=Authentication Failed. Please try again.');
    }
});

router.get('/logout', async function (req, res, next) {
    for (let i = 0; i < auth.validTokens.length; i++) {
        if (auth.validTokens[i] === req.session.token) {
            auth.validTokens.splice(i, 1);
        }
    }
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
        }
        else {
            auth.session = null;
            res.redirect('/login');
        }
    });
});


async function fetchCurrentPublicDID() {
    return api.wallet.fetchCurrentPublicDID().then(function (resp) {
        console.log(" fetchCurrentPublicDID : ", resp);
        return resp.result;
    });
}


async function createLocalDID() {
    return api.wallet.createLocalDID().then(function (resp) {
        console.log(" createLocalDID : ", resp);
        return resp.result;
    });
}

async function registerDID(didObject) {
    return api.ledger.registerDID(didObject.did, didObject.verkey).then(function (resp) {
        console.log(" registerDID : ", resp);
        //if (resp.status != 200){
        //return false;
        //}
        return true;
    });
}


async function assignCurrentPublicDID(didObject) {
    return api.wallet.assignCurrentPublicDID(didObject.did).then(function (resp) {
        console.log(" assignCurrentPublicDID : ", resp);
        //return resp;
    });
}

function isAlice() {
    let currentEndPoint = config.endpointDidEndpoint;
    let s = currentEndPoint.split(":");
    let port = parseInt(s[s.length - 1], 10);
    if (port === 8031) {
        return true;
    } else {
        return false;
    }
}

function isFaber() {
    let currentEndPoint = config.endpointDidEndpoint;
    let s = currentEndPoint.split(":");
    let port = parseInt(s[s.length - 1], 10);
    if (port === 8021) return true;
    else return false;
}

module.exports = router;
