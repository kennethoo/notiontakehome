function capitalizeWords(word) {
  const words = word.split(" ").filter((item) => item.length > 0);
  const formattedWords = [];
  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    const capitalizeString =
      currentWord[0].toUpperCase() + currentWord.slice(1);
    formattedWords.push(capitalizeString);
  }
  return formattedWords.join(" ");
}
module.exports = capitalizeWords;
