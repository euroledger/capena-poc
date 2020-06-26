const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const api = require('../../api/index');

const prettyStringify = require('json-stringify-pretty-compact');
const request = require('request-promise');


router.post('/send_credential_offer', auth.isLoggedIn, async function (req, res) {
    let connectionId = req.body.connection_id;
    let credDefId = req.body.cred_def_id;

    console.log("connectionId: ", connectionId);
    console.log("credDefId: ", credDefId);

    let credPreview ={
        "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
        "attributes": [
            {"name": "name", "value": "TEST"},
            {"name": "feedbackscore","value": "10"},
            {"name": "registrationdate","value": "2020-20-20"},
            {"name": "negfeedbackcount","value": "5"},
            {"name": "posfeedbackcount","value": "15"},
            {"name": "posfeedbackpercent","value": "20"}
        ]
    };

    let offer_request ={
        "connection_id": connectionId,
        "cred_def_id": credDefId,
        "comment": "Offer on cred def id " + credDefId,
        "credential_proposal": credPreview,
        "auto_remove": false,
        "trace": true
    }

    console.log("offer_request", JSON.stringify(offer_request));
    let credOfferResp;
    //sendCredentialAutomatingEntireFlow
    //sendHolderCredentialOfferFreeFromReferenceToAnyProposal
    await api.issueCredential.sendCredentialAutomatingEntireFlow(offer_request).then(function (resp) {
        credOfferResp = resp;
        console.log(" The resulting api.issueCredential.sendCredentialAutomatingEntireFlow ", credOfferResp);
    });

    console.log("sendOffer");
    res.redirect('/#issuing');
});


router.post('/send_ebay_credential_offer', auth.isLoggedIn, async function (req, res) {
    console.log("IN /send_ebay_credential_offer");
    console.log("issue params = ", req.body);
    let connectionId = req.body.connectionId;
    let credDefId = req.body.definitionId;
    let credentialValues = req.body.credentialValues;
    try {
        
        let credPreview ={
            "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
            "attributes": [
                {"name": "name", "value": credentialValues.name},
                {"name": "feedbackscore","value": credentialValues.feedbackscore},
                {"name": "registrationdate","value": credentialValues.registrationdate},
                {"name": "negfeedbackcount","value": credentialValues.negfeedbackcount},
                {"name": "posfeedbackcount","value": credentialValues.posfeedbackcount},
                {"name": "posfeedbackpercent","value": credentialValues.posfeedbackpercent}
            ]
        };

        let offer_request ={
            "connection_id": connectionId,
            "cred_def_id": credDefId,
            "comment": "Offer on cred def id " + credDefId,
            "credential_proposal": credPreview,
            "auto_remove": false,
            "trace": false
        }

        console.log("offer_request", JSON.stringify(offer_request));
        await api.issueCredential.sendCredentialAutomatingEntireFlow(offer_request).then(function (resp) {
            console.log(" The resulting api.issueCredential.sendCredentialAutomatingEntireFlow ", resp);
            res.status(200).send(JSON.stringify(resp));
            
        });
    } catch (error) {
        console.log(error);
        console.log(`Error to send_ebay_credential_offer :${JSON.stringify(error)}`);
    }


});

router.post('/send_etsy_credential_offer', auth.isLoggedIn, async function (req, res) {
    console.log("IN /send_etsy_credential_offer");
    console.log("issue params = ", req.body);
    let connectionId = req.body.connectionId;
    let credDefId = req.body.definitionId;
    let credentialValues = req.body.credentialValues;
    try {
        
        let credPreview ={
            "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
            "attributes": [
                {"name": "etsy_name", "value": credentialValues.etsy_name},
                {"name": "etsy_feedbackcount","value": credentialValues.etsy_feedbackcount},
                {"name": "etsy_registrationdate","value": credentialValues.etsy_registrationdate},
                {"name": "etsy_posfeedbackpercent","value": credentialValues.etsy_posfeedbackpercent}
            ]
        };

        let offer_request ={
            "connection_id": connectionId,
            "cred_def_id": credDefId,
            "comment": "Offer on cred def id " + credDefId,
            "credential_proposal": credPreview,
            "auto_remove": false,
            "trace": false
        }

        console.log("offer_request", JSON.stringify(offer_request));
        await api.issueCredential.sendCredentialAutomatingEntireFlow(offer_request).then(function (resp) {
            console.log(" The resulting api.issueCredential.sendCredentialAutomatingEntireFlow ", resp);
            res.status(200).send(JSON.stringify(resp));
            
        });
    } catch (error) {
        console.log(error);
        console.log(`Error to send_ebay_credential_offer :${JSON.stringify(error)}`);
    }
});

router.post('/revoke_credential', auth.isLoggedIn, async function (req, res) {
    
    console.log("IN /revoke_credential");

    console.log("req.body:", req.body);
    let rev_reg_id = req.body.revoc_reg_id;
    let cred_rev_id  = req.body.revocation_id ;
    let publish = true;
    try {
        await api.issueCredential.revokeCredential(rev_reg_id, cred_rev_id, publish).then(function (resp) {
            console.log(" The resulting api.issueCredential.revokeCredential ", resp);
            res.status(200).send(JSON.stringify(resp));
        });
    } catch (error) {
        console.log(error);
        console.log(`Error to revoke_credential :${JSON.stringify(error)}`);
    }
});



module.exports = router;
