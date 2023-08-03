require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

// const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const E_API = process.env.Etherscan_API;

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   defaultNetwork:"hardhat",
//   networks:{
//     goerli:{
//       url: GOERLI_RPC_URL,
//       accounts: [PRIVATE_KEY],
//     }
//   },
//   etherscan:{
//     apiKey: {
//       goerli:E_API
//   }},
//   solidity: "0.8.17",
// };

const MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const P_API = process.env.PolygonScan_API;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    mumbai :{
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
    }
  },
  etherscan:{
    apiKey: {
      polygonMumbai :P_API
  }},
  solidity: "0.8.17",
};
