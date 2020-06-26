const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const api = require('../../api/index');

const prettyStringify = require('json-stringify-pretty-compact');
const request = require('request-promise');

router.post('/send_connection_request', auth.isLoggedIn, async function (req, res) {

    let theirEndpointDid = req.body.did;
    
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

    console.log("sendAnonCryptedMessage");
    res.redirect('/#relationships');
});

router.post('/receive-invitation', auth.isLoggedIn, async function(req, res) {
    console.log("=======================================================================================");
    console.log("=======================================================================================", req.body);
    try {
         let invitationDetails = req.body;
         console.log("/receive-invitation", invitationDetails);
         await api.connections.receiveConnectionInvitation(invitationDetails).then(function(resp) {
            console.log("api.connections.receiveConnectionInvitation(invitationDetails)", resp);
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
    '/connections',
    async (req, res) => {
        console.log("/connections");
        let connection_id,their_role,initiator,alias,their_did,invitation_key,state,my_did;

        if (req.query.connection_id){
            connection_id=req.query.connection_id;
            try {
                await api.connections.fetchSingleConnection(connection_id).then(function(resp) {
                    console.log("api.connections.fetchSingleConnection()", resp);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(resp));
                });
            } catch (error) {
                console.log(error);
                console.log(`Error to get connection :${JSON.stringify(error)}`);
            }
        } else{
            if (req.query.their_role)  their_role=req.query.their_role;
            if (req.query.initiator)  initiator=req.query.initiator;
            if (req.query.alias)  alias=req.query.alias;
            if (req.query.their_did)  their_did=req.query.their_did;
            if (req.query.invitation_key)  invitation_key=req.query.invitation_key;
            if (req.query.state)  state=req.query.state;
            if (req.query.my_did)  my_did=req.query.my_did;
    
            try {
                await api.connections.queryConnections(their_role,initiator,alias,their_did,invitation_key,state,my_did).then(function(resp) {
                    console.log("api.connections.queryConnections()", resp);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(resp));
                });
            } catch (error) {
                console.log(error);
                console.log(`Error to get connection :${JSON.stringify(error)}`);
            }
        }
    }
);

module.exports = router;
