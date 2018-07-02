const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const replaceAll = (str, term, replacement) => {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}
module.exports = {
    Replace: replaceAll
}