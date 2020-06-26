const express = require('express');
const router = express.Router();
//const indy = require('../../indy/index');
const auth = require('../authentication');
const api = require('../../api/index');

const prettyStringify = require('json-stringify-pretty-compact');
const request = require('request-promise');

router.get('/', function (req, res, next) {
    res.send("Success");
});

router.post('/send_message', auth.isLoggedIn, async function (req, res) {
    let message = JSON.parse(req.body.message);
    message.did = req.body.did;

    //await indy.crypto.sendAnonCryptedMessage(req.body.did, message);
    console.log("send message");
    res.redirect('/#messages');
});

router.post('/send_connection_request', auth.isLoggedIn, async function (req, res) {

    let theirEndpointDid = req.body.did;
    let connectionRequest = [];//await indy.connections.prepareRequest(theirEndpointDid);

    //Create an invitation request
    let invitationDetails;
    await api.connections.createConnectionInvitation().then(function(resp) {
        invitationDetails=resp.invitation;
        console.log(" Invitation Details ", invitationDetails)
    });


    //Get the endpoint to which the invitation should be sent
    let theirEndpointUrl;
    await api.ledger.getEndPointForDID(theirEndpointDid).then(function(resp) {
        theirEndpointUrl=resp.endpoint;
        console.log(" Their Endpoint Url ", theirEndpointUrl);
    });

    //Send the invitation to the other party of the connection
    let s = theirEndpointUrl.split(":");
    let port = parseInt(s[s.length-1], 10) + 1;
    let urlReceiveInvitation = s[0]+":"+s[1]+":"+port.toString()+"/connections/receive-invitation";
    const options = {
        method: 'POST'
        ,uri: urlReceiveInvitation
        ,json: true
        ,body: JSON.stringify(invitationDetails)
        ,headers: {'content-type' : 'application/json'}
    };

    await request(options).then(function (resp) {
        console.log( " Executing Receive invitation of the other partys", resp)
    }).catch(function (err) {
        console.log( "ERROR in exports.receiveConnectionInvitation  = ", err )
    });

    //await indy.crypto.sendAnonCryptedMessage(theirEndpointDid, connectionRequest);
    console.log("sendAnonCryptedMessage");
    res.redirect('/#relationships');
});

