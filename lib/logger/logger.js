"use strict";
const { Foreground, ConsoleColor } = require("./colors");
const readline = require('readline');


const padNumber = (num, numZeros) => {
    var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
    var zeroString = Math.pow(10, zeros).toString().substr(1);
    if (num < 0) {
        zeroString = '-' + zeroString;
    }

    return zeroString + n;
}
const getCurrentTimeFormat = () => {
    var dt = new Date();
    return `${padNumber(dt.getHours(), 2)}:${padNumber(dt.getMinutes(), 2)}:${padNumber(dt.getSeconds(), 2)}`;
}
const getMessageFormat = (message, colour, taskName, messageSuffix, startTime, noElipsis) => {
    const dtStr = getCurrentTimeFormat();
    let logStr = `[${Foreground.Gray}${dtStr}${ConsoleColor.Reset}] `;

    if (!!message) {
        logStr += `${colour}${message}${ConsoleColor.Reset} `;
    }

    if (!!taskName) {
        logStr += `'${Foreground.Blue}${taskName}${ConsoleColor.Reset}' `;
    }

    if (!!messageSuffix) {
        logStr += `${messageSuffix} `;
    }

    if (!!startTime) {
        logStr += `after ${Foreground.Magenta}${((new Date()).getTime() - startTime)} ms ${ConsoleColor.Reset}`;
    } else if (!noElipsis) {
        logStr += `...`;
    }

    return logStr;
}
const log = (message, colour, taskName, messageSuffix, startTime) => {
    console.log(getMessageFormat(message, colour, taskName, messageSuffix, startTime));
}
const info = (message, taskName, messageSuffix, startTime) => {
    log(message, Foreground.White, taskName, messageSuffix, startTime);
}
const success = (message, taskName, messageSuffix, startTime) => {
    log(message, Foreground.Green, taskName, messageSuffix, startTime);
}
const warning = (message, taskName) => {
    log(message, Foreground.Yellow, taskName);
}
const error = (message, taskName) => {
    log(message, Foreground.Red, taskName);
}
const prompt = (message) => {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const msg = getMessageFormat(message, Foreground.Yellow, '', '', null, true);
        rl.question(msg, function (answer) {
            resolve(answer);
            rl.close();
        });
    });
}

module.exports = {
    Info: info,
    Warning: warning,
    Error: error,
    Success: success,
    Prompt: prompt,
    GetMessageFormat: getMessageFormat,
    GetCurrentTimeFormat: getCurrentTimeFormat,
    PadNumber: padNumber
}