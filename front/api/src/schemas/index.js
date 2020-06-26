'use strict';
const config = require('../../../config');
const request = require('request-promise');

const endPoint = config.endpointDidEndpoint;

//URL for Schemas APIS
const urlSendSchemaToLedger = endPoint+"/schemas";
const urlGetSchemaFromLedger = endPoint+"/schemas/{id}";
const urlGetMySentSchemasFromLedger= endPoint+"/schemas/created";



////////////////////////////////////////////************************* Start API Associated with the Schemas ************************///////////////////////////////////
//#1 Send Schema to the ledger
//#2 Get a Schema from the ledger

//#1 Send Schema to the ledger
exports.sendSchemaToLedger = async function(schema_name, schema_version, schema_attributes) {
    let schemaDetails = {
        "attributes": schema_attributes,
        "schema_name": schema_name,
        "schema_version": schema_version
    };

    console.log("JSON.stringify(schemaDetails)",JSON.stringify(schemaDetails));
    const options = {
        method: 'POST'
        ,uri: urlSendSchemaToLedger
        ,body: JSON.stringify(schemaDetails)
        ,headers: {'content-type' : 'application/json'}
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.sendSchemaToLedger  = ", err )
    });
}

//#2 Get a Schema from the ledger
exports.getSchemaFromLedger = async function(schemaId) {
    const options = {
        method: 'GET'
        ,uri: urlGetSchemaFromLedger.replace('{id}', schemaId)
        ,json: true
    };

    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getSchemaFromLedger  = ", err )
    });
}

//#3 Get My Sent Schemas from the ledger
exports.getMySentSchemasFromLedger = async function(schema_id,schema_version,schema_issuer_did,schema_name) {
    const myUrlWithParams = new URL(urlGetMySentSchemasFromLedger);
    if (schema_id)  myUrlWithParams.searchParams.append("schema_id", schema_id);
    if (schema_version)  myUrlWithParams.searchParams.append("schema_version",schema_version);
    if (schema_issuer_did)  myUrlWithParams.searchParams.append("schema_issuer_did", schema_issuer_did);
    if (schema_name)  myUrlWithParams.searchParams.append("schema_name", schema_name);

    console.log(myUrlWithParams.href);
    const options = {
        uri: myUrlWithParams.href,
        headers: {'User-Agent': 'Request-Promise'},
        json: true
    };
    return request(options).then(function (resp) {
        return (resp);
    }).catch(function (err) {
        console.log( "ERROR in exports.getMySentSchemasFromLedger  = ", err )
    });
}

////////////////////////////////////////////************************* End API Associated with the Schemas ************************///////////////////////////////////

