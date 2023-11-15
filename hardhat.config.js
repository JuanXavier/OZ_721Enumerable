require("@nomicfoundation/hardhat-toolbox")
require("hardhat-gas-reporter")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    gasReporter: {
        enabled: true,
    },
    solidity: "0.8.20",
}
