This is notes for working with Cairo and Starkware contracts

### How does Cairo work?

TBD

## Hardhat plugin for starknet

Add the following config on `hardhat.config.js`

```
  starkware: {
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
```

### Set up 2 wallets


Here the parameters to this subcommand are the keys to the wallets object defined in the configuration file

```bash
npx hardhat starknet-deploy-account --starknet-network devnet --wallet wallet1
npx hardhat starknet-deploy-account --starknet-network devnet --wallet wallet2
```

<details>
  <summary>output</summary>
  Starknet plugin using dockerized environment (shardlabs/cairo-cli:0.8.0)
Sent deploy account contract transaction.

NOTE: This is a modified version of the OpenZeppelin account contract. The signature is computed
differently.

Contract address: 0x03b6a10d4de830b18b2a95d440ffa27711b0c6210224dff6ef87d6f8ddd48385
Public key: 0x02c2620f8e642058a9a7d7053d8972d257a9389e6144922d5b45470549d2626d
Transaction hash: 0x4
</details>

### Deploy smart contract

```bash
npx hardhat starknet-deploy --starknet-network devnet --wait starknet-artifacts/contracts/RockPaperScissors.cairo/
```

<details>
  <summary>output</summary>
  Starknet plugin using dockerized environment (shardlabs/cairo-cli:0.8.0)
Sent deploy account contract transaction.

NOTE: This is a modified version of the OpenZeppelin account contract. The signature is computed
differently.

Contract address: 0x04ddc3f121f17bf8c6a7c4a7452a4de6fcaf02c11da78c62c48eee258c61322e
Public key: 0x00146f6ebfa131364427beb6f4a0735803d7bde72550598d9d1891e8735b912e
Transaction hash: 0x5


	Succeeded
</details>


### Retrieve state

```bash
npx hardhat starknet-call --starknet-network devnet --address 0x038ae14648ea6937929d033e5d60a25498f2c59104486d4e757e61da7fe2a391 --contract RockPaperScissors --function game --inputs "1"
```

<details>
  <summary>output</summary>
  Starknet plugin using dockerized environment (shardlabs/cairo-cli:0.8.0)
0 0 0 0 0 0 0

	Succeeded
</details>

### Try invoking to play

```bash
npx hardhat starknet-invoke --starknet-network devnet --address 0x038ae14648ea6937929d033e5d60a25498f2c59104486d4e757e61da7fe2a391 --contract RockPaperScissors --function play --inputs "1 1" --wallet wallet1 --wait
```

This ran into problems with hardhat plugin not sending chainID which was fixed by patching the `starknet-hardhat-plugin` to default to SN_GOERLI if a `STARKNET_CHAIN_ID` env variable is not passed.

```
diff --git a/src/starknet-wrappers.ts b/src/starknet-wrappers.ts
index c75a131..6b7c772 100644
--- a/src/starknet-wrappers.ts
+++ b/src/starknet-wrappers.ts
@@ -138,7 +138,7 @@ export abstract class StarknetWrapper {
         if (options.wallet) {
             prepared.push("--wallet", options.wallet);
             prepared.push("--network_id", options.networkID);
-            prepared.push("--chain_id", options.chainID);
+            prepared.push("--chain_id", process.env.STARKNET_CHAIN_ID || "SN_GOERLI");
 
             if (options.account) {
                 prepared.push("--account", options.account);
```


### Other helpful debugging tips


* After transaction is submitted, you can query using the following command

```
starknet tx_status --hash "0xef8ab18795479e49850d53900185cf815f19d7e33d24034b3a5fb9d3b3fb24" --gateway_url htt
p://localhost:5000  --feeder_gateway_url http://localhost:5000
{
    "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000018",
    "tx_status": "ACCEPTED_ON_L2"
}
```

* When we tried invoking the cairo tooling directly, we ran into recursion limit errors a lot and used a container 

```
docker run --network host -v $PWD:/app -it shardlabs/cairo-cli:0.8.1
```

* this applied to other tools like [nile](https://github.com/OpenZeppelin/nile) and starknet cli tools too

* Updates on the UI can only happen at 5 second interval, so you don't get instant update in the counter project

## Resources

[Practical StarkNet lessons learned](https://hackmd.io/@RoboTeddy/BJZFu56wF)