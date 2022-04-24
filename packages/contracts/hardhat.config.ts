import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@shardlabs/starknet-hardhat-plugin";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 300,
      },
    },
  },
  starknet: {
    wallets: {
      wallet1: {
        accountName: "wallet1",
        modulePath: "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
        accountPath: "~/crypto/.starknet_accounts"
      },
      wallet2: {
        accountName: "wallet2",
        modulePath: "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
        accountPath: "~/crypto/.starknet_accounts"
      },
    },
  },
  networks: {
    devnet: {
      url: "http://localhost:5000",
    },
    testnet: {
      url: "https://alpha4.starknet.io",
    },
    ganache: {
      url: "http://0.0.0.0:8545",
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    gasPrice: 100,
    currency: "USD",
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
};

export default config;
