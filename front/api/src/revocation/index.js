'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;

//URL for Schemas APIS
const urlGetMySentRevocationsFromLedger= endPoint+"/revocation/registries/created";
const urlGetRevocationFromLedger = endPoint+"/revocation/registry/{rev_reg_id}";


//Search for matching revocation registries that current agent created
exports.getMySentRevocationsFromLedger = async function(state, cred_def_id) {
    const myUrlWithParams = new URL(urlGetMySentRevocationsFromLedger);
    if (state)  myUrlWithParams.searchParams.append("state", state);
    if (cred_def_id)  myUrlWithParams.searchParams.append("cred_def_id",cred_def_id);

    console.log(myUrlWithParams.href);
    const options = {
        uri: myUrlWithParams.href,
        headers: {'User-Agent': 'Request-Promise'},
        json: true
    };
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getMySentRevocationsFromLedger  = ", err )
    });
}

//Get revocation registry by revocation registry id
exports.getRevocationFromLedger = async function(rev_reg_id) {
    const options = {
        method: 'GET'
        ,uri: urlGetRevocationFromLedger.replace('{rev_reg_id}', rev_reg_id)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getRevocationFromLedger  = ", err )
    });
}