router.post('/issuer/create_schema', auth.isLoggedIn, async function (req, res) {
    //await indy.issuer.createSchema(req.body.name_of_schema, req.body.version, req.body.attributes);
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

router.post('/issuer/create_cred_def', auth.isLoggedIn, async function (req, res) {
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

router.post('/issuer/send_credential_offer', auth.isLoggedIn, async function (req, res) {
    let theirRelationshipDid = req.body.their_relationship_did;
    let credDefId = req.body.cred_def_id;
    console.log ("theirRelationshipDid: ", theirRelationshipDid);

    //Get Connection ID from DID
    let connId;
    await api.connections.queryConnections({their_did: theirRelationshipDid}).then(function(resp) {
        connId=resp.results[0].connection_id;
        console.log(" The resulting api.connections.queryConnections ", connId);
    });
    console.log("credDefId: ",credDefId);

    let credPreview =
        {
            "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
            "attributes": [
                {
                    "name": "brand",
                    "value": "Peugeot 2008"
                },
                {
                    "name": "constructiondate",
                    "value": "2015-11-07"
                },
                {
                    "name": "horsepower",
                    "value": "80"
                },
                {
                    "name": "mileage",
                    "value": "150000"
                },
                {
                    "name": "electric",
                    "value": "Oui"
                }
            ]
        };

    let offer_request =
        {
            "connection_id": connId,
            "credential_definition_id": credDefId,
            "comment": "Offer on cred def id "+credDefId,
            "credential_proposal": credPreview
        }

    console.log("offer_request",JSON.stringify(offer_request));
    let credOfferResp;
    //sendCredentialAutomatingEntireFlow
    //sendHolderCredentialOfferFreeFromReferenceToAnyProposal
    await api.issueCredential.sendCredentialAutomatingEntireFlow(offer_request).then(function(resp) {
        credOfferResp=resp;
        console.log(" The resulting api.issueCredential.sendCredentialAutomatingEntireFlow ", credOfferResp);
    });

    console.log("sendOffer");
    res.redirect('/#issuing');
});

router.post('/credentials/accept_offer', auth.isLoggedIn, async function(req, res) {
    console.log("accept_offer");
    res.redirect('/#messages');
});

router.post('/credentials/reject_offer', auth.isLoggedIn, async function(req, res) {
    console.log("deletemessage");
    res.redirect('/');
});

router.put('/connections/request', auth.isLoggedIn, async function (req, res) {
    let name = req.body.name;
    let messageId = req.body.messageId;
    console.log("connection request");
    res.redirect('/#relationships');
});

router.delete('/connections/request', auth.isLoggedIn, async function (req, res) {
    if (req.body.messageId) {
        console.log("delet emessage");
    }
    res.redirect('/#relationships');
});

router.post('/messages/delete', auth.isLoggedIn, function(req, res) {
    console.log("deletemessage");
    res.redirect('/#messages');
});

router.post('/proofs/accept', auth.isLoggedIn, async function(req, res) {
    //await indy.proofs.acceptRequest(req.body.messageId);
    console.log("/proofs/accept--------------------------------------------------",req.body);
    let proofRequestDetails = req.body;
    let presentationExchangeID = proofRequestDetails.presentation_exchange_id;
    let presentationRequest = proofRequestDetails.presentation_request;
    console.log(" /proofs/accept presentationExchangeID ", presentationExchangeID);
    console.log(" /proofs/accept presentationRequest ",  presentationRequest);

    // If we must reply to the proof request
    //Actually the proof we send is not valid
    //We get back our credential associated with the request
    let existingCreds = [];
    await api.presentProof.fetchCredentialsForPresentationRequestFromWallet(presentationExchangeID).then(function(resp) {
        console.log(" api.presentProof.fetchCredentialsForPresentationRequestFromWallet(presentationExchangeID): ", resp);
        let res = resp;
        if (res) {
            res.forEach(function(exCred) {
                console.log(JSON.stringify(exCred));
                existingCreds.push(exCred);
            });
        }
    });
    console.log("Existing Credentials: ", existingCreds);

    let credentialByReferent = {};
    let revealed = {};
    let selfAttested = {};
    let predicates = {};

    //We fullfill the response with our attributes and predicates
    for (var cred in existingCreds) {
        for (var referent in existingCreds[cred]['presentation_referents']) {
            let ref = existingCreds[cred]['presentation_referents'][referent];
            credentialByReferent[ref] = existingCreds[cred];
        }
    }
    for (var referent in presentationRequest['requested_attributes']) {
        if (credentialByReferent.hasOwnProperty(referent)) {
            revealed[referent] = {
                'cred_id': credentialByReferent[referent]['cred_info']['referent'],
                'revealed': true
            };
        }
        else {
            selfAttested.referent = "my self attested value"; // I think this is a case where we dont fall in the demo...
        }
    }

    for (var referent in presentationRequest['requested_predicates']) {
        if (credentialByReferent.hasOwnProperty(referent)) {
            predicates[referent] = {
                'cred_id': credentialByReferent[referent]['cred_info']['referent']
            };
        }
    }

    console.log("Generate the proof");
    let request = {
        'requested_predicates': predicates,
        'requested_attributes': revealed,
        'self_attested_attributes': selfAttested,
    };

    console.log("The content of the generated prrof request: ", request);
    console.log("Send the proof to X");
    await api.presentProof.sendProofPresentation(presentationExchangeID, request).then(function(resp) {
        console.log(" api.presentProof.sendProofPresentation(presentationExchangeID , request): ", resp);
    });
});

router.post('/proofs/send_request', auth.isLoggedIn, async function(req, res) {
    let proofRequestId = req.body.proof_request_id;
    let proofRequest = req.body[proofRequestId];
    let theirRelationshipDid = req.body.their_relationship_did;

    console.log("/proofs/send_request req.body: ",req.body);
    console.log("/proofs/send_request proofRequestId: ",proofRequestId);
    console.log("/proofs/send_request proofRequest: ",proofRequest);
    console.log("/proofs/send_request theirRelationshipDid: ",theirRelationshipDid);

    let connId;
    await api.connections.queryConnections({their_did: theirRelationshipDid}).then(function(resp) {
        connId=resp.results[0].connection_id;
        console.log(" The resulting api.connections.queryConnections ", connId);
    });

    let options =
        '{"connection_id":"'+connId+'",'
        +'"trace":'+false+','
        +'"proof_request":'+proofRequest +'}';
    ;
    console.log("/proofs/send_request options ",options);

    await api.presentProof.sendFreePresentationRequestNotBoundToAnyProposal(options).then(function(resp) {
       console.log("api.presentProof.urlSendFreePresentationRequestNotBoundToAnyProposal", resp);
    });

    res.redirect('/#proofs');
});

router.post('/proofs/validate', auth.isLoggedIn, async function(req, res) {
    console.log("=======================================================================================");
    console.log("=======================================================================================", req.body);
    try {
         let proofExchangeId = req.body.presentation_exchange_id;
         console.log("****************************************** /proofs/validate", proofExchangeId);
         await api.presentProof.verifyReceivedPresentation(proofExchangeId).then(function(resp) {
            console.log("api.presentProof.verifyReceivedPresentation(proofExchangeId)", resp);
            if (resp.verified) {
                res.status(200).send();
            } else {
                res.status(400).send();
            }
        });
    } catch(err) {
        res.status(500).send();
    }
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
