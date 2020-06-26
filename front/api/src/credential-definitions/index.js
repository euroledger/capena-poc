'use strict';
const config = require('../../../config');
const request = require('request-promise');

//const agentEndPoint = "http://172.24.8.73";
//const port = "8031";
const endPoint = config.endpointDidEndpoint;

//URL for Credential-definitions
const urlSendCredentialDefinitionToLedger = endPoint+"/credential-definitions";
const urlGetCredentialDefinitionFromLedger = endPoint+"/credential-definitions/{id}";
const urlGetMySentCredentialDefinitionFromLedger= endPoint+"/credential-definitions/created";



////////////////////////////////////////////************************* Start API Associated with the Credential Definition ************************///////////////////////////////////
//#1 Send Credential Definition to the ledger
//#2 Get a Credential Definition from the ledger

//#1 Send Credential Definition to the ledger
exports.sendCredentialDefinitionToLedger = async function(cred_def_tag, cred_def_support_revocation, schema_id) {
    let credDefDetails = {
        "tag":cred_def_tag,
        "schema_id": schema_id        
    };
    //"support_revocation":cred_def_support_revocation,
    console.log ("credDefDetails",JSON.stringify(credDefDetails));
    console.log("JSON.stringify(credDefDetails)",JSON.stringify(credDefDetails));
    const options = {
        method: 'POST'
        ,uri: urlSendCredentialDefinitionToLedger
        ,body: JSON.stringify(credDefDetails)
        ,headers: {'content-type' : 'application/json'}
    };
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendCredentialDefinitionToLedger  = ", err )
    });
}

//#2 Get a Credential Definition from the ledger
exports.getCredentialDefinitionFromLedger = async function(credentialDefinitionId) {
    const options = {
        method: 'GET'
        ,uri: urlGetCredentialDefinitionFromLedger.replace('{id}', credentialDefinitionId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getCredentialDefinitionFromLedger  = ", err )
    });
}


//#3 Get My Sent Credential Definition from the ledger
exports.getMySentCredentialDefinitionFromLedger = async function(schema_version,cred_def_id, schema_issuer_did, issuer_did, schema_id, schema_name) {
    const myUrlWithParams = new URL(urlGetMySentCredentialDefinitionFromLedger);
    if (schema_version)  myUrlWithParams.searchParams.append("schema_version",schema_version);
    if (cred_def_id)  myUrlWithParams.searchParams.append("cred_def_id", cred_def_id);
    if (schema_issuer_did)  myUrlWithParams.searchParams.append("schema_issuer_did", schema_issuer_did);
    if (issuer_did)  myUrlWithParams.searchParams.append("issuer_did", issuer_did);
    if (schema_id)  myUrlWithParams.searchParams.append("schema_id", schema_id);
    if (schema_name)  myUrlWithParams.searchParams.append("schema_name", schema_name);

    console.log(myUrlWithParams.href);
    const options = {
        uri: myUrlWithParams.href,
        headers: {'User-Agent': 'Request-Promise'},
        json: true
    };
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getMySentCredentialDefinitionFromLedger  = ", err )
    });
}
////////////////////////////////////////////************************* End API Associated with the Credential Definition ************************///////////////////////////////////


