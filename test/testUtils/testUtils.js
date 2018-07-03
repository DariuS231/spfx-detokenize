"use strict";

const fs = require('fs');

const countWords = (str, strToFind) => {
    str += '';
    strToFind += '';

    if (strToFind.length <= 0) {
        return str.length + 1;
    }

    const subStr = strToFind.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return (str.match(new RegExp(subStr, 'gi')) || []).length;
}
const getFilesOriginalData = (replaceArrayData, config) => {
    replaceArrayData.forEach(tokenData => {
        tokenData.OriginalFiles = [];
        tokenData.files.forEach(file => {
            const content = fs.readFileSync(`${config.libFolder}/${file.replace(/\.[^.]*$/ig, '')}.js`, 'utf-8');
            const tokenCount = countWords(content, tokenData.token);
            tokenData.OriginalFiles.push({ file, content, tokenCount });
        });
    });
    return replaceArrayData
}
const setFilesOriginalData = (replaceArrayData, config) => {
    replaceArrayData.forEach(tokenData => {
        tokenData.OriginalFiles.forEach(file => {
            fs.writeFileSync(`${config.libFolder}/${file.file.replace(/\.[^.]*$/ig, '')}.js`, file.content, 'utf-8');
        });
    });
}
const isFilesOriginalDataDifferent = (replaceArrayData, config) => {
    let filesContentIsDiff = true;
    replaceArrayData.forEach(tokenData => {
        tokenData.OriginalFiles.forEach(file => {
            const content = fs.readFileSync(`${config.libFolder}/${file.file.replace(/\.[^.]*$/ig, '')}.js`, 'utf-8');
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