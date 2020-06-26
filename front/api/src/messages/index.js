'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;

//URL for Basic-Message 
const urlSendMessageToConnection = endPoint+"/connections/{id}/send-message";
const urlExpireMessage = endPoint+"/connections/{id}/expire-message/{activity_id}";

////////////////////////////////////////////************************* Message ************************///////////////////////////////////
//#1 Send a basic message to a connection
//#2 Expire a copyable basicmessage

//#1 Send a basic message to a connection
exports.sendMessageToConnection = async function(connectionId, messageContent) { 
    const options = {
        method: 'POST'
        ,uri: urlSendMessageToConnection.replace('{id}', connectionId)
        ,json: true
        ,body: {"body":messageContent}
        ,headers: {'content-type' : 'application/json'}
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendMessageToConnection  = ", err )
    });
}


//#2 Expire a copyable basicmessage
exports.expireMessage = async function(connectionId, activityId) { 
    
    const options = {
        method: 'POST'
        ,uri: urlExpireMessage.replace('{id}', connectionId).replace('{activity_id}', activityId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.expireMessage  = ", err )
    });
}
