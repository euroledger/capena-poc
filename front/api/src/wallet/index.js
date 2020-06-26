'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;

//URL for Wallet APIS 
const urlListWalletDIDs = endPoint+"/wallet/did";
const urlCreateLocalDID = endPoint+"/wallet/did/create";
const urlFetchCurrentPublicDID = endPoint+"/wallet/did/public";
const urlAssignCurrentPublicDID = endPoint+"/wallet/did/public?did={did}";
const urlGetTaggingPolicyForCredentialDefinition = endPoint+"/wallet/tag-policy/{id}";
const urlSetTaggingPolicyForCredentialDefinition = endPoint+"/wallet/tag-policy/{id}";



////////////////////////////////////////////************************* Start API Associated with the Wallet ************************///////////////////////////////////
//#1 List Wallet DIDs 
//#2 Create a local DID
//#3 Fetch the current public DID 
//#4 Assign the current public DID 
//#5 Get the tagging policy for a credential definition
//#6 Set the tagging policy for a credential definition

//#1 List Wallet DIDs 
exports.listWalletDIDs = async function() { 
    const options = {
        method: 'GET'
        ,uri: urlListWalletDIDs
        ,json: true
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.listWalletDIDs  = ", err )
    });
}

//#2 Create a local DID
exports.createLocalDID = async function() { 
    const options = {
        method: 'POST'
        ,uri: urlCreateLocalDID
        ,json: true
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.createLocalDID  = ", err )
    });
}

//#3 Fetch the current public DID 
exports.fetchCurrentPublicDID = async function() { 
    console.log(" exports.fetchCurrentPublicDID is executed ...", endPoint); 
    const options = {
        method: 'GET'
        ,uri: urlFetchCurrentPublicDID
        ,json: true
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.fetchPublicDID  = ", err )
    });
}

//#4 Assign the current public DID 
// Has been changed, the did is passed by the url directly, otherwise, it does not work 
exports.assignCurrentPublicDID = async function(didVal) { 
    const options = {
        method: 'POST'
        ,uri: urlAssignCurrentPublicDID.replace('{did}', didVal)
        ,json: true
    };
    
    console.log ("options",options)
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.assignCurrentPublicDID  = ", err )
    });
}

//#5 Get the tagging policy for a credential definition
exports.getTaggingPolicyForCredentialDefinition = async function(did) { 
    console.log( " This method has not been implemented! ");
}

//#6 Set the tagging policy for a credential definition
exports.setTaggingPolicyForCredentialDefinition = async function(did) { 
    console.log( " This method has not been implemented! ");
}
////////////////////////////////////////////************************* End API Associated with the Wallet ************************///////////////////////////////////