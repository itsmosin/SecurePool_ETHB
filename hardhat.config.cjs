require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    neondevnet: {
      url: "https://devnet.neonevm.org",
      accounts: [
        // Add your private keys here - for now using a placeholder
        process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001"
      ],
      chainId: 245022926,
      allowUnlimitedContractSize: false,
      gas: "auto",
      gasPrice: "auto",
      isFork: true,
    }
  },
  etherscan: {
    apiKey: {
      neonevm: "test"
    },
    customChains: [
      {
        network: "neonevm",
        chainId: 245022926,
        urls: {
          apiURL: "https://devnet-api.neonscan.org/hardhat/verify",
          browserURL: "https://devnet.neonscan.org"
        }
      }
    ]
  }
}; 