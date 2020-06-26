const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const api = require('../../api/index');

const prettyStringify = require('json-stringify-pretty-compact');
const request = require('request-promise');


router.post('/accept', auth.isLoggedIn, async function(req, res) {
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

router.post('/send_request', auth.isLoggedIn, async function(req, res) {
    let proofRequestId = req.body.proof_request_id;
    let proofRequest = req.body[proofRequestId];
    let connectionId = req.body.connection_id;

    console.log("/proofs/send_request req.body: ",req.body);
    console.log("/proofs/send_request proofRequestId: ",proofRequestId);
    console.log("/proofs/send_request proofRequest: ",proofRequest);
    console.log("/proofs/send_request connectionId: ",connectionId);

    let options =
        '{"connection_id":"'+connectionId+'",'
        +'"trace":'+false+','
        +'"proof_request":'+proofRequest +'}';
    ;
    console.log("/proofs/send_request options ",options);

    await api.presentProof.sendFreePresentationRequestNotBoundToAnyProposal(options).then(function(resp) {
       console.log("api.presentProof.urlSendFreePresentationRequestNotBoundToAnyProposal", resp);
    });

    res.redirect('/#proofs');
});

router.post('/validate', auth.isLoggedIn, async function(req, res) {
    console.log("=======================================================================================");
    console.log("=======================================================================================", req.body);
    try {
         let proofExchangeId = req.body.presentation_exchange_id;
         console.log("****************************************** /proofs/validate", proofExchangeId);
         await api.presentProof.verifyReceivedPresentation(proofExchangeId).then(function(resp) {
            console.log("api.presentProof.verifyReceivedPresentation(proofExchangeId)", resp);
            console.log("resp.verified", resp.verified);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp));
        });
    } catch(err) {
        res.status(500).send();
    }
});

module.exports = router;
