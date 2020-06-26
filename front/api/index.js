'use strict';
const config = require('../config');

exports.connections = require('./src/connections');
exports.credentialDefinitions = require('./src/credential-definitions');
exports.credentials = require('./src/credentials');
exports.issueCredential = require('./src/issue-credential');
exports.issueCredentialExchange = require('./src/issue-credential-exchange');
exports.ledger = require('./src/ledger');
exports.messages = require('./src/messages');
exports.presentProof = require('./src/present-proof');
exports.schemas = require('./src/schemas');
exports.wallet = require('./src/wallet');
exports.revocation = require('./src/revocation');

// 'use strict';
// const config = require('../config');
// const request = require('request-promise');

// //const agentEndPoint = "http://172.24.8.73";
// //const port = "8031";        
// const endPoint = config.endpointDidEndpoint;

// //URL for Connections APIS 
// const urlQueryConnections = endPoint+"/connections";
// const urlFetchSingleConnection = endPoint+"/connections/{id}";
// const urlCreateConnectionInvitation = endPoint+"/connections/create-invitation";
// const urlReceiveConnectionInvitation = endPoint+"/connections/receive-invitation ";
// const urlAcceptConnectionInvitation = endPoint+"/connections/{id}/accept-invitation";
// const urlAcceptConnectionRequest = endPoint+"/connections/{id}/accept-request";
// const urlAssignInboundConnection = endPoint+"/connections/{id}/establish-inbound/{ref_id}";
// const urlRemoveConnection = endPoint+"/connections/{id}/remove";


// //URL for Credentials APIS 
// const urlFetchCredentialByID = endPoint+"/credential/{id}";
// const urlRemoveCredentialByID = endPoint+"/credential/{id}/remove";
// const urlFetchCredentials = endPoint+"/credentials";

// //URL for Schemas APIS 
// const urlSendSchemaToLedger = endPoint+"/schemas";
// const urlGetSchemaFromLedger = endPoint+"/schemas/{id}";

// //URL for Credential-definitions
// const urlSendCredentialDefinitionToLedger = endPoint+"/credential-definitions";
// const urlGetCredentialDefinitionFromLedger = endPoint+"/credential-definitions/{id}";

// //URL for Basic-Message 


// //URL for Issue-Credential 


// //URL for Issue-Credential-Exchange 


// //URL for Present-Proof 

// //URL for Wallet APIS 
// const urlListWalletDIDs = endPoint+"/wallet/did";
// const urlCreateLocalDID = endPoint+"/wallet/did/create";
// const urlFetchCurrentPublicDID = endPoint+"/wallet/did/public";
// const urlAssignCurrentPublicDID = endPoint+"/wallet/did/public";
// const urlGetTaggingPolicyForCredentialDefinition = endPoint+"/wallet/tag-policy/{id}";
// const urlSetTaggingPolicyForCredentialDefinition = endPoint+"/wallet/tag-policy/{id}";


// //URL for Ledger APIS 
// const urlRegisterNYM = endPoint+"/ledger/register-nym";
// const urlGetVerkeyForDID = endPoint+"/ledger/did-verkey";
// const urlGetEndPointForDID = endPoint+"/ledger/did-endpoint";

// console.log( " endPoint ", endPoint);


// ////////////////////////////////////////////************************* Start API Associated with the Connections ************************///////////////////////////////////
// //#1 Query agent-to-agent connections
// //#2 Fetch a single connection record
// //#3 Create a new connection invitation
// //#4 Receive a new connection invitation   
// //#5 Accept a stored connection invitation
// //#6 Accept a stored connection request
// //#7 Assign another connection as the inbound connection
// //#8 Remove an existing connection record


// //#1 Query agent-to-agent connections
// exports.queryConnections = async function() { 
//     const options = {
//         method: 'GET'
//         ,uri: urlQueryConnections
//         ,json: true
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.queryConnections  = ", err )
//     });
// }

// //#2 Fetch a single connection record
// exports.fetchSingleConnection = async function() { 
//     console.log( " This method has not been implemented! ");
// }

// //#3 Create a new connection invitation
// exports.createConnectionInvitation = async function() { 
//   const options = {
//         method: 'POST'
//         ,uri: urlCreateConnectionInvitation
//         ,json: true
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.queryConnections  = ", err )
//     });
// }

