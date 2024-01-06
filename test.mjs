import getNonZeroTokenBalances from "./libs/tokenBalance";

getNonZeroTokenBalances(address)
  .then(tokens => console.log("Non-zero tokens:", tokens))
  .catch(error => console.error("Error:", error));