'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;

//URL for Credentials APIS 
const urlFetchCredentialByID = endPoint+"/credential/{id}";
const urlRemoveCredentialByID = endPoint+"/credential/{id}/remove";
const urlFetchCredentials = endPoint+"/credentials";


////////////////////////////////////////////************************* Start API Associated with the Credentials ************************///////////////////////////////////
//#1 Fetch a credential from wallet by id
//#2 Remove a credential from the wallet by id
//#3 Fetch credentials from wallet

//#1 Fetch a credential from wallet by id
exports.fetchCredentialByID = async function() {
    console.log( " This method has not been implemented! ");
}

//#2 Remove a credential from the wallet by id
exports.removeCredentialByID = async function() {
      console.log( " This method has not been implemented! ");
}

//#3 Fetch credentials from wallet
exports.fetchAllCredentials = async function() {
    const options = {
        method: 'GET'
        ,uri: urlFetchCredentials
        ,json: true
    };
    
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getAllCredentials  = ", err )
    });
}
////////////////////////////////////////////************************* End API Associated with the Credentials ************************///////////////////////////////////