// //#4 Receive a new connection invitation   
// exports.receiveConnectionInvitation = async function(invitationDetails) { 
//   const options = {
//         method: 'POST'
//         ,uri: urlReceiveConnectionInvitation
//         ,json: true
//         ,body: JSON.stringify({"body":invitationDetails})
//         ,headers: {'content-type' : 'application/json'}
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.receiveConnectionInvitation  = ", err )
//     });
// }

// //#5 Accept a stored connection invitation
// exports.acceptConnectionInvitation = async function(connectionId) { 
//   const options = {
//         method: 'POST'
//         ,uri: urlAcceptConnectionInvitation.replace('{id}', connectionId)
//         ,json: true
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.acceptConnectionInvitation  = ", err )
//     });
// }

// //#6 Accept a stored connection request
// exports.acceptConnectionRequest = async function(requestId) { 
//     const options = {
//         method: 'POST'
//         ,uri: urlAcceptConnectionRequest.replace('{id}', requestId)
//         ,json: true
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.acceptConnectionInvitation  = ", err )
//     });
// }

// //#7 Assign another connection as the inbound connection
// exports.assignInboundConnection = async function() { 
//     console.log( " This method has not been implemented! ");
// }

// //#8 Remove an existing connection record
// exports.removeConnection = async function() { 
//     console.log( " This method has not been implemented! ");
// }
// ////////////////////////////////////////////************************* End API Associated with the Connections ************************///////////////////////////////////



// ////////////////////////////////////////////************************* Start API Associated with the Credentials ************************///////////////////////////////////
// //#1 Fetch a credential from wallet by id
// //#2 Remove a credential from the wallet by id
// //#3 Fetch credentials from wallet

// //#1 Fetch a credential from wallet by id
// exports.fetchCredentialByID = async function() {
//     console.log( " This method has not been implemented! ");
// }

// //#2 Remove a credential from the wallet by id
// exports.removeCredentialByID = async function() {
//       console.log( " This method has not been implemented! ");
// }

// //#3 Fetch credentials from wallet
// exports.fetchAllCredentials = async function() {
//     const options = {
//         method: 'GET'
//         ,uri: urlFetchCredentials
//         ,json: true
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.getAllCredentials  = ", err )
//     });
// }
// ////////////////////////////////////////////************************* End API Associated with the Credentials ************************///////////////////////////////////



// ////////////////////////////////////////////************************* Start API Associated with the Schemas ************************///////////////////////////////////
// //#1 Send Schema to the ledger
// //#2 Get a Schema from the ledger

// //#1 Send Schema to the ledger
// exports.sendSchemaToLedger = async function(schemaDetails) {
//     const options = {
//         method: 'POST'
//         ,uri: urlSendSchemaToLedger
//         ,json: true
//         ,body: JSON.stringify({"body":schemaDetails})
//         ,headers: {'content-type' : 'application/json'}
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.sendSchemaToLedger  = ", err )
//     });
// }

// //#2 Get a Schema from the ledger
// exports.getSchemaFromLedger = async function(schemaId) {
//     const options = {
//         method: 'GET'
//         ,uri: urlGetSchemaFromLedger.replace('{id}', schemaId)
//         ,json: true
//     };

//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.getSchemaFromLedger  = ", err )
//     });
// }
// ////////////////////////////////////////////************************* End API Associated with the Schemas ************************///////////////////////////////////


// ////////////////////////////////////////////************************* Start API Associated with the Credential Definition ************************///////////////////////////////////
// //#1 Send Credential Definition to the ledger
// //#2 Get a Credential Definition from the ledger

// //#1 Send Credential Definition to the ledger
// exports.sendCredentialDefinitionToLedger = async function(credentialDefinitionDetails) {
//     const options = {
//         method: 'POST'
//         ,uri: urlSendCredentialDefinitionToLedger
//         ,json: true
//         ,body: JSON.stringify({"body":credentialDefinitionDetails})
//         ,headers: {'content-type' : 'application/json'}
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.sendSchemaToLedger  = ", err )
//     });
// }

// //#2 Get a Credential Definition from the ledger
// exports.getCredentialDefinitionFromLedger = async function(credentialDefinitionId) {
//     const options = {
//         method: 'GET'
//         ,uri: urlGetCredentialDefinitionFromLedger.replace('{id}', credentialDefinitionId)
//         ,json: true
//     };

//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.getSchemaFromLedger  = ", err )
//     });
// }
// ////////////////////////////////////////////************************* End API Associated with the Credential Definition ************************///////////////////////////////////





