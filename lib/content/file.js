
const fs = require('fs');
const { Replace } = require("./string");
const { Logger } = require("../logger");

const constants = {
    empty: '',
    regexExtension: /\.[^.]*$/ig,
    js: '.js'
};

const getFileAbsolutePath = (config, fileRelPath) => {
    return `${config.libFolder}/${fileRelPath.replace(constants.regexExtension, constants.empty)}${constants.js}`
}
const fileExist = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            resolve(!err);
        });
    });
}
const getFileContent = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
const setFileContent = (filePath, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}
const replaceFileContent = async (filePath) => {
    if (await fileExist(filePath)) {
        let fileContent = await getFileContent(filePath);
        fileContent = Replace(fileContent, token, paramValue);
        await setFileContent(filePath, fileContent);
        return true;
    } else {
        return false;
    }
}
const replaceFilesContent = async (config, tokenData, paramValue, taskName) => {
    for (let i = 0; i < tokenData.files.length; i++) {
        var start = new Date().getTime();
        const filePath = getFileAbsolutePath(config, tokenData.files[i]);

        Logger.Info(`File ${filePath}`, `${taskName}-file`, "Started");
        if (await replaceFileContent(filePath)) {
            Logger.Info(`File ${filePath}`, `${taskName}-file`, "Finished", start);
        } else {
            Logger.Error(`File ${filePath} not found.`, `${taskName}-file`);
            //throw `File ${filePath} not found.`;
        }
    }
};

module.exports = {
    ReplaceFilesContent: replaceFilesContent,
    ReplaceFileContent:replaceFileContent,
    SetFileContent:setFileContent,
    GetFileContent:getFileContent,
    FileExist:fileExist,
    GetFileAbsolutePath:getFileAbsolutePath
}