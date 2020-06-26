const http = require('http');
const parser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { createTerminus } = require('@godaddy/terminus');
const express = require('express');
const ngrok = require('ngrok');
const cache = require('./model');
const utils = require('./utils');
const request = require('request-promise');

var fs = require('fs');
var https = require('https');

require('dotenv').config();
const { AgencyServiceClient, Credentials } = require("@streetcred.id/service-clients");

console.log("ACCESSTOK = ", process.env.ACCESSTOK);
const client = new AgencyServiceClient(new Credentials(process.env.ACCESSTOK, process.env.SUBKEY));

var certOptions = {
    key: fs.readFileSync(path.resolve('./cert/server.key')),
    cert: fs.readFileSync(path.resolve('./cert/server.crt'))
}

const FABER_END_POINT = process.env.FABER_URL;
const URL_QUERY_CONNECTIONS = new URL(FABER_END_POINT + "/api/connection/connections");
const URL_QUERY_CRED_DEF = new URL(FABER_END_POINT + "/api/credential-definition/credential_definitions");
const URL_SEND_EBAY_CRED_OFFER = new URL(FABER_END_POINT + "/api/issue-credential/send_ebay_credential_offer");
const URL_SEND_ETSY_CRED_OFFER = new URL(FABER_END_POINT + "/api/issue-credential/send_etsy_credential_offer");
const URL_GET_PUBLIC_DID = new URL(FABER_END_POINT + "/api/wallet/public_did");
const EBAY_SCHEMA_NAME = process.env.EBAY_SCHEMA_NAME;
const ETSY_SCHEMA_NAME = process.env.ETSY_SCHEMA_NAME;





var app = express();
app.use(cors());
app.use(parser.json());
app.use(express.static(path.join(__dirname, 'build')))

// add in routes from the two platforms eBay and Etsy
require('./routes/ebay')(app)
require('./routes/etsy')(app);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});



let credentialId;
let connectionId;
let connected = true;
let registered = false;
let credentialAccepted = false;
let verificationAccepted = false;

// WEBHOOK ENDPOINT
app.post('/webhook', async function (req, res) {
    try {

        console.log("got webhook" + req + "   type: " + req.body.message_type);
        if (req.body.message_type === 'new_connection') {
            registered = true;
            connectionId = req.body.object_id;

            // if we want the name of the connection for registration id front end...do here
            // console.log("---------------> new connection: ", req.body);
            // try {
            //     connectionContract = await getConnectionWithTimeout(connectionId);
            // } catch (e) {
            //     console.log(e.message || e.toString());
            //     return
            // }
            console.log("new connection notif, connectionId = ", connectionId);

            const attribs = cache.get(req.body.object_id);
            console.log("attribs from cache = ", attribs);
            var param_obj = JSON.parse(attribs);
            var params =
            {
                credentialOfferParameters: {
                    definitionId: process.env.CRED_DEF_ID_USER_DETAILS,
                    connectionId: req.body.object_id,
                    credentialValues: {
                        'First Name': param_obj["firstname"],
                        'Last Name': param_obj["lastname"],
                        'Email Address': param_obj["email"],
                        'Country': param_obj["country"],
                        'Passcode': param_obj["passcode"]
                    }
                }
            }
            console.log(">>>>>>>>>>>>> Creating credential with params ", params);
            await client.createCredential(params);
            console.log("CREDENTIAL CREATED user details!");
        }
        else if (req.body.message_type === 'credential_request') {
            console.log("cred request notif");
            // if (connected) {
            credentialId = req.body.object_id;
            console.log("Issuing credential to ledger, id = ", credentialId);
            await client.issueCredential(credentialId);
            console.log("Credential Issue -> DONE");
            credentialAccepted = true;
            // }
        }
        else if (req.body.message_type === 'verification') {
            console.log("cred verificatation notif");
            verificationAccepted = true;
            console.log(req.body);
        } else {
            console.log("WEBHOOK message_type = ", req.body.message_type);
            console.log("body = ", req.body);
        }
    }
    catch (e) {
        console.log("/webhook error: ", e.message || e.toString());
    }
});

//FRONTEND ENDPOINTS

app.post('/api/issue', cors(), async function (req, res) {
    console.log("IN /api/issue");
    if (connectionId) {
        console.log("issue params = ", req.body);
        let credDefId = await getCredDefId(EBAY_SCHEMA_NAME);
        console.log(" Ebay Cred Def ID", credDefId);
        var credentialOfferParameters = {
            "definitionId": credDefId,
            "connectionId": connectionId,
            "credentialValues": {
                "name": req.body["name"],
                "feedbackscore": req.body["feedbackscore"],
                "registrationdate": req.body["registrationdate"],
                "negfeedbackcount": req.body["negfeedbackcount"],
                "posfeedbackcount": req.body["posfeedbackcount"],
                "posfeedbackpercent": req.body["posfeedbackpercent"],
            }
        }
        console.log("credentialOfferParameters:\n", credentialOfferParameters);
        let vcResp = await sendCredentialOffer(URL_SEND_EBAY_CRED_OFFER.href, credentialOfferParameters);
        console.log("----------------------> CREDENTIAL CREATED!", vcResp);
        res.status(200).send();
    } else {
        res.status(500).send("Not connected");
    }
});

app.post('/api/etsy/issue', cors(), async function (req, res) {
    console.log("/api/etsy/issue");
    if (connectionId) {
        console.log("issue params = ", req.body);
        let credDefId = await getCredDefId(ETSY_SCHEMA_NAME);
        console.log(" Etsy Cred Def ID", credDefId);


        var credentialOfferParameters = {
            "definitionId": credDefId,
            "connectionId": connectionId,
            "credentialValues": {
                "etsy_name": req.body["name"],
                "etsy_feedbackcount": req.body["feedbackcount"],
                "etsy_registrationdate": req.body["registrationdate"],
                "etsy_posfeedbackpercent": req.body["posfeedbackpercent"],     
            }
        }
        /* "credentialValues": {
            "name": "odib",
            "feedbackcount": "10",
            "registrationdate": "2020-06-03",
            "posfeedbackpercent": "5",
        } */
        console.log("credentialOfferParameters:\n", credentialOfferParameters);
        let vcResp = await sendCredentialOffer(URL_SEND_ETSY_CRED_OFFER.href, credentialOfferParameters);
        console.log("----------------------> CREDENTIAL CREATED!", vcResp);
        res.status(200).send();
    } else {
        res.status(500).send("Not connected");
    }
});

async function sendCredentialOffer(endPointUrl, credentialOfferParameters) {
    console.log("JSON.stringify(credentialOfferParameters)", JSON.stringify(credentialOfferParameters));
    const options = {
        method: 'POST'
        , uri: endPointUrl
        , body: JSON.stringify(credentialOfferParameters)
        , headers: { 'content-type': 'application/json' }
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log("ERROR sendCredentialOffer = ", err)
    });
}

async function getCredDefId(schemaName) {
    URL_QUERY_CRED_DEF.searchParams.delete("schema_name");
    URL_QUERY_CRED_DEF.searchParams.append("schema_name", schemaName);
    const options = {
        uri: URL_QUERY_CRED_DEF.href,
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };

    console.log("URL_QUERY_CRED_DEF.href",URL_QUERY_CRED_DEF.href);
    return request(options).then(function (resp) {
        console.log("resp.credential_definition_ids[0]",resp.credential_definition_ids[0]);
        return (resp.credential_definition_ids[0]);
    }).catch(function (err) {
        console.log("ERROR in exports.queryConnections  = ", err)
    });
}



async function findClientConnection(theirDid) {
    //return await client.getConnection(connectionId);
    URL_QUERY_CONNECTIONS.searchParams.append("their_did", theirDid);
    const options = {
        uri: URL_QUERY_CONNECTIONS.href,
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log("ERROR in exports.queryConnections  = ", err)
    });
}

async function getPublicDID() {
    const options = {
        uri: URL_GET_PUBLIC_DID.href,
        headers: { 'User-Agent': 'Request-Promise' },
        json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log("ERROR in getPublicDID  = ", err)
    });
}



async function getConnectionWithTimeout(theirDid) {
    let timeoutId;

    const delay = new Promise(function (resolve, reject) {
        timeoutId = setTimeout(function () {
            reject(new Error('timeout'));
        }, 3000);
    });

    // overall timeout
    return Promise.race([delay, findClientConnection(theirDid)])
        .then((res) => {
            clearTimeout(timeoutId);
            return res;
        });
}