// ////////////////////////////////////////////************************* Start API Associated with the Wallet ************************///////////////////////////////////
// //#1 List Wallet DIDs 
// //#2 Create a local DID
// //#3 Fetch the current public DID 
// //#4 Assign the current public DID 
// //#5 Get the tagging policy for a credential definition
// //#6 Set the tagging policy for a credential definition

// //#1 List Wallet DIDs 
// exports.listWalletDIDs = async function() { 
//     const options = {
//         method: 'GET'
//         ,uri: urlListWalletDIDs
//         ,json: true
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.listWalletDIDs  = ", err )
//     });
// }

// //#2 Create a local DID
// exports.createLocalDID = async function() { 
//     const options = {
//         method: 'POST'
//         ,uri: urlCreateLocalDID
//         ,json: true
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.createLocalDID  = ", err )
//     });
// }

// //#3 Fetch the current public DID 
// exports.fetchCurrentPublicDID = async function() { 
//     const options = {
//         method: 'GET'
//         ,uri: urlFetchCurrentPublicDID
//         ,json: true
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.fetchPublicDID  = ", err )
//     });
// }

// //#4 Assign the current public DID 
// exports.assignCurrentPublicDID = async function(did) { 
//     const options = {
//         method: 'POST'
//         ,uri: urlAssignCurrentPublicDID
//         ,json: true
//         ,body: JSON.stringify({"did":did})
//         ,headers: {'content-type' : 'application/json'},
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.assignCurrentPublicDID  = ", err )
//     });
// }

// //#5 Get the tagging policy for a credential definition
// exports.getTaggingPolicyForCredentialDefinition = async function(did) { 
//     console.log( " This method has not been implemented! ");
// }

// //#6 Set the tagging policy for a credential definition
// exports.setTaggingPolicyForCredentialDefinition = async function(did) { 
//     console.log( " This method has not been implemented! ");
// }
// ////////////////////////////////////////////************************* End API Associated with the Wallet ************************///////////////////////////////////







// ////////////////////////////////////////////************************* Start API Associated with the Ledger ************************///////////////////////////////////

// //retrieve endPoint adresse for a given did
// exports.getEndPointForDID = async function(did) {
//     const options = {
//         method: 'GET'
//         ,uri: urlGetEndPointForDID
//         ,json: true
//         ,body: JSON.stringify({"did":did})
//         ,headers: {'content-type' : 'application/json'},
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.getEndPointForDID  = ", err )
//     });
// }

// //Send a NYM registration transaction to the ledger for a public did and verkey
// //DID and verkey MUST NOT be ours (it will cause an error 500)
// exports.registerNYM = async function(did, verkey) {
//     const options = {
//         method: 'POST'
//         ,uri: urlRegisterNYM
//         ,json: true
//         ,body: JSON.stringify({"did":did,"verkey": verkey})
//         ,headers: {'content-type' : 'application/json'},
//     };
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.registerNYM  = ", err )
//     });
// }

// //Get the verkey for a DID from the ledger
// exports.getVerkeyFromDid = async function(did) {
//     const options = {
//         method: 'POST'
//         ,uri: urlGetVerkeyForDID
//         ,json: true
//         ,body: JSON.stringify({"did":did})
//         ,headers: {'content-type' : 'application/json'},
//     };
    
//     return request(options).then(function (resp) {
//         return (resp);
//     }).catch(function (err) {
//         console.log( "ERROR in exports.getVerkeyFromDid  = ", err )
//     });
// }

// ////////////////////////////////////////////************************* END API Associated with the Ledger ************************///////////////////////////////////



// exports.prepareRequest = async function (theirDid) {
//     res = await createNewDID();
//     myNewDid = res['did'];
//     myNewVerkey = res['verkey'];
//     theirVerkey = await getVerkeyFromDid(theirDid);
//     await sendNym(theirDid, theirVerkey);
//     //What is uuid()?
//     let nonce = uuid();
//     //Not sure if the front wait forthis kind of format
//     return {
//         type: MESSAGE_TYPES.REQUEST,
//         message: {
//             did: myNewDid,
//             endpointDid: await getEndpointForDid(theirDid),
//             nonce: nonce
//         }
//     }
// }

// //Send encrypted message. /!\ Encryption is not yet performed!!!!
// exports.sendAnonCryptedMessage = function(did, message) {
//     return request({
//         "headers": {'content-type' : 'application/json'},
//         "method": "POST",
//         "uri": endPoint+"/connections/"+did+"/send-message",
//         "json": true,
//         "body": JSON.stringify(message),
//     })
// }
