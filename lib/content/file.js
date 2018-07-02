
const fs = require('fs');
const { Replace } = require("./string");
const { Logger } = require("../logger");

const replaceFilesContent = async (config, tokenData, paramValue, taskName) => {
    const token = tokenData.token;

    for (let i = 0; i < tokenData.files.length; i++) {
        
        var start = new Date().getTime();
        const file = tokenData.files[i];
        const filePath = `${config.libFolder}/${file.replace(/\.[^.]*$/ig, '')}.js`;

        Logger.Info(`File ${filePath}`, `${taskName}-file`, "Started");
        if (fs.existsSync(filePath)) {
            let fileContent = await fs.readFileSync(filePath, 'utf-8');
            fileContent = Replace(fileContent, token, paramValue);
            fs.writeFileSync(filePath, fileContent, 'utf-8');
            Logger.Info(`File ${filePath}`, `${taskName}-file`, "Finished", start);
        } else {
            Logger.Error(`File ${filePath} not found.`, `${taskName}-file`);
            //throw `File ${filePath} not found.`;
        }
    }
};

module.exports = {
    ReplaceFilesContent: replaceFilesContent
}