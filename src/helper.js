export let sanitizeText = function (text, isQuestion = false) {
    if (!text) return text;
    text = text
        .replace(/\\'/g, "'")
        .replace(/<\/?(i|b)>/g, "")
        .replace(/(\S)(,|:)(\D)/g, "$1$2 $3")
        .replace(/--/g, " -- ");
    if (isQuestion) {
        text = text.replace(/^\(.*\)/g, "");
    }
    return text;
}

export let sleep = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
