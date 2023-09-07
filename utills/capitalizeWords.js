const lowerWords = require("./lowerWords");
function capitalizeWords(word) {
  const words = word.split(" ").filter((item) => item.length > 0);
  const formattedWords = [];
  if (words.length > 0) {
    formattedWords.push(
      words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase()
    );
  }
  for (let i = 1; i < words.length; i++) {
    if (!lowerWords.has(words[i].toLowerCase())) {
      formattedWords.push(
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase()
      );
    } else {
      formattedWords.push(words[i]);
    }
  }
  return formattedWords.join(" ");
}
module.exports = capitalizeWords;
