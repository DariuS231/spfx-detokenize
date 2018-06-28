"use strict";
const fs = require('fs');
const readline = require('readline');

const promptForParamValues = (rl, promptText) => {
    return new Promise((resolve, reject) => {
        rl.question(promptText, function (answer) {
            resolve(answer);
        });
    });
}
const getArgsFromProcess = (argList) => {
    let arg = {}, curOpt;
    argList.forEach(argItem => {
        const thisOpt = argItem.trim();
        const opt = thisOpt.replace(/^\-+/, '');

        if (opt === thisOpt) {
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;
        } else {
            curOpt = opt;
            arg[curOpt] = true;
        }
    });
    return arg;

};

const getParamValue = async (tokenData, args) => {
    const paramName = tokenData.paramName;
    let paramValue = args[paramName];
    if (!paramValue) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const promptText = tokenData.paramDescription || `Please provide the value for ${paramName}`;
        do {
            paramValue = await promptForParamValues(rl, `${promptText}: `);
        } while (!paramValue);
        rl.close();
    }
    // Adds the value as a new parameter so it wont be requested again when running gulp serve
    process.argv.push(`--${paramName}`, paramValue);
    return paramValue;
};

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const replaceAll = (str, term, replacement) => {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}

const replaceFilesContent = (config, tokenData, paramValue) => {
    const token = tokenData.token;
    tokenData.files.forEach(file => {
        const filePath = `${config.libFolder}/${file.replace(/\.[^.]*$/ig, '')}.js`;
        let fileContent = fs.readFileSync(filePath, 'utf-8');
        fileContent = replaceAll(fileContent, token, paramValue);
        fs.writeFileSync(filePath, fileContent, 'utf-8');
    });

};

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
    return {
        execute: async (config) => {
            try {
                var args = getArgsFromProcess(process.argv);
                for (let i = 0; i < replaceTokenArray.length; i++) {
                    const tokenData = replaceTokenArray[i];
                    const paramValue = await getParamValue(tokenData, args);
                    replaceFilesContent(config, tokenData, paramValue);
                }
            } catch (ex) {
                throw ex;
            }
        },
        name: (taskName || "detokenize-files")
    };
}