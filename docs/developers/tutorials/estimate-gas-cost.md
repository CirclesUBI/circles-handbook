---
id: estimate-gas-cost
title: Exploring transfer steps and estimating the gas cost
slug: /developers/tutorials/estimate-gas-cost
---
_Author: Louise Linné 2021-05-06_

This tutorial is made for finding the transfer steps that the circles api would chose to make a **hypothetical transitive transaction**. It also explains how to find the estimated gas cost.

### To find the transfer steps you will need:
- A circles account with enough circles
- The checksummed* safe address of that account (you can find it in your circles wallet under Settings as "Profile address") 
- The checksummed* address of another account you want to transfer to

### To estimate the gas cost you will also need:
- A Metamask account connected to the first circles account
    - You can follow [this guide](gnosis-safe-as-wallet.mdx)
    - [Switch from Ethereum mainnet to the Gnosis Chain network](https://docs.gnosischain.com/tools/wallets/metamask/). To add Gnosis Chain chose "Add Network" under "Networks" and specify the following:
        - name: Gnosis
        - URL: https://rpc.gnosischain.com
        - Chain ID: 100
        - Symbol: xDai
        - Block Explorer URL: https://gnosisscan.io

*A checksummed address will contain some capital letters unlike the non-checksummed address.

### Steps

1. **Decide on a transfer:** 
    - from whom (use an account you have access to)
    - to whom
    - how many circles

    
2. **Find the transfer steps** 

Run this command in the terminal with your specified data
```shell=fish
curl -H "Content-Type: application/json" -X POST -d '{"from":"<FROM_ADDRESS>","to":"<TO_ADDRESS>","value":"<AMOUNT OF CIRCLES IN WEI>"}' https://api.circles.garden/api/transfers
```
An example:

```shell=fish
curl -H "Content-Type: application/json" -X POST -d '{"from":"0x0B900CBbc0e6bc4edc12f56360C8bC141eD1cc1b","to":"0x6dd9EEAb489b59bdd57a59694bEe653feCE987b6","value":"100000000000000000000"}' https://api.circles.garden/api/transfers
```
This is what the [circles.garden](https://circles.garden/) wallet calls to find out how much you can send to an account when doing a transaction through the app.
It uses a large amount of circles to get the maximum amount:
1 000 000 000 000 000 000 000 000 000 000 000 Wei = 1 trillion circles. (1 Circle is 1 000 000 000 000 000 000 Wei)

The result will look something like this:
```json
{
    "status":"ok",
    "data":
    {
        "from":"...","
        to":"...",
        "maxFlowValue":"...",
        "processDuration":...,
        "transferValue":"...",
        "transferSteps":
        [
            {"from":"...","step":0,"to":"...","value":"...","tokenOwnerAddress":"..."},
            {"from":"...","step":1,"to":"...","value":"...","tokenOwnerAddress":"..."}
        ]
    }
}
```

3. **Extract data arrays specifying the transfers**

Use a script like this to extract arrays of `token owners`, `to`, `from` and `values`:

```javascript
const transfers = require('./transfer.json');

const tokenOwnerAddresses = [];
const srcs = [];
const dests = [];
const amounts = [];

transfers.data.transferSteps.forEach(transfer =>{
    tokenOwnerAddresses.push(transfer.tokenOwnerAddress);
    srcs.push(transfer.from);
    dests.push(transfer.to);
    amounts.push(transfer.value);
});

console.log(JSON.stringify(tokenOwnerAddresses));
console.log(tokenOwnerAddressestoString());
console.log(JSON.stringify(srcs));
console.log(JSON.stringify(dests));
console.log(JSON.stringify(amounts));
```
Then make sure there are no quotations in the elements list.

4. **Get the hex data for the transaction**

Now that you have the lists of `tokenOwnerAddresses`, `srcs`, `dests` and `amounts`, go to [the circles Hub on blockscout](https://gnosisscan.io/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543#writeContract). 
In the "Write Contract" tab:
- connect to your metamask account
- use "3.transferThrough" and paste the value arrays from above
- click "write"
- Metamask will open, switch to the data tab and copy the hex data

5. **Get the gas estimates from the circles api**

Running this curl command (it needs the checksummed safe address, which you can find it in your circles wallet and the hex data)

```shell=fish
curl -X POST "https://relay.circles.garden/api/v2/safes/<SAFE_ADDRESS>/transactions/estimate/" -H  "Content-Type: application/json" -H  "accept: application/json" -d '{ "safe": "<SAFE_ADDRESS>", "data": "<HEX_DATA>", "to": "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543", "value": 0, "operation": 0, "gasToken": "0x0000000000000000000000000000000000000000" }'
```
returns the gas information like this:
```json
{
  "safeTxGas": "4064004",
  "baseGas": "95328",
  "dataGas": "95328",
  "operationalGas": "0",
  "gasPrice": "1000000000",
  "lastUsedNonce": 30,
  "gasToken": "0x0000000000000000000000000000000000000000",
  "refundReceiver": "0x0739a8D036c966aC9161Ea14855CE0f94C15B87b"
}
```

The total gas is `safeTxGas + baseGas`. In the example above, the total gas is then `4.159.332` (which is under the gas per block limit).

The [gas limit per block changes over time](https://gnosisscan.io/chart/gaslimit) and currently it's `30.000.000`. The [gas price](https://gnosisscan.io/chart/gasprice) is specified in Gwei and it fluctuates over time in Gnosis Chain (average is around 7 Gwei).
