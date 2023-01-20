require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const E_API = process.env.Etherscan_API;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    goerli:{
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
    }
  },
  etherscan:{
    apiKey: {
      goerli:E_API
  }},
  solidity: "0.8.17",
};