app.post('/api/login', cors(), async function (req, res) {
    console.log("Retrieving connection record for id ", req.body);
    let theirDid = req.body.passcode;

    // verify that the connection record exists for this id
    let connectionContract;
    try {
        connectionContract = await getConnectionWithTimeout(theirDid);
        connectionId = connectionContract.results[0].connection_id;
    } catch (e) {
        console.log(e.message || e.toString());
        res.status(500).send("connection record not found for Did " + theirDid);
    }

    if (connectionContract) {
        console.log("connectionContract = ", connectionContract);
        res.status(200).send(connectionContract);
    } else {
        console.log("connection record not found for id ", connectionId);
        res.status(500);
    }
});

app.get('/api/did', cors(), async function (req, res) {
    let didObject;
    try {
        didObject = await getPublicDID();
    } catch (e) {
        console.log(e.message || e.toString());
        res.status(500).send("DID Object not found " );
    }

    if (didObject) {
        console.log("didObject = ", didObject);
        res.status(200).send(didObject);
    } else {
        console.log("DID Object not found ");
        res.status(500);
    }
});


app.post('/api/register', cors(), async function (req, res) {
    console.log("Getting invite...")
    console.log("Invite params = ", req.body);
    const invite = await getInvite(req.body.passcode);
    const attribs = JSON.stringify(req.body);
    console.log("invite= ", invite);
    cache.add(invite.connectionId, attribs);
    res.status(200).send({ invite_url: invite.invitation });
});

app.post('/api/revoke', cors(), async function (req, res) {
    console.log("revoking credential, id = ", credentialId);
    await client.revokeCredential(credentialId);
    console.log("Credential revoked!");
    res.status(200).send();
});

app.post('/api/connected', cors(), async function (req, res) {
    console.log("Waiting for connection...");
    await utils.until(_ => registered === true);
    res.status(200).send();
});




app.post('/api/credential_accepted', cors(), async function (req, res) {
    console.log("Waiting for credential to be accepted...");
    await utils.until(_ => credentialAccepted === true);
    credentialAccepted = false;
    res.status(200).send();
});

app.post('/api/verification_accepted', cors(), async function (req, res) {
    console.log("Waiting for proof request (verification) to be accepted...");
    await utils.until(_ => verificationAccepted === true);
    verificationAccepted = false;
    res.status(200).send();
});



app.post('/api/sendkeyverification', cors(), async function (req, res) {

    // need to call client.sendVerificationFromParameters
    // use VerificationPolicyParameters for params

    const params =
    {
        verificationPolicyParameters: {
            "name": "ebay2",
            "version": "1.0",
            "attributes": [
                {
                    "policyName": "ebay May 20 (2)",
                    "attributeNames": [
                        "User Name",
                        "Feedback Score"
                    ],
                    "restrictions": null
                }
            ],
            "predicates": [],
            "revocationRequirement": null
        }
    }
    console.log("send verification request, connectionId = ", connectionId, "; params = ", params);
    const resp = await client.sendVerificationFromParameters(connectionId, params);
    res.status(200).send();
});

const getInvite = async (id) => {
    try {
        var result = await client.createConnection({
            connectionInvitationParameters: {
                connectionId: id,
                multiParty: false
            }
        });
        console.log(">>>>>>>>>>>> INVITE = ", result);
        return result;
    } catch (e) {
        console.log(e.message || e.toString());
    }
}

// for graceful closing
// var server = https.createServer(certOptions, app);
var server = https.createServer(certOptions, app);
async function onSignal() {
    var webhookId = cache.get("webhookId");
    const p1 = await client.removeWebhook(webhookId);
    return Promise.all([p1]);
}
createTerminus(server, {
    signals: ['SIGINT', 'SIGTERM'],
    healthChecks: {},
    onSignal
});

const PORT = process.env.PORT || 3002;
var server = server.listen(PORT, async function () {
    // const url_val = await ngrok.connect(PORT);
    // console.log("============= \n\n" + url_val + "\n\n =========");

    const url_val = process.env.NGROK_URL + "/webhook";
    console.log("Using ngrok (webhook) url of ", url_val);
    var response = await client.createWebhook({
        webhookParameters: {
            url: url_val,  // process.env.NGROK_URL
            type: "Notification"
        }
    });

    cache.add("webhookId", response.id);
    console.log('Listening on port %d', server.address().port);
});
