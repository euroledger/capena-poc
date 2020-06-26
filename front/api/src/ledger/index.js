'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;
const blockchainLedgerEndPoint = config.blockchainLedgerEndPoint;

//URL for Ledger APIS 
const urlRegisterNYM = endPoint+"/ledger/register-nym";
const urlGetVerkeyForDID = endPoint+"/ledger/did-verkey";
const urlGetEndPointForDID = endPoint+"/ledger/did-endpoint?did={did}";

const urlRegisterDID = blockchainLedgerEndPoint+"/register";



////////////////////////////////////////////************************* Start API Associated with the Ledger ************************///////////////////////////////////
//#1 retrieve endPoint adresse for a given did
//#2 Send a NYM registration transaction to the ledger for a public did and verkey
//#3 Get the verkey for a DID from the ledger


//#1 retrieve endPoint adresse for a given did
exports.getEndPointForDID = async function(didVal) {
    const options = {
        method: 'GET'
        ,uri: urlGetEndPointForDID.replace('{did}', didVal)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getEndPointForDID  = ", err )
    });
}

//#2 Send a NYM registration transaction to the ledger for a public did and verkey
//DID and verkey MUST NOT be ours (it will cause an error 500)
exports.registerNYM = async function(did, verkey) {
    const options = {
        method: 'POST'
        ,uri: urlRegisterNYM
        ,json: true
        ,body: {"did":did,"verkey": verkey}
        ,headers: {'content-type' : 'application/json'},
    };
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.registerNYM  = ", err )
    });
}

//#3 Get the verkey for a DID from the ledger
exports.getVerkeyFromDid = async function(did) {
    const options = {
        method: 'POST'
        ,uri: urlGetVerkeyForDID
        ,json: true
        ,body: {"did":did}
        ,headers: {'content-type' : 'application/json'},
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getVerkeyFromDid  = ", err )
    });
}


//#4 Register a DID on the Blockchain Ledger
exports.registerDID = async function(didVal, verkeyVal) {
    const options = {
        method: 'POST'
        ,uri: urlRegisterDID
        ,json: true
        ,body: {"did":didVal,"verkey": verkeyVal, "alias": "aliasssssssssssssssssssssssssssss", "role": "TRUST_ANCHOR"}
        ,headers: {'content-type' : 'application/json'},
    };
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.registerDID  = ", err )
    });
}
////////////////////////////////////////////************************* END API Associated with the Ledger ************************///////////////////////////////////