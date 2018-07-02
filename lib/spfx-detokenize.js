"use strict";
const { Logger } = require("./logger");
const { spfxArgs } = require("./args");
const { file } = require("./content");

/**
 * Returns a Promise for the addBuildTasks.
 * @param {Object[]} replaceTokenArray - Array of token object to replace.
 * @param {string} replaceTokenArray[].paramName - Name of the gulp command parameter.
 * @param {string} [replaceTokenArray[].paramDescription] - Description of the gulp command parameter.
 * @param {string} replaceTokenArray[].token - Token to replace.
 * @param {string[]} replaceTokenArray[].files - Files to be updated.
 * @param {string} [taskName] - Name for gulp sub-task .
 */
module.exports = (replaceTokenArray, taskName) => {
    const taskNameStr = (taskName || "detokenize-files");
    const subTaskName = `${taskNameStr}-token`;
    return {
        execute: async (config) => {
            var start = new Date().getTime();
            try {
                Logger.Info(``, taskNameStr, `Started`);
                var args = spfxArgs.GetArguments();
                for (let i = 0; i < replaceTokenArray.length; i++) {
                    var fileStart = new Date().getTime();
                    const tokenData = replaceTokenArray[i];
                    Logger.Info(`Parameter Name: ${tokenData.paramName}, Token: ${tokenData.token}`, subTaskName, "Started");
                    const paramValue = await spfxArgs.GetArgumentValue(tokenData, args);
                    await file.ReplaceFilesContent(config, tokenData, paramValue, subTaskName);
                    Logger.Info(`Parameter Name: ${tokenData.paramName}, Token: ${tokenData.token}`, subTaskName, "Finished", fileStart);
                }
                Logger.Info(``, taskNameStr, `Finished`, start);
            } catch (ex) {
                Logger.Error(`An error ocurred while de-tokenizing the files. Message: ${ex.message}`, taskNameStr);
                throw ex;
            }
        },
        name: taskNameStr
    };
}