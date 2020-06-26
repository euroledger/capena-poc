'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;

//URL for Issue-Credential 
const urlGetAttributeMimeTypesFromWallet = endPoint+"/issue-credential/mime-types/{credential_id}";
const urlFetchAllCredentialExchangeRecords = endPoint+"/issue-credential/records";
const urlSendCredentialAutomatingEntireFlow = endPoint+"/issue-credential/send";
const urlSendIssuerCredentialProposal = endPoint+"/issue-credential/send-proposal";
const urlSendHolderCredentialOfferFreeFromReferenceToAnyProposal = endPoint+"/issue-credential/send-offer";
const urlSendHolderCredentialOfferInReferenceToProposal = endPoint+"/issue-credential/records/{cred_ex_id}/send-offer";
const urlSendCredentialRequest = endPoint+"/issue-credential/records/{cred_ex_id}/send-request";
const urlSendCredential = endPoint+"/issue-credential/records/{cred_ex_id}/issue";
const urlStoreReceivedCredential = endPoint+"/issue-credential/records/{cred_ex_id}/store";
const urlSendProblemReportForCredentialExchange = endPoint+"/issue-credential/records/{cred_ex_id}/problem-report";
const urlRemoveExistingCredentialExchangeRecord = endPoint+"/issue-credential/records/{cred_ex_id}/remove";
const urlRevokeCredential = endPoint+"/issue-credential/revoke";

////////////////////////////////////////////************************* Start API Associated with the issue-credential ************************///////////////////////////////////
//#1  Get attribute MIME types from wallet
//#2  Fetch all credential exchange records
//#3  Send credential, automating entire flow
//#4  Send issuer a credential proposal
//#5  Send holder a credential offer, free from reference to any proposal
//#6  Send holder a credential offer in reference to a proposal
//#7  Send a credential request
//#8  Send a credential
//#9  Stored a received credential
//#10 Send a problem report for credential exchange
//#11 Remove an existing credential exchange record


//#1  Get attribute MIME types from wallet
exports.getAttributeMimeTypesFromWallet = async function(credentialId) {
     const options = {
        method: 'GET'
        ,uri: urlGetAttributeMimeTypesFromWallet.replace('{credential_id}', credentialId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getAttributeMimeTypesFromWallet  = ", err )
    });
}


//#2  Fetch all credential exchange records
exports.fetchAllCredentialExchangeRecords = async function() { 
     const options = {
        method: 'GET'
        ,uri: urlFetchAllCredentialExchangeRecords
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.fetchAllCredentialExchangeRecords  = ", err )
    });
    
}

//#3  Send credential, automating entire flow
exports.sendCredentialAutomatingEntireFlow = async function(credentialDetails) {
    const options = {
        method: 'POST'
        ,uri: urlSendCredentialAutomatingEntireFlow
        ,body: JSON.stringify(credentialDetails)
        ,headers: {'content-type' : 'application/json'}
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendCredentialAutomatingEntireFlow  = ", err )
    });
}

//#4  Send issuer a credential proposal
exports.sendIssuerCredentialProposal = async function(credentialProposalDetails) { 
    const options = {
        method: 'POST'
        ,uri: urlSendIssuerCredentialProposal
        ,json: true
        ,body: {"body":credentialProposalDetails}
        ,headers: {'content-type' : 'application/json'}
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendIssuerCredentialProposal  = ", err )
    });
}

//#5  Send holder a credential offer, free from reference to any proposal
exports.sendHolderCredentialOfferFreeFromReferenceToAnyProposal = async function(credentialOfferDetails) { 
    const options = {
        method: 'POST'
        ,uri: urlSendHolderCredentialOfferFreeFromReferenceToAnyProposal
        ,body: JSON.stringify(credentialOfferDetails)
        ,headers: {'content-type' : 'application/json'}
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendHolderCredentialOfferFreeFromReferenceToAnyProposal  = ", err )
    });
    
}

//#6  Send holder a credential offer in reference to a proposal
exports.sendHolderCredentialOfferInReferenceToProposal = async function(credentialExchangeId) { 
    const options = {
        method: 'POST'
        ,uri: urlSendHolderCredentialOfferInReferenceToProposal.replace('{cred_ex_id}', credentialExchangeId)
        ,json: true
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendHolderCredentialOfferInReferenceToProposal  = ", err )
    });
}


//#7  Send a credential request
exports.sendCredentialRequest = async function(credentialExchangeId) {
    const options = {
        method: 'POST'
        ,uri: urlSendCredentialRequest.replace('{cred_ex_id}', credentialExchangeId)
        ,json: true
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendCredentialRequest  = ", err )
    });
}

//#8  Send a credential
exports.sendCredential = async function(credentialExchangeId, credentialDetails) {
     const options = {
        method: 'POST'
        ,uri: urlSendCredential.replace('{cred_ex_id}', credentialExchangeId)
        ,json: true
        ,body: {"body":credentialDetails}
        ,headers: {'content-type' : 'application/json'}
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendCredential  = ", err )
    });
}

//#9  Stored a received credential
exports.storeReceivedCredential = async function(credentialExchangeId) {
    const options = {
        method: 'POST'
        ,uri: urlStoreReceivedCredential.replace('{cred_ex_id}', credentialExchangeId)
        ,json: true
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.storeReceivedCredential  = ", err )
    });
}

//#10 Send a problem report for credential exchange
exports.sendProblemReportForCredentialExchange = async function(credentialExchangeId, problemReportDetails) {
    const options = {
        method: 'POST'
        ,uri: urlSendProblemReportForCredentialExchange.replace('{cred_ex_id}', credentialExchangeId)
        ,json: true
        ,body: {"body":problemReportDetails}
        ,headers: {'content-type' : 'application/json'}
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendProblemReportForCredentialExchange  = ", err )
    });
}

//#11 Remove an existing credential exchange record
exports.removeExistingCredentialExchangeRecord = async function(credentialExchangeId) { 
   const options = {
        method: 'POST'
        ,uri: urlRemoveExistingCredentialExchangeRecord.replace('{cred_ex_id}', credentialExchangeId)
        ,json: true
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.removeExistingCredentialExchangeRecord  = ", err )
    }); 
    
}

exports.revokeCredential = async function(rev_reg_id, cred_rev_id, publish) {
    const myUrlWithParams = new URL(urlRevokeCredential);
    myUrlWithParams.searchParams.append("rev_reg_id", rev_reg_id);
    myUrlWithParams.searchParams.append("cred_rev_id",cred_rev_id);
    myUrlWithParams.searchParams.append("publish", publish);
    console.log(myUrlWithParams.href);

    const options = {
        uri: myUrlWithParams.href,
        headers: {'User-Agent': 'Request-Promise'},
        json: true,
        method: 'POST'
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.revokeCredential  = ", err )
        return (err)
    });
}