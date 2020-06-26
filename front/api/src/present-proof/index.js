'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;

//URL for Issue-Credential
const urlFetchAllPresentProofExchangeRecords = endPoint+"/present-proof/records";
const urlFetchSinglePresentationExchangeRecord = endPoint+"/present-proof/records/{pres_ex_id}";
const urlFetchCredentialsForPresentationRequestFromWallet = endPoint+"/present-proof/records/{pres_ex_id}/credentials";
const urlFetchCredentialsForPresentationRequestFromWalletByReferent = endPoint+"/present-proof/records/{pres_ex_id}/credentials/{referent}";
const urlSendPresentationProposal = endPoint+"/present-proof/send-proposal";
const urlSendFreePresentationRequestNotBoundToAnyProposal = endPoint+"/present-proof/send-request";
const urlSendPresentationRequestInReferenceToProposal = endPoint+"/present-proof/records/{pres_ex_id}/send-request";
const urlSendProofPresentation = endPoint+"/present-proof/records/{pres_ex_id}/send-presentation";
const urlVerifyReceivedPresentation = endPoint+"/present-proof/records/{pres_ex_id}/verify-presentation";
const urlRemoveExistingPresentationExchangeRecord = endPoint+"/present-proof/records/{pres_ex_id}/remove";

////////////////////////////////////////////************************* Start API Associated with the present-proof ************************///////////////////////////////////
//#1  Fetch all present-proof exchange records
//#2  Fetch a single presentation exchange record
//#3  Fetch credentials for a presentation request from wallet
//#4  Fetch credentials for a presentation request from wallet by referent
//#5  Sends a presentation proposal
//#6  Sends a free presentation request not bound to any proposal
//#7  Sends a presentation request in reference to a proposal
//#8  Sends a proof presentation
//#9  Verify a received presentation
//#10 Remove an existing presentation exchange record


//#1  Fetch all present-proof exchange records
exports.fetchAllPresentProofExchangeRecords = async function() {
     const options = {
        method: 'GET'
        ,uri: urlFetchAllPresentProofExchangeRecords
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.fetchAllPresentProofExchangeRecords  = ", err )
    });
}

//#2  Fetch a single presentation exchange record
exports.fetchSinglePresentationExchangeRecord = async function(presentProofExchangeId) {
    const options = {
        method: 'GET'
        ,uri: urlFetchSinglePresentationExchangeRecord.replace('{pres_ex_id}', presentProofExchangeId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.fetchSinglePresentationExchangeRecord  = ", err )
    });
}

//#3  Fetch credentials for a presentation request from wallet
exports.fetchCredentialsForPresentationRequestFromWallet = async function(presentProofExchangeId) {
    const options = {
        method: 'GET'
        ,uri: urlFetchCredentialsForPresentationRequestFromWallet.replace('{pres_ex_id}', presentProofExchangeId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.fetchCredentialsForPresentationRequestFromWallet  = ", err )
    });
}

//#4  Fetch credentials for a presentation request from wallet by referent
exports.fetchCredentialsForPresentationRequestFromWalletByReferent = async function(presentProofExchangeId,referent) {
     const options = {
        method: 'GET'
        ,uri: urlFetchCredentialsForPresentationRequestFromWalletByReferent.replace('{pres_ex_id}', presentProofExchangeId).replace('{referent}', referent)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.fetchCredentialsForPresentationRequestFromWalletByReferent  = ", err )
    });
}


//#5  Sends a presentation proposal
exports.sendPresentationProposal = async function(proposalDetails) {
    const options = {
        method: 'POST'
        ,uri: urlSendPresentationProposal
        ,json: true
        ,body: {"body":proposalDetails}
        ,headers: {'content-type' : 'application/json'}
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendPresentationProposal  = ", err )
    });
}


//#6  Sends a free presentation request not bound to any proposal
exports.sendFreePresentationRequestNotBoundToAnyProposal = async function(requestDetails) {
    console.log(" requestDetails ", requestDetails);
    const options = {
        method: 'POST'
        ,uri: urlSendFreePresentationRequestNotBoundToAnyProposal
        ,body:  requestDetails
        ,headers: {'content-type' : 'application/json'}
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendFreePresentationRequestNotBoundToAnyProposal  = ", err )
    });

}


//#7  Sends a presentation request in reference to a proposal
exports.sendPresentationRequestInReferenceToProposal = async function(presentProofExchangeId, requestDetails) {
    const options = {
        method: 'POST'
        ,uri: urlSendPresentationRequestInReferenceToProposal.replace('{pres_ex_id}', presentProofExchangeId)
        ,json: true
        ,body: {"body":requestDetails}
        ,headers: {'content-type' : 'application/json'}
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendPresentationRequestInReferenceToProposal  = ", err )
    });
}


//#8  Sends a proof presentation
exports.sendProofPresentation = async function(presentProofExchangeId, proofPresentationDetails) {
  const options = {
        method: 'POST'
        ,uri: urlSendProofPresentation.replace('{pres_ex_id}', presentProofExchangeId)
        ,body: JSON.stringify(proofPresentationDetails)
        ,headers: {'content-type' : 'application/json'}
    };

    console.log("options in sendProofPresentation:",options);
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendProofPresentation  = ", err )
    });

}

//#9  Verify a received presentation
exports.verifyReceivedPresentation = async function(presentProofExchangeId) {
     const options = {
        method: 'POST'
        ,uri: urlVerifyReceivedPresentation.replace('{pres_ex_id}', presentProofExchangeId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.verifyReceivedPresentation  = ", err )
    });

}

//#10 Remove an existing presentation exchange record
exports.removeExistingPresentationExchangeRecord = async function(presentProofExchangeId) {
     const options = {
        method: 'POST'
        ,uri: urlRemoveExistingPresentationExchangeRecord.replace('{pres_ex_id}', presentProofExchangeId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.removeExistingPresentationExchangeRecord  = ", err )
    });
}
