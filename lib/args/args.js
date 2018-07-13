
const { Logger } = require("../logger");

const getArguments = (argList) => {
    argList = argList || process.argv;
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
const setArgument = (key, value) => {
    process.argv.push(`--${key}`, value);
};
const getArgumentValue = async (tokenData, args) => {
    args = args || getArguments();
    const paramName = tokenData.paramName;
    let paramValue = args[paramName];
    if (!paramValue) {
        const promptText = tokenData.paramDescription || `Please provide the value for ${paramName}`;
        do {
            paramValue = await Logger.Prompt(`${promptText}: `);
        } while (!paramValue);
    }
    // Adds the value as a new parameter so it wont be requested again when running gulp serve
    setArgument(paramName, paramValue);

    return paramValue;
};

module.exports = {
    GetArguments: getArguments,
    SetArgument: setArgument,
    GetArgumentValue: getArgumentValue
}