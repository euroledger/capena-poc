'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;

//URL for Issue-Credential-Exchange 
const urlFetchSingleCredentialExchangeRecord = endPoint+"/issue-credential/records/{cred_ex_id}";

////////////////////////////////////////////************************* Start API Associated with the issue-credential exchange ************************///////////////////////////////////
//#1  Fetch a single credential exchange record


//#1  Fetch a single credential exchange record
exports.fetchSingleCredentialExchangeRecord = async function(credentialExchangeId) {
     const options = {
        method: 'GET'
        ,uri: urlFetchSingleCredentialExchangeRecord.replace('{cred_ex_id}', credentialExchangeId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.fetchSingleCredentialExchangeRecord  = ", err )
    });
}




