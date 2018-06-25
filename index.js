const fs = require('fs');
const prompt = require('prompt');

"use strict";

module.exports = (replaceTokenArray, taskName) => {

    const getArgsFromProccess = (argList) => {
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

    const getParamValue = (tokenData, args) => {
        const paramName = tokenData.paramName;
        let paramValue = args[paramName];
        if (!paramValue) {
            const promptText = tokenData.paramDescription || `Please provide the value for ${paramName}`;
            do {
                paramValue = prompt(promptText);
            } while (!paramValue);
        }
        return paramValue;
    };

    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    /* Define functin to find and replace specified term with replacement string */
    const replaceAll = (str, term, replacement) => {
        return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
    }
    const replaceFilesContent = (config, tokenData, paramValue) => {
        const token = tokenData.token;
        tokenData.files.forEach(file => {
            const filePath = `${config.libFolder}/${file.replace(/\.[^.]*$/ig,'')}.js`;
            fs.exists()
            let fileContent = fs.readFileSync(filePath, 'utf-8');
            fileContent = replaceAll(fileContent, token, paramValue);
            fs.writeFileSync(filePath, fileContent, 'utf-8');
        });

    };

    return {
        execute: (config) => {
            return new Promise((resolve, reject) => {
                try {
                    var args = getArgsFromProccess(process.argv);
                    replaceTokenArray.forEach(tokenData => {
                        const paramValue = getParamValue(tokenData, args);
                        replaceFilesContent(config, tokenData, paramValue);
                    });
                    resolve();
                } catch (ex) {
                    reject(ex);
                }
            });
        },
        name: (taskName || "detokenize-files")
    };
}