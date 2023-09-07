function capitalizeWord(word) {
  const words = word.split(" ").filter((item) => item.length > 0);
  const capitalizeWords = [];
  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    const capitalizeString =
      currentWord[0].toUpperCase() + currentWord.slice(1);
    capitalizeWords.push(capitalizeString);
  }
  return capitalizeWords.join(" ");
}
module.exports = capitalizeWord;
