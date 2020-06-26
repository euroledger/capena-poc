'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;

//URL for Connections APIS
const urlQueryConnections = endPoint+"/connections";
const urlFetchSingleConnection = endPoint+"/connections/{id}";
const urlCreateConnectionInvitation = endPoint+"/connections/create-invitation";
const urlReceiveConnectionInvitation = endPoint+"/connections/receive-invitation ";
const urlAcceptConnectionInvitation = endPoint+"/connections/{id}/accept-invitation";
const urlAcceptConnectionRequest = endPoint+"/connections/{id}/accept-request";
const urlAssignInboundConnection = endPoint+"/connections/{id}/establish-inbound/{ref_id}";
const urlRemoveConnection = endPoint+"/connections/{id}/remove";


////////////////////////////////////////////************************* Start API Associated with the Connections ************************///////////////////////////////////
//#1 Query agent-to-agent connections
//#2 Fetch a single connection record
//#3 Create a new connection invitation
//#4 Receive a new connection invitation
//#5 Accept a stored connection invitation
//#6 Accept a stored connection request
//#7 Assign another connection as the inbound connection
//#8 Remove an existing connection record


//#1 Query agent-to-agent connections
exports.queryConnections = async function(their_role,initiator,alias,their_did,invitation_key,state,my_did) {

    const myUrlWithParams = new URL(urlQueryConnections);
    if (their_role)  myUrlWithParams.searchParams.append("their_role",their_role);
    if (initiator)  myUrlWithParams.searchParams.append("initiator", initiator);
    if (alias)  myUrlWithParams.searchParams.append("alias", alias);
    if (their_did)  myUrlWithParams.searchParams.append("their_did", their_did);
    if (invitation_key)  myUrlWithParams.searchParams.append("invitation_key", invitation_key);
    if (state)  myUrlWithParams.searchParams.append("state", state);
    if (my_did)  myUrlWithParams.searchParams.append("my_did", my_did);

    console.log(myUrlWithParams.href);

    const options = {
        uri: myUrlWithParams.href,
        headers: {'User-Agent': 'Request-Promise'},
        json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.queryConnections  = ", err )
    });
}

//#2 Fetch a single connection record
exports.fetchSingleConnection = async function(connectionId) {
    const options = {
        method: 'GET'
        ,uri: urlFetchSingleConnection.replace('{id}', connectionId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.fetchSingleConnection  = ", err )
    });
}

//#3 Create a new connection invitation
exports.createConnectionInvitation = async function() {
   const options = {
        method: 'POST'
        ,uri: urlCreateConnectionInvitation
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.queryConnections  = ", err )
    });
}

//#4 Receive a new connection invitation
exports.receiveConnectionInvitation = async function(invitationDetails) {
   const options = {
        method: 'POST'
        ,uri: urlReceiveConnectionInvitation
        ,json: true
        ,body: {"body":invitationDetails}
        ,headers: {'content-type' : 'application/json'}
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.receiveConnectionInvitation  = ", err )
    });
}

//#5 Accept a stored connection invitation
exports.acceptConnectionInvitation = async function(connectionId) {
   const options = {
        method: 'POST'
        ,uri: urlAcceptConnectionInvitation.replace('{id}', connectionId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.acceptConnectionInvitation  = ", err )
    });
}

//#6 Accept a stored connection request
exports.acceptConnectionRequest = async function(requestId) {
    const options = {
        method: 'POST'
        ,uri: urlAcceptConnectionRequest.replace('{id}', requestId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.acceptConnectionInvitation  = ", err )
    });
}

//#7 Assign another connection as the inbound connection
exports.assignInboundConnection = async function() {
    console.log( " This method has not been implemented! ");
}

//#8 Remove an existing connection record
exports.removeConnection = async function() {
    console.log( " This method has not been implemented! ");
}
////////////////////////////////////////////************************* End API Associated with the Connections ************************///////////////////////////////////
