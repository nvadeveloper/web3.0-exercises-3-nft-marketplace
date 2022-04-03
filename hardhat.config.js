require("@nomiclabs/hardhat-waffle");

const fs = require('fs')
// const privateKey = fs.readFileSync('./keys/private.pem', 'utf8')
const privateKey = fs.readFileSync('.secret').toString()

const projectId = '1839705833d340189785777890b5544a'

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
  },
  solidity: "0.8.4",
};
