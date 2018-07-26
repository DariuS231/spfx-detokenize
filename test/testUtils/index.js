"use strict";

const fs = require('fs');

const constants = {
    empty: '',
    encoding: 'utf-8',
    regexAllCaseInsensitive: 'gi',
    regexExtension: /\.[^.]*$/ig,
    regexCountWords: /[.*+?^${}()|[\]\\]/g,
    countWordsReplace: '\\$&',
    js: '.js'
};

const countWords = (str, strToFind) => {
    str += constants.empty;
    strToFind += constants.empty;

    if (strToFind.length <= 0) {
        return str.length + 1;
    }

    const subStr = strToFind.replace(constants.regexCountWords, constants.countWordsReplace);
    return (str.match(new RegExp(subStr, constants.regexAllCaseInsensitive)) || []).length;
}

const getFileAbsolutePath = (config, fileRelPath) => {
    return `${config.libFolder}/${fileRelPath.replace(constants.regexExtension, constants.empty)}${constants.js}`
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
const getFilesOriginalData = async (replaceArrayData, config) => {
    for (let i = 0; i < replaceArrayData.length; i++) {
        const tokenData = replaceArrayData[i];
        tokenData.OriginalFiles = [];
        for (let p = 0; p < tokenData.files.length; p++) {
            const file = tokenData.files[p];
            const filePath = getFileAbsolutePath(config, file);
            const content = await getFileContent(filePath);
            const tokenCount = countWords(content, tokenData.token);
            tokenData.OriginalFiles.push({ file, content, tokenCount });
        }
    }
    return replaceArrayData
}
const setFilesOriginalData = async (replaceArrayData, config) => {
    replaceArrayData.forEach(tokenData => {
        tokenData.OriginalFiles.forEach(file => {
            const filePath = getFileAbsolutePath(config, file.file);
            await setFileContent(filePath, file.content);
        });
    });
}
const isFilesOriginalDataDifferent = async (replaceArrayData, config) => {
    let filesContentIsDiff = true;
    replaceArrayData.forEach(tokenData => {
        tokenData.OriginalFiles.forEach(file => {
            const filePath = getFileAbsolutePath(config, file.file);
            const content = await getFileContent(filePath);
            const tokenCount = countWords(content, tokenData.token);
            const replacedCount = countWords(content, tokenData.replacedValue);

            if (tokenCount > 0 || replacedCount != file.tokenCount) {
                filesContentIsDiff = false;
            }
        });
    });
    return filesContentIsDiff;
}

module.exports = {
    countWords,
    getFilesOriginalData,
    setFilesOriginalData,
    isFilesOriginalDataDifferent
}