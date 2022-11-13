// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.17",
// };
// // hardhat.config.js

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
// require("@nomicfoundation/hardhat-toolbox");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const GOERLI = process.env.GOERLI_URL;
const PRIVATE = process.env.PRIVATE_KEY;
//console.log(GOERLI);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: GOERLI,
      accounts: [PRIVATE]
    }
  }
};