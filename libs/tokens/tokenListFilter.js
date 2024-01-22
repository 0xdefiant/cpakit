const fs = require('fs');
const levenshtein = require('js-levenshtein');

// Load the JSON file
const rawdata = fs.readFileSync('./tokens/coingeckoCoins.json');
const tokens = JSON.parse(rawdata);

// Group tokens by their symbol
const groupedBySymbol = tokens.reduce((acc, token) => {
    acc[token.symbol] = acc[token.symbol] || [];
    acc[token.symbol].push(token);
    return acc;
}, {});

// Function to determine the similarity between two strings
const similarity = (str1, str2) => {
    const len = Math.max(str1.length, str2.length);
    return (len - levenshtein(str1, str2)) / len;
};

// Find the most similar token for each symbol
const filteredTokens = Object.keys(groupedBySymbol).map(symbol => {
    const tokenGroup = groupedBySymbol[symbol];
    if (tokenGroup.length === 1) {
        return tokenGroup[0];
    } else {
        return tokenGroup.reduce((prev, current) => {
            return similarity(current.name, symbol) > similarity(prev.name, symbol) ? current : prev;
        });
    }
});

// Write the filtered list to a new file
fs.writeFileSync('./tokens/coingeckoFilteredTokens.json', JSON.stringify(filteredTokens, null, 2));

console.log('Filtered tokens are written to coingeckoFilteredTokens.json');
