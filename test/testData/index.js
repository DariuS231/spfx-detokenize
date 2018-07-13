"use strict";

const apiIdValue = "31d0a073-5aff-40cf-b724-9582704edb08";
const apiURLValue = "https://js231sp.com/";
const testFilePath = "testFiles/fileToReplaceTest";

module.exports = {
    config: { libFolder: "./test" },
    apiIdValue,
    apiURLValue,
    testFilePath,
    replaceArrayData: [
        {
            paramName: "appId",
            paramDescription: "AD APP Client ID",
            token: "$AD_APP_ID$",
            replacedValue: apiIdValue,
            files: [ testFilePath ]
        },
        {
            paramName: "endpointUrl",
            paramDescription: "Endpoint API URL",
            token: "$ENDPOINT_API_URL$",
            replacedValue: apiURLValue,
            files: [ testFilePath ]
        }
    ]
}