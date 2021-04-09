---
id: circles-by-sbt-ethereum
title: Circles by hand with sbt-ethereum
slug: /developers/tutorials/circles-by-hand-with-sbt-ethereum
---

_Author: Steve Randy Waldman 2021-03-23_

Here we’ll go through the exercise of creating a _Circles_ identity by hand with sbt-ethereum.

## The web-app is weird

Our command-line adventure will be **very, very** different from the experience the _Circles_ web application encourages of users. (See https://joincircles.net/ and https://circles.garden/.) The UI works to hide or abstract nearly all the details of working with an _Ethereum_-ish blockchain application. Users via the web UI don’t use a browser-based crypto wallet like _Metamask_. Instead, they sign up as for a Web 2.0 application with an e-mail address and username. A private key is then generated for the user, presented as a [BIP-39-style](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) list of words.

An address — the user’s identity — is also defined for each user, but that address is not the same address as that for which the private key was generated. Instead it is as address to which a [Gnosis Safe](https://gnosis-safe.io/) contract (or really a proxy thereof) can eventually be deployed via the EVM [`CREATE2`](https://eips.ethereum.org/EIPS/eip-1014) opcode. eventually. Eventually.

But, because in the web application _Circles_ (or [Gnosis](https://gnosis.io/), or someone) is handling the gas costs for user transactions, it had to be built with a degree of caution. If any signup provoked smart contract creations or transactions, miscreants could force arbitrary expenses on the payer just by spoofing new users. To prevent this, the _Circles_ requires new users to become trusted by at least three existing users before their identity (the [Gnosis Safe](https://gnosis-safe.io/) proxy) is actually materialized on the blockchain, along with their own ERC-20 token (the [“me-coin”](https://www.sbt-ethereum.io/blog/2021/03/14/Circles-with-sbt-ethereum.html)) in which they’ll receive their UBI.

## Circles contracts

Behind the _Circles_ application sits three contracts on the [xDAI blockchain](https://blockscout.com/poa/xdai). Pretty much the only place I found the addresses of these contracts documented is in [this tweet](https://twitter.com/CirclesUBI/status/1317089774293962753). The three contracts are…

1. The Hub @ [`0x29b9a7fBb8995b2423a71cC17cf9810798F6C543`](https://blockscout.com/xdai/mainnet/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/transactions): This is the core of the _Circles_ application, the smart contract that tracks identities and trust relationships, and that launches token contracts for each _Circles_ identity. We will interact with this contract. (We’ve reproduced its full source code as an [appendix](https://www.sbt-ethereum.io/blog/2021/03/23/Circles-with-sbt-ethereum-II-Circles-by-hand-redux.html#Appendix-Circles-hub-source-code) to this post.)
2. The Proxy Factory @ [`0x8b4404DE0CaECE4b966a9959f134f0eFDa636156`](https://blockscout.com/xdai/mainnet/address/0x8b4404DE0CaECE4b966a9959f134f0eFDa636156/transactions): This contract is invoked by the middleware / web-UI to create proxy [Gnosis Safe](https://gnosis-safe.io/) contracts, representing user identities.
3. The Master Gnosis Safe @ [`0x2CB0ebc503dE87CFD8f0eCEED8197bF7850184ae`](https://blockscout.com/xdai/mainnet/address/0x2CB0ebc503dE87CFD8f0eCEED8197bF7850184ae/transactions): Identities are efficiently implemented as tiny proxies to a [Gnosis Safe](https://gnosis-safe.io/) implementation, and this is that implementation. Operations on the contracts that represent users happen via `DELEGATECALL` to this master implementation.

***Note:*** _When I first examined [the hub on the xDAI block explorer](https://blockscout.com/xdai/mainnet/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/transactions), I thought it must be misidentified. Transactions involving it seemed too few and infrequent. But that’s not right. Since nearly all activity involving the hub is initiated by a user identity, which are nearly all [Gnosis Safe](https://gnosis-safe.io/) contracts, the calls to hub methods are treated as [internal transactions](https://blockscout.com/poa/xdai/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/internal-transactions), of which there are plenty._

## Circles by hand

If you want to play along, you’ll need to have set up your sbt-ethereum environment to work on the xDAI blockchain. Please see previous posts [to get started on xDAI](https://www.sbt-ethereum.io/blog/2021/02/19/Getting-started-on-the-xDAI-chain-with-sbt-ethereum.html), and [to give yourself some xDAI to fund transactions](https://www.sbt-ethereum.io/blog/2021/02/20/Converting-DAI-to-xDAI-with-sbt-ethereum.html).

Since you’re too lazy to review those posts (I would be!), I’ll work from an empty sbt-ethereum shoebox (by using the setting [`ethcfgShoeboxDirectory`](https://www.sbt-ethereum.io/settings/index.html#ethcfgshoeboxdirectory) in my `build.sbt` file, so my main shoebox is not used). _But if you are following along, and you want to make a Circles identity you will keep, don’t do this!_. Use your default shoebox directory, so that your identity is permanently available by default. You should be able to follow along with every step, except the part about having someone send you some xDAI so you can run transactions. You’ll have to find a friend, try the [semi-abandoned faucet](https://www.xdaichain.com/for-users/get-xdai-tokens/xdai-faucet), or [use the DAI-to-xDAI bridge yourself](https://www.sbt-ethereum.io/blog/2021/02/20/Converting-DAI-to-xDAI-with-sbt-ethereum.html). (Feel free to [hit me up](mailto:swaldman@mchange.com) for the few cents you’ll need.)

Let’s get started! I’ll assume you have [_sbt-ethereum‘s_ prerequisites](https://www.sbt-ethereum.io/appendix/prerequisites.html), _sbt_ and a JVM, on your machine already.

### Create a new project

Through the terminal we can create a project as shown below. When prompted for a project name I choose `circles-tutorial`. Then change into the new project directory.

```
$ sbt new swaldman/solidity-seed.g8
[info] Loading settings for project global-plugins from dependency-graph.sbt,metals.sbt,gpg.sbt ...
[info] Loading global plugins from /Users/swaldman/.sbt/1.0/plugins
[warn] There may be incompatibilities among your library dependencies; run 'evicted' to see detailed eviction warnings.
[info] Loading project definition from /Users/swaldman/project
[warn] There may be incompatibilities among your library dependencies; run 'evicted' to see detailed eviction warnings.
[info] Set current project to swaldman (in build file:/Users/swaldman/)
[info] Set current project to swaldman (in build file:/Users/swaldman/)

A minimal solidity project for sbt-ethereum 

name [my-solidity-project]: circles-tutorial
version [0.0.1-SNAPSHOT]: 
sbt_ethereum_version [0.5.3]: 
sbt_version [1.3.13]: 

Template applied in /Users/swaldman/./circles-tutorial

$ cd circles-tutorial/
```

### Check out build.sbt

It looks like this:

```
name := "circles-tutorial"

version := "0.0.1-SNAPSHOT"
```

Because I [already have a _Circles_ identity](https://www.sbt-ethereum.io/blog/2021/03/14/Circles-with-sbt-ethereum.html), I don’t want to create a new one in my default [_sbt-ethereum_ shoebox](https://www.sbt-ethereum.io/tasks/eth/shoebox/index.html). So I’ll edit my `build.sbt` to use an empty, throwaway shoebox. **You probably don’t want to do this! You should make your own identity to keep, in your default _sbt-ethereum_ shoebox!**

Since we’ll be working on the xDAI chain (chain ID 100), we’ll also make that the default chain for this project. That’s only a convenience. We can always switch to xDAI by typing `ethNodeChainIdOverride 100`.

Anyway, here’s my edited `build.sbt`:
```
name := "circles-tutorial" 

version := "0.0.1-SNAPSHOT"                    

ethcfgNodeChainId := 100 // you probably want this 

ethcfgShoeboxDirectory := "throwaway-shoebox" // you probably DON'T want this! keep your work
```

### Startup sbt-ethereum

From inside the `circles-tutorial` directory…

```
$ sbt
[info] welcome to sbt 1.3.13 (Oracle Corporation Java 11.0.3)
[info] loading settings for project global-plugins from dependency-graph.sbt,metals.sbt,gpg.sbt ...
[info] loading global plugins from /Users/swaldman/.sbt/1.0/plugins
[warn] There may be incompatibilities among your library dependencies; run 'evicted' to see detailed eviction warnings.
[info] loading settings for project circles-tutorial-build-build from security.sbt ...
[info] loading project definition from /Users/swaldman/circles-tutorial/project/project
[warn] There may be incompatibilities among your library dependencies; run 'evicted' to see detailed eviction warnings.
[info] loading settings for project circles-tutorial-build from security.sbt,plugins.sbt ...
[info] loading project definition from /Users/swaldman/circles-tutorial/project
[warn] There may be incompatibilities among your library dependencies; run 'evicted' to see detailed eviction warnings.
Mar 20, 2021 9:12:54 PM com.mchange.v2.log.MLog 
INFO: MLog clients using java 1.4+ standard logging with redirectable loggers.
[info] loading settings for project circles-tutorial from build.sbt ...
[info] set current project to circles-tutorial (in build file:/Users/swaldman/circles-tutorial/)
There are no wallets in the sbt-ethereum keystore. Would you like to generate one? [y/n] n
[warn] No wallet created. To create one, try 'ethKeystoreWalletV3Create', 'ethKeystoreFromJsonImport', or 'ethKeystoreFromPrivateKeyImport'.
The current default solidity compiler ['0.7.6'] is not installed. Install? [y/n] n
[info] Updating available solidity compiler set.
[info] sbt-ethereum-0.5.3 successfully initialized (built Thu, 18 Mar 2021 19:46:19 -0400)
[info]  + shoebox directory: '/Users/swaldman/circles-tutorial/throwaway-shoebox'
sbt:circles-tutorial> 
```

Because I’m using a fresh, empty shoebox, sbt-ethereum asked if I wanted to generate a wallet address or download a solidity compiler. We will want to generate a wallet address, but we’ll do it explicitly, since readers may not be prompted to create one on startup. Let’s do that!

## Create a wallet for our Circles identity

We’ll use the task [`ethKeystoreWalletV3Create`](https://www.sbt-ethereum.io/blog/2021/03/23/ethKeystoreWalletV3Create). I’m going to call this identity “circles-snoopy”, because it ain’t me babe! It’s just a throwaway identity for this tutorial. If you are making an identity to keep, you might use your own name rather than “snoopy”.

```
sbt:circles-tutorial> ethKeystoreWalletV3Create
[info] Generated keypair for address '0xB157256Af409007d903B443349bf49A9D6a1f519'
[info] Generating V3 wallet, algorithm=scrypt, n=262144, r=8, p=1, dklen=32
Enter passphrase for new wallet: ************************
Please retype to confirm: ************************
[info] Wallet generated into sbt-ethereum shoebox: 'throwaway-shoebox'. Please backup, via 'ethShoeboxBackup' or manually.
[info] Consider validating the wallet using 'ethKeystoreWalletV3Validate 0xB157256Af409007d903B443349bf49A9D6a1f519'.
Would you like to define an alias for address '0xB157256Af409007d903B443349bf49A9D6a1f519' (on chain with ID 100)? [y/n] y
Please enter an alias for address '0xB157256Af409007d903B443349bf49A9D6a1f519' (on chain with ID 100): circles-snoopy
[info] Alias 'circles-snoopy' now points to address '0xB157256Af409007d903B443349bf49A9D6a1f519' (for chain with ID 100).
[info] Refreshing caches.
[success] Total time: 104 s (01:44), completed Mar 20, 2021, 9:23:27 PM
```

_Note: Scroll right to see the part where we entered in the alias circles-snoopy._

Cool.

## Prepare to work with the Circles hub

_Circles‘_ core contract is the hub, which is on the xDAI chain at address `0x29b9a7fBb8995b2423a71cC17cf9810798F6C543`. Let’s use [`ethAddressAliasSet`](https://www.sbt-ethereum.io/tasks/eth/address/alias.html#ethaddressaliasset) to give that an alias:

```
sbt:circles-tutorial> ethAddressAliasSet circles-hub 0x29b9a7fBb8995b2423a71cC17cf9810798F6C543
[info] Alias 'circles-hub' now points to address '0x29b9a7fBb8995b2423a71cC17cf9810798F6C543' (for chain with ID 100).
[info] Refreshing caches.
[success] Total time: 0 s, completed Mar 20, 2021, 9:30:46 PM
```

Notice that address aliased are scoped to the Chain ID. Make sure that your output includes the `for chain with ID 100`, the xDAI chain. If you are on the wrong chain, you can drop the alias with [`ethAddressAliasDrop`](https://www.sbt-ethereum.io/tasks/eth/address/alias.html#ethaddressaliasdrop), switch to the xDAI chain with `ethNodeChainIdOverride 100`, and rerun the command.

Before we can interact with `circles-hub` we’ll need to import its ABI. When we’re working on the Ethereum main chain, we can often [automatically import ABIs from Etherscan](https://www.sbt-ethereum.io/tutorials/using-a-smart-contract-i.html#automatically-acquiring-an-abi-from-optional-). We can’t do that for contracts on the xDAI blockchain. Instead, we browse the xDAI Blockscout to find the [verified contract ABI](https://blockscout.com/poa/xdai/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/contracts), and let _sbt-ethereum_ scrape the from the page (a new sbt-ethereum 0.5.3 feature!):

```
sbt:circles-tutorial> ethContractAbiImport circles-hub
[error] stack trace is suppressed; run last Compile / xethInvokerContext for the full output
[error] (Compile / xethInvokerContext) com.mchange.sc.v1.sbtethereum.package$InvokerContextNotAvailableException: Could not instantiate an Invoker context. Please ensure that you have a node URL defined for the current chain ID. Try 'eth'.
[error] Total time: 0 s, completed Mar 20, 2021, 9:44:22 PM
```

Oopsie! The important bit there was `Please ensure that you have a node URL defined for the current chain ID. Try 'eth'.`

Since I’m working with a fresh environment (shoebox) that has never interacted with the xDAI chain, I need to define the URL to a node’s JSON-RPC service! Let’s do that:

```
sbt:circles-tutorial> ethNodeUrlDefaultSet https://rpc.xdaichain.com/
[info] Successfully set default node json-rpc URL for chain with ID 100 to https://rpc.xdaichain.com/.
[success] Total time: 0 s, completed Mar 20, 2021, 9:48:14 PM
```

Cool. Our error suggested we type [`eth`](https://www.sbt-ethereum.io/tasks/eth/index.html) to check out our environment. Let’s do that.

```
sbt:circles-tutorial> eth
[info] The session is now active on chain with ID 100, with node URL 'https://rpc.xdaichain.com/'.
[warn] There is no sender available for the current session.
[warn] Consider using 'ethAddressSenderDefaultSet' or 'ethAddressSenderOverrideSet' to define one.
[info] The current default gas price according to your node is 1 gwei. (THIS MAY CHANGE AT ANY TIME.)
[success] Total time: 0 s, completed Mar 20, 2021, 9:51:26 PM
```

We’re advised to set a sender for our session. Let’s do that to. In my case, working from a fresh environment, I’ll just make `circles-snoopy` the default sender with [`ethAddressSenderDefaultSet`](https://www.sbt-ethereum.io/tasks/eth/address/sender.html#ethaddresssenderdefaultset). If you already have a default sender set-up for xDAI, and want to keep it, you can temporarily override it for this session with either [`ethAddressSenderOverrideSet`](https://www.sbt-ethereum.io/tasks/eth/address/sender.html#ethaddresssenderoverrideset) or [`ethAddressSenderOverride`)(https://www.sbt-ethereum.io/tasks/eth/address/sender.html#ethaddresssenderoverride). (The two are synonyms.) Anyway, you do you. Here’s me:

```
sbt:circles-tutorial> ethAddressSenderDefaultSet circles-snoopy
[info] Successfully set default sender address for chain with ID 100 to '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100).
[info] You can use the synthetic alias 'default-sender' to refer to this address.
[info] Refreshing caches.
[success] Total time: 0 s, completed Mar 20, 2021, 9:55:47 PM
```

Let’s check out our environment again with [`eth`](https://www.sbt-ethereum.io/tasks/eth/index.html):

```
sbt:circles-tutorial> eth
[info] The session is now active on chain with ID 100, with node URL 'https://rpc.xdaichain.com/'.
[info] The current session sender is '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100).
[info] The current default gas price according to your node is 2 gwei. (THIS MAY CHANGE AT ANY TIME.)
[success] Total time: 0 s, completed Mar 20, 2021, 9:58:17 PM
```

Okay. Anyway, let’s try importing the contract ABI again. Remember, we can find the ABI embedded in the URL https://blockscout.com/poa/xdai/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/contracts

Importing the ABI will be very little work, but will yield a ***very*** long output. You can expand below to view it!

```
sbt:circles-tutorial> ethContractAbiImport circles-hub
To import an ABI, you may provide the JSON ABI directly, or else a file path or URL from which the ABI can be downloaded.
Contract ABI or Source: https://blockscout.com/poa/xdai/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/contracts
[info] Attempting to interactively import a contract ABI.
[info] Checking to see if you have provided a JSON array or object directly.
[info] The provided text does not appear to be a JSON ABI.
[info] Checking if the provided source exists as a File.
[info] No file found. Checking if the provided source is interpretable as a URL.
[info] Interpreted user-provided source as a URL. Attempting to fetch contents.
We can attempt to SCRAPE a unique ABI from the text of the provided source.
Be sure you trust 'https://blockscout.com/poa/xdai/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/contracts' to contain a reliable representation of the ABI.
Scrape for the ABI? [y/n] y
[info] No ABI was discovered in the raw bytes downloaded from 'https://blockscout.com/poa/xdai/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/contracts'.ircles-tutorial / Compile / ethContractAbiImport 0s
[info] Retrying, after unescaping as HTML.
[info] We had to scrape, but we were able to recover a unique ABI from source 'https://blockscout.com/poa/xdai/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/contracts'!
Ready to import the following ABI:
```
<details><summary><i>Show ABI</i></summary>
<div>

```
[ {
  "type" : "constructor",
  "stateMutability" : "nonpayable",
  "inputs" : [ {
    "type" : "uint256", / Compile / ethContractAbiImport 0s
    "name" : "_inflation",
    "internalType" : "uint256"
  }, {
    "type" : "uint256",
    "name" : "_period",
    "internalType" : "uint256"
  }, {
    "type" : "string",
    "name" : "_symbol",
    "internalType" : "string"
  }, {
    "type" : "string",
    "name" : "_name",
    "internalType" : "string"
  }, {
    "type" : "uint256",
    "name" : "_signupBonus",
    "internalType" : "uint256"
  }, {
    "type" : "uint256",
    "name" : "_initialIssuance",
    "internalType" : "uint256"
  }, {
    "type" : "uint256",
    "name" : "_timeout",
    "internalType" : "uint256"
  } ]
}, {
  "type" : "event",
  "name" : "HubTransfer",
  "inputs" : [ {
    "type" : "address",
    "name" : "from",
    "internalType" : "address",
    "indexed" : true
  }, {
    "type" : "address",
    "name" : "to",
    "internalType" : "address",
    "indexed" : true
  }, {
    "type" : "uint256",
    "name" : "amount",
    "internalType" : "uint256",
    "indexed" : false
  } ],
  "anonymous" : false
}, {
  "type" : "event",
  "name" : "OrganizationSignup",
  "inputs" : [ {
    "type" : "address",
    "name" : "organization",
    "internalType" : "address",
    "indexed" : true
  } ],
  "anonymous" : false
}, {
  "type" : "event",
  "name" : "Signup",
  "inputs" : [ {
    "type" : "address",
    "name" : "user",
    "internalType" : "address",
    "indexed" : true
  }, {
    "type" : "address",
    "name" : "token",
    "internalType" : "address",
    "indexed" : false
  } ],
  "anonymous" : false
}, {
  "type" : "event",
  "name" : "Trust",
  "inputs" : [ {
    "type" : "address",
    "name" : "canSendTo",
    "internalType" : "address",
    "indexed" : true
  }, {
    "type" : "address",
    "name" : "user",
    "internalType" : "address",
    "indexed" : true
  }, {
    "type" : "uint256",
    "name" : "limit",
    "internalType" : "uint256",
    "indexed" : false
  } ],
  "anonymous" : false
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "checkSendLimit",
  "inputs" : [ {
    "type" : "address",
    "name" : "tokenOwner",
    "internalType" : "address"
  }, {
    "type" : "address",
    "name" : "src",
    "internalType" : "address"
  }, {
    "type" : "address",
    "name" : "dest",
    "internalType" : "address"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "deployedAt",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "divisor",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "inflate",
  "inputs" : [ {
    "type" : "uint256",
    "name" : "_initial",
    "internalType" : "uint256"
  }, {
    "type" : "uint256",
    "name" : "_periods",
    "internalType" : "uint256"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "inflation",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "initialIssuance",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "issuance",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "issuanceByStep",
  "inputs" : [ {
    "type" : "uint256",
    "name" : "_periods",
    "internalType" : "uint256"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "limits",
  "inputs" : [ {
    "type" : "address",
    "name" : "",
    "internalType" : "address"
  }, {
    "type" : "address",
    "name" : "",
    "internalType" : "address"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "string",
    "name" : "",
    "internalType" : "string"
  } ],
  "name" : "name",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "nonpayable",
  "outputs" : [ ],
  "name" : "organizationSignup",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "bool",
    "name" : "",
    "internalType" : "bool"
  } ],
  "name" : "organizations",
  "inputs" : [ {
    "type" : "address",
    "name" : "",
    "internalType" : "address"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "period",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "periods",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "pure",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "pow",
  "inputs" : [ {
    "type" : "uint256",
    "name" : "base",
    "internalType" : "uint256"
  }, {
    "type" : "uint256",
    "name" : "exponent",
    "internalType" : "uint256"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "address",
    "name" : "",
    "internalType" : "address"
  } ],
  "name" : "seen",
  "inputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "nonpayable",
  "outputs" : [ ],
  "name" : "signup",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "signupBonus",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "string",
    "name" : "",
    "internalType" : "string"
  } ],
  "name" : "symbol",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "uint256",
    "name" : "",
    "internalType" : "uint256"
  } ],
  "name" : "timeout",
  "inputs" : [ ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "address",
    "name" : "",
    "internalType" : "address"
  } ],
  "name" : "tokenToUser",
  "inputs" : [ {
    "type" : "address",
    "name" : "",
    "internalType" : "address"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "nonpayable",
  "outputs" : [ ],
  "name" : "transferThrough",
  "inputs" : [ {
    "type" : "address[]",
    "name" : "tokenOwners",
    "internalType" : "address[]"
  }, {
    "type" : "address[]",
    "name" : "srcs",
    "internalType" : "address[]"
  }, {
    "type" : "address[]",
    "name" : "dests",
    "internalType" : "address[]"
  }, {
    "type" : "uint256[]",
    "name" : "wads",
    "internalType" : "uint256[]"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "nonpayable",
  "outputs" : [ ],
  "name" : "trust",
  "inputs" : [ {
    "type" : "address",
    "name" : "user",
    "internalType" : "address"
  }, {
    "type" : "uint256",
    "name" : "limit",
    "internalType" : "uint256"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "address",
    "name" : "",
    "internalType" : "contract Token"
  } ],
  "name" : "userToToken",
  "inputs" : [ {
    "type" : "address",
    "name" : "",
    "internalType" : "address"
  } ]
}, {
  "type" : "function",
  "stateMutability" : "view",
  "outputs" : [ {
    "type" : "bool",
    "name" : "seen",
    "internalType" : "bool"
  }, {
    "type" : "uint256",
    "name" : "sent",
    "internalType" : "uint256"
  }, {
    "type" : "uint256",
    "name" : "received",
    "internalType" : "uint256"
  } ],
  "name" : "validation",
  "inputs" : [ {
    "type" : "address",
    "name" : "",
    "internalType" : "address"
  } ]
} ]
```

</div>
</details>

```
Do you wish to import this ABi? [y/n] y
[info] A default ABI is now known for the contract at address 0x29b9a7fBb8995b2423a71cC17cf9810798F6C543
[info] Refreshing caches.
[success] Total time: 111 s (01:51), completed Mar 20, 2021, 10:05:27 PM
```

Looks good. Let’s see if we can read stuff from the contract.

```
sbt:circles-tutorial> ethTransactionView circles-hub <tab>
checkSendLimit    deployedAt        divisor           inflate           inflation         initialIssuance   issuance          issuanceByStep    
limits            name              organizations     period            periods           pow               seen              signupBonus       
symbol            timeout           tokenToUser       userToToken       validation        ​                  
sbt:circles-tutorial> ethTransactionView circles-hub period
[info] The function 'period' yields 1 result.
[info]  + Result 1 of type 'uint256' is 31556952
[success] Total time: 0 s, completed Mar 20, 2021, 10:08:17 PM
```

Yes we can!

## Fund our Circles identity

This is the part that will require a bit of help from outside this tutorial. Our new identity (`circles-snoopy` in my case) will want to call the `signup` method on the _Circles_ hub. But we can’t call methods that modify the blockchain unless we have “ether” (xDAI on the xDAI chain) with which to pay for gas. First, let’s checkout our identity’s current balance:

```
sbt:circles-tutorial> ethAddressBalance circles-snoopy
0 ether (as of the latest incorporated block, address 0xB157256Af409007d903B443349bf49A9D6a1f519)
(The USD value of this is unknown, no exchange value is currently available for chain with ID 100 from Coinbase.)
[success] Total time: 0 s, completed Mar 20, 2021, 10:13:27 PM
```

We’re broke. So now we’ll have to find a friend, try the [semi-abandoned faucet](https://www.xdaichain.com/for-users/get-xdai-tokens/xdai-faucet), or [use the DAI-to-xDAI bridge to get some funds](https://www.sbt-ethereum.io/blog/2021/02/20/Converting-DAI-to-xDAI-with-sbt-ethereum.html). Feel free to [hit me up](mailto:swaldman@mchange.com) for the few cents you’ll need. I’ll send myself a few cents worth of xDAI from elsewhere, then recheck my balance.

```
sbt:circles-tutorial> ethAddressBalance circles-snoopy
0.1 ether (as of the latest incorporated block, address 0xB157256Af409007d903B443349bf49A9D6a1f519)
(The USD value of this is unknown, no exchange value is currently available for chain with ID 100 from Coinbase.)
[success] Total time: 0 s, completed Mar 20, 2021, 10:18:15 PM
```

We have ca$h!

## Sign up for Circles as our new identity

Now that ```circles-snoopy``` is funded we can sign up. We’ve already made this address our default sender, but you may not have, so let’s make sure that account our session sender using [`ethAddressSenderOverride`](https://www.sbt-ethereum.io/tasks/eth/address/sender.html#ethaddresssenderoverride):

```
sbt:circles-tutorial> ethAddressSenderOverride circles-snoopy
[info] Sender override set to '0xB157256Af409007d903B443349bf49A9D6a1f519' (on chain with ID 100, aliases ['circles-snoopy','default-sender'])).
[success] Total time: 0 s, completed Mar 20, 2021, 10:23:21 PM
```

Okay. Now let’s sign up with the hub.

```
sbt:circles-tutorial> ethTransactionInvoke circles-hub signup

==> T R A N S A C T I O N   S I G N A T U R E   R E Q U E S T
==>
==> The transaction would be a message with...
==>   To:    0x29b9a7fBb8995b2423a71cC17cf9810798F6C543 (with aliases ['circles-hub'] on chain with ID 100)
==>   From:  0xB157256Af409007d903B443349bf49A9D6a1f519 (with aliases ['circles-snoopy','default-sender'] on chain with ID 100)
==>   Data:  0xb7bc0f73 / Compile / ethTransactionInvoke 0s
==>   Value: 0 ether
==>
==> According to the ABI currently associated with the 'to' address, this message would amount to the following method call...
==>   Function called: signup()
==>
==> The nonce of the transaction would be 0.
==>
==> $$$ The transaction you have requested could use up to 1497631 units of gas.
==> $$$ You would pay 20 gwei for each unit of gas, for a maximum cost of 0.02995262 ether.
==> $$$ (No USD value could be determined for ETH on chain with ID 100 from Coinbase).

Would you like to sign this transaction? [y/n] y

[info] Unlocking address '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100).
Enter passphrase or hex private key for address '0xB157256Af409007d903B443349bf49A9D6a1f519': ************************
[info] Called function 'signup', with args '', sending 0 wei to address '0x29b9a7fBb8995b2423a71cC17cf9810798F6C543' in transaction with hash '0x0ed96eff6caeeb3c92896bfd77165b2ad5349b91e5b6126c1baf7baf3a208451'.
[info] Waiting for the transaction to be mined (will wait up to 5 minutes).
[error] stack trace is suppressed; run last Compile / ethTransactionInvoke for the full output
[error] (Compile / ethTransactionInvoke) com.mchange.sc.v1.consuela.ethereum.jsonrpc.package$ClientException: Block information is incomplete while ancient block sync is still in progress, before it's finished we can't determine the existence of requested item. -- errorCode=-32000; methodName=eth_getTransactionReceipt; params=List("0x0ed96eff6caeeb3c92896bfd77165b2ad5349b91e5b6126c1baf7baf3a208451")
[error] Total time: 26 s, completed Mar 20, 2021, 10:25:03 PM
```

Uh-oh. Some weird shit happened there. We successfully submitted the transaction, but while we were waiting for a transaction receipt to prove it had been mined, [some Parity/openethereum-client thing went wrong](https://github.com/openethereum/parity-ethereum/issues/10777). We have the transaction hash, `0x0ed96eff6caeeb3c92896bfd77165b2ad5349b91e5b6126c1baf7baf3a208451`. (Scroll all the way to the right to see it.) We can manually check for the transaction receipt to see how our signup attempt turned out using [`ethTransactionLookup`](https://github.com/openethereum/parity-ethereum/issues/10777):

```
sbt:circles-tutorial> ethTransactionLookup 0x0ed96eff6caeeb3c92896bfd77165b2ad5349b91e5b6126c1baf7baf3a208451
[info] Looking up transaction '0x0ed96eff6caeeb3c92896bfd77165b2ad5349b91e5b6126c1baf7baf3a208451' (will wait up to 5 minutes).
[info] Transaction Receipt:
[info]        Transaction Hash:    0x0ed96eff6caeeb3c92896bfd77165b2ad5349b91e5b6126c1baf7baf3a208451
[info]        Transaction Index:   3
[info]        Transaction Status:  SUCCEEDED
[info]        Block Hash:          0xf8d6258f8a889981818eff16d8a88acd0fa03973c7e396f08b35edf1be9e62e2
[info]        Block Number:        15117319
[info]        From:                0xB157256Af409007d903B443349bf49A9D6a1f519
[info]        To:                  0x29b9a7fBb8995b2423a71cC17cf9810798F6C543
[info]        Cumulative Gas Used: 2901510
[info]        Gas Used:            1227346
[info]        Contract Address:    None
[info]        Logs:                0 => EthLogEntry [source=0xf910549FdbA1083B7E515029601e8Bc748774C64] (
[info]                                    topics=[
[info]                                      0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef,
[info]                                      0x0000000000000000000000000000000000000000000000000000000000000000,
[info]                                      0x000000000000000000000000b157256af409007d903b443349bf49a9d6a1f519
[info]                                    ],
[info]                                    data=000000000000000000000000000000000000000000000002b5e3af16b1880000
[info]                                  ),
[info]                             1 => EthLogEntry [source=0x29b9a7fBb8995b2423a71cC17cf9810798F6C543] (
[info]                                    topics=[
[info]                                      0xe60c754dd8ab0b1b5fccba257d6ebcd7d09e360ab7dd7a6e58198ca1f57cdcec,
[info]                                      0x000000000000000000000000b157256af409007d903b443349bf49a9d6a1f519,
[info]                                      0x000000000000000000000000b157256af409007d903b443349bf49a9d6a1f519
[info]                                    ],
[info]                                    data=0000000000000000000000000000000000000000000000000000000000000064
[info]                                  ),
[info]                             2 => EthLogEntry [source=0x29b9a7fBb8995b2423a71cC17cf9810798F6C543] (
[info]                                    topics=[
[info]                                      0x358ba8f768af134eb5af120e9a61dc1ef29b29f597f047b555fc3675064a0342,
[info]                                      0x000000000000000000000000b157256af409007d903b443349bf49a9d6a1f519
[info]                                    ],
[info]                                    data=000000000000000000000000f910549fdba1083b7e515029601e8bc748774c64
[info]                                  )
[info]        Events:              0 => Anonymous Event [source=0xf910549FdbA1083B7E515029601e8Bc748774C64],
[info]                             1 => Trust [source=0x29b9a7fBb8995b2423a71cC17cf9810798F6C543] (
[info]                                    canSendTo (of type address): 0xB157256Af409007d903B443349bf49A9D6a1f519,
[info]                                    user (of type address): 0xB157256Af409007d903B443349bf49A9D6a1f519,
[info]                                    limit (of type uint256): 100
[info]                                  ),
[info]                             2 => Signup [source=0x29b9a7fBb8995b2423a71cC17cf9810798F6C543] (
[info]                                    user (of type address): 0xB157256Af409007d903B443349bf49A9D6a1f519,
[info]                                    token (of type address): 0xf910549FdbA1083B7E515029601e8Bc748774C64
[info]                                  )
[success] Total time: 3 s, completed Mar 20, 2021, 10:32:51 PM
```

Our signup did succeed! Notice a “trust” event also occurred. If we look at the [hub source code](https://www.sbt-ethereum.io/blog/2021/03/23/Circles-with-sbt-ethereum-II-Circles-by-hand-redux.html#Appendix-Circles-hub-source-code), we’ll see that as part of the signup process, we trust ourselves 100%!

## Working with our “me-coin”

Looking at the transaction above, we can see in the `Signup` event the address of our new ERC-20 token contract, `0xf910549FdbA1083B7E515029601e8Bc748774C64`. We can also find the address of our token by accessing the `userToToken` mapping:

```
sbt:circles-tutorial> ethTransactionView circles-hub userToToken circles-snoopy
[info] The function 'userToToken' yields 1 result.
[info]  + Result 1 of type 'address' is 0xf910549FdbA1083B7E515029601e8Bc748774C64
[success] Total time: 0 s, completed Mar 20, 2021, 10:38:58 PM
```

They agree! Let’s give our new token an alias. Usually I alias ERC-20 tokens by their self-reported symbols. For _Circles_ tokens, every user’s token advertises the symbol CRC. So we’ll call our new token `CRC-snoopy`:

```
sbt:circles-tutorial> ethAddressAliasSet CRC-snoopy 0xf910549FdbA1083B7E515029601e8Bc748774C64
[info] Alias 'CRC-snoopy' now points to address '0xf910549FdbA1083B7E515029601e8Bc748774C64' (for chain with ID 100).
[info] Refreshing caches.
[success] Total time: 0 s, completed Mar 20, 2021, 10:42:25 PM
```

That should be an ERC-20 token, so let’s use sbt-ethereum‘s built-in [`erc20Summary`](https://www.sbt-ethereum.io/tasks/erc20.html#erc20summary) task to check it out.

```
sbt:circles-tutorial> erc20Summary CRC-snoopy
[info] ERC20 Summary, token contract at '0xf910549FdbA1083B7E515029601e8Bc748774C64' (with aliases ['CRC-snoopy'] on chain with ID 100):
[info]   Self-Reported Name:   Circles
[info]   Self-Reported Symbol: CRC
[info]   Decimals:             18
[info]   Total Supply:         50 tokens (50000000000000000000 atoms)
[success] Total time: 0 s, completed Mar 20, 2021, 10:43:24 PM
```

Looks good!

Let’s check our own balance:

```
sbt:circles-tutorial> erc20Balance CRC-snoopy circles-snoopy
[info] For ERC20 Token Contract '0xf910549FdbA1083B7E515029601e8Bc748774C64' (with aliases ['CRC-snoopy'] on chain with ID 100), with 18 decimals...
[info]   For Address '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100))...
[info]     Balance: 50 tokens (which corresponds to 50000000000000000000 atoms)
```

We own all 50 of the current total supply. We’re rich!

This should be a perfectly normal ERC-20 token. It will have some special functionality — most importantly an `update` method through which the token owner, `circles-token`, can receive its “UBI”, and the capacity to call `transferThrough` on the hub, which [restricts transfers according to trust relationships](https://www.sbt-ethereum.io/blog/2021/03/14/Circles-with-sbt-ethereum.html) and emits a special `HubTransfer` event. But we can use our new token just like a plain old ERC-20 too. Let’s give that a try. We should be able to send our token to an arbitrary Ethereum address. (Ideally one that we control, if we want our token back!):

```
sbt:circles-tutorial> erc20Transfer CRC-snoopy 0x72a8a15ECa1f824ADE35cdEB2148223402f23448 1
[warn] For the ERC20 token with contract address '0xf910549FdbA1083B7E515029601e8Bc748774C64' (with aliases ['CRC-snoopy'] on chain with ID 100)...
[warn]   you would transfer 1 tokens, which (with 18 decimals) translates to 1000000000000000000 atoms.
[warn] The transfer would be 
[warn]   From: '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100)
[warn]   To:   '0x72a8a15ECa1f824ADE35cdEB2148223402f23448' (on chain with ID 100)
[warn] You are calling the 'transfer' function on the contract at '0xf910549FdbA1083B7E515029601e8Bc748774C64' (with aliases ['CRC-snoopy'] on chain with ID 100).
[warn] THIS FUNCTION COULD DO ANYTHING. 
[warn] Make sure that you trust that the token contract does only what you intend, and carefully verify the transaction cost before approving the ultimate transaction.
Continue? [y/n] y

==> T R A N S A C T I O N   S I G N A T U R E   R E Q U E S T
==>
==> The transaction would be a message with...
==>   To:    0xf910549FdbA1083B7E515029601e8Bc748774C64 (with aliases ['CRC-snoopy'] on chain with ID 100)
==>   From:  0xB157256Af409007d903B443349bf49A9D6a1f519 (with aliases ['circles-snoopy','default-sender'] on chain with ID 100)
==>   Data:  0xa9059cbb00000000000000000000000072a8a15eca1f824ade35cdeb2148223402f234480000000000000000000000000000000000000000000000000de0b6b3a7640000
==>   Value: 0 ether
==>
==> !!! Any ABI is associated with the destination address is currently unknown, so we cannot decode the message data as a method call !!!
==>
==> The nonce of the transaction would be 1.
==>
==> $$$ The transaction you have requested could use up to 63421 units of gas.
==> $$$ You would pay 20 gwei for each unit of gas, for a maximum cost of 0.00126842 ether.
==> $$$ (No USD value could be determined for ETH on chain with ID 100 from Coinbase).

Would you like to sign this transaction? [y/n] y

[info] Unlocking address '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100).
Enter passphrase or hex private key for address '0xB157256Af409007d903B443349bf49A9D6a1f519': ************************
[info] ERC20 Transfer, Token Contract '0xf910549FdbA1083B7E515029601e8Bc748774C64' (with aliases ['CRC-snoopy'] on chain with ID 100):
[info]   --> Sent 1 tokens (1000000000000000000 atoms)
[info]   -->   from '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100)
[info]   -->   to '0x72a8a15ECa1f824ADE35cdEB2148223402f23448' (on chain with ID 100)
[info] Waiting for the transaction to be mined (will wait up to 5 minutes).
[info] Transaction Receipt:
[info]        Transaction Hash:    0xa44798d3f08ce87c84044784bc6cf8b18e4bac291f92bda0e85b8833808507ea
[info]        Transaction Index:   2
[info]        Transaction Status:  SUCCEEDED
[info]        Block Hash:          0x7aaaee8ed5c70583e7ec081c6388c699b8546e3013470817ff66770e3289baa9
[info]        Block Number:        15117617
[info]        From:                0xB157256Af409007d903B443349bf49A9D6a1f519
[info]        To:                  0xf910549FdbA1083B7E515029601e8Bc748774C64
[info]        Cumulative Gas Used: 1283692
[info]        Gas Used:            51350
[info]        Contract Address:    None
[info]        Logs:                0 => EthLogEntry [source=0xf910549FdbA1083B7E515029601e8Bc748774C64] (
[info]                                    topics=[
[info]                                      0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef,
[info]                                      0x000000000000000000000000b157256af409007d903b443349bf49a9d6a1f519,
[info]                                      0x00000000000000000000000072a8a15eca1f824ade35cdeb2148223402f23448
[info]                                    ],
[info]                                    data=0000000000000000000000000000000000000000000000000de0b6b3a7640000
[info]                                  )
[info]        Events:              0 => Transfer [source=0xf910549FdbA1083B7E515029601e8Bc748774C64] (
[info]                                    from (of type address): 0xB157256Af409007d903B443349bf49A9D6a1f519,
[info]                                    to (of type address): 0x72a8a15ECa1f824ADE35cdEB2148223402f23448,
[info]                                    tokens (of type uint256): 1000000000000000000
[info]                                  )
[success] Total time: 43 s, completed Mar 20, 2021, 10:49:59 PM
```
It seems to have worked! We’ve sent one token from `circles-snoopy` (which owned all 50 of the initial supply) to `0x72a8a15ECa1f824ADE35cdEB2148223402f23448` (an address I control). We expect `circles-snoopy` to now have a balance of only 49 tokens, and `0x72a8a15ECa1f824ADE35cdEB2148223402f23448` to have a balance of one token. First let’s check circles-snoopy:

```
sbt:circles-tutorial> erc20Balance CRC-snoopy circles-snoopy
[info] For ERC20 Token Contract '0xf910549FdbA1083B7E515029601e8Bc748774C64' (with aliases ['CRC-snoopy'] on chain with ID 100), with 18 decimals...
[info]   For Address '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100))...
[info]     Balance: 49 tokens (which corresponds to 49000000000000000000 atoms)
[success] Total time: 0 s, completed Mar 20, 2021, 10:55:17 PM
```

49 tokens as expected! Now let’s check the balance of `0x72a8a15ECa1f824ADE35cdEB2148223402f23448`:

```
sbt:circles-tutorial> erc20Balance CRC-snoopy 0x72a8a15ECa1f824ADE35cdEB2148223402f23448
[info] For ERC20 Token Contract '0xf910549FdbA1083B7E515029601e8Bc748774C64' (with aliases ['CRC-snoopy'] on chain with ID 100), with 18 decimals...
[info]   For Address '0x72a8a15ECa1f824ADE35cdEB2148223402f23448' (on chain with ID 100))...
[info]     Balance: 1 tokens (which corresponds to 1000000000000000000 atoms)
[success] Total time: 0 s, completed Mar 20, 2021, 10:56:18 PM
```

One token, also as expected. Yay!

## Trust trust trust

My “real” circles identity is `0x647E68F4BCBC843F39c80bb02da96dD13308f657`. Let’s define an alias for that, `circles-steve`:

```
sbt:circles-tutorial> ethAddressAliasSet circles-steve 0x647E68F4BCBC843F39c80bb02da96dD13308f657
[info] Alias 'circles-steve' now points to address '0x647E68F4BCBC843F39c80bb02da96dD13308f657' (for chain with ID 100).
[info] Refreshing caches.
[success] Total time: 0 s, completed Mar 20, 2021, 10:59:45 PM
```

The hub has a `trust` method that accepts an address and a limit (from 0 to 100, interpreted as degree of trust in the form of a percentage. Let’s trust that bastard steve 50%:

```
sbt:circles-tutorial> ethTransactionInvoke circles-hub trust circles-steve 50

==> T R A N S A C T I O N   S I G N A T U R E   R E Q U E S T
==>
==> The transaction would be a message with...
==>   To:    0x29b9a7fBb8995b2423a71cC17cf9810798F6C543 (with aliases ['circles-hub'] on chain with ID 100)
==>   From:  0xB157256Af409007d903B443349bf49A9D6a1f519 (with aliases ['circles-snoopy','default-sender'] on chain with ID 100)
==>   Data:  0x9951d62f000000000000000000000000647e68f4bcbc843f39c80bb02da96dd13308f6570000000000000000000000000000000000000000000000000000000000000032| => circles-tutorial / Compile / ethTransactionInvoke 0s
==>   Value: 0 ether
==>
==> According to the ABI currently associated with the 'to' address, this message would amount to the following method call...
==>   Function called: trust(address,uint256)
==>     Arg 1 [name=user, type=address]: 0x647E68F4BCBC843F39c80bb02da96dD13308f657
==>     Arg 2 [name=limit, type=uint256]: 50
==>
==> The nonce of the transaction would be 2.
==>
==> $$$ The transaction you have requested could use up to 57835 units of gas.
==> $$$ You would pay 1 gwei for each unit of gas, for a maximum cost of 0.000057835 ether.
==> $$$ (No USD value could be determined for ETH on chain with ID 100 from Coinbase).

Would you like to sign this transaction? [y/n] y

[info] Unlocking address '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100).
Enter passphrase or hex private key for address '0xB157256Af409007d903B443349bf49A9D6a1f519': ************************
[info] Called function 'trust', with args '647e68f4bcbc843f39c80bb02da96dd13308f657, 50', sending 0 wei to address '0x29b9a7fBb8995b2423a71cC17cf9810798F6C543' in transaction with hash '0x4b76f6fdfde76c2dbb26b790f9184e2315cb60f234b637337dd14ac219426f64'.
[info] Waiting for the transaction to be mined (will wait up to 5 minutes).
[error] stack trace is suppressed; run last Compile / ethTransactionInvoke for the full output
[error] (Compile / ethTransactionInvoke) com.mchange.sc.v1.consuela.ethereum.jsonrpc.package$ClientException: Block information is incomplete while ancient block sync is still in progress, before it's finished we can't determine the existence of requested item. -- errorCode=-32000; methodName=eth_getTransactionReceipt; params=List("0x4b76f6fdfde76c2dbb26b790f9184e2315cb60f234b637337dd14ac219426f64")
[error] Total time: 18 s, completed Mar 20, 2021, 11:03:16 PM
```

Grrr. That [weird Parity/openethereum-client thing](https://github.com/openethereum/parity-ethereum/issues/10777) occurred again, while we were waiting for a transaction receipt for transaction `0x4b76f6fdfde76c2dbb26b790f9184e2315cb60f234b637337dd14ac219426f64`. (Scroll all the way to the right to see this hash.) We again have to verify the mining of that transaction by hand, using [`ethTransactionLookup`](https://www.sbt-ethereum.io/tasks/eth/transaction/index.html#ethtransactionlookup-transaction-hash-):

```
sbt:circles-tutorial> ethTransactionLookup 0x4b76f6fdfde76c2dbb26b790f9184e2315cb60f234b637337dd14ac219426f64
[info] Looking up transaction '0x4b76f6fdfde76c2dbb26b790f9184e2315cb60f234b637337dd14ac219426f64' (will wait up to 5 minutes).
[info] Transaction Receipt:
[info]        Transaction Hash:    0x4b76f6fdfde76c2dbb26b790f9184e2315cb60f234b637337dd14ac219426f64
[info]        Transaction Index:   9
[info]        Transaction Status:  SUCCEEDED
[info]        Block Hash:          0xa9fabeca7e7bd3b7f701cb7624faa76b6cac16bd70936143a0cbc0ca25f1e668
[info]        Block Number:        15117777
[info]        From:                0xB157256Af409007d903B443349bf49A9D6a1f519
[info]        To:                  0x29b9a7fBb8995b2423a71cC17cf9810798F6C543
[info]        Cumulative Gas Used: 5864451
[info]        Gas Used:            46695
[info]        Contract Address:    None
[info]        Logs:                0 => EthLogEntry [source=0x29b9a7fBb8995b2423a71cC17cf9810798F6C543] (
[info]                                    topics=[
[info]                                      0xe60c754dd8ab0b1b5fccba257d6ebcd7d09e360ab7dd7a6e58198ca1f57cdcec,
[info]                                      0x000000000000000000000000b157256af409007d903b443349bf49a9d6a1f519,
[info]                                      0x000000000000000000000000647e68f4bcbc843f39c80bb02da96dd13308f657
[info]                                    ],
[info]                                    data=0000000000000000000000000000000000000000000000000000000000000032
[info]                                  )
[info]        Events:              0 => Trust [source=0x29b9a7fBb8995b2423a71cC17cf9810798F6C543] (
[info]                                    canSendTo (of type address): 0xB157256Af409007d903B443349bf49A9D6a1f519,
[info]                                    user (of type address): 0x647E68F4BCBC843F39c80bb02da96dD13308f657,
[info]                                    limit (of type uint256): 50
[info]                                  )
```

The transaction did succeed. We can verify that by checking the trust limit of `circles-snoopy` for `circles-steve` using [`ethTransactionView`](https://www.sbt-ethereum.io/tasks/eth/transaction/index.html#ethtransactionview):

```
sbt:circles-tutorial> ethTransactionView circles-hub limits circles-snoopy circles-steve
[info] The function 'limits' yields 1 result.
[info]  + Result 1 of type 'uint256' is 50
[success] Total time: 2 s, completed Mar 20, 2021, 11:09:17 PM
```

As expected, it’s 50%. Which seems generous, considering.

## Collecting our “UBI”

We let some time pass, and start a session in our `circles-tutorial` project. Let’s check `circles-snoopy`‘s current balance of `CRC-snoopy`:

```
sbt:circles-tutorial> erc20Balance CRC-snoopy circles-snoopy
[info] For ERC20 Token Contract '0xf910549FdbA1083B7E515029601e8Bc748774C64' (with aliases ['CRC-snoopy'] on chain with ID 100), with 18 decimals...
[info]   For Address '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100))...
[info]     Balance: 49 tokens (which corresponds to 49000000000000000000 atoms)
[success] Total time: 1 s, completed Mar 23, 2021, 12:02:20 AM
```

It’s the same as before, 49 tokens, we haven’t received any UBI yet. But wait! We’re not supposed to until we call an `update` method. (See the [source code in the appendix](https://www.sbt-ethereum.io/blog/2021/03/23/Circles-with-sbt-ethereum-II-Circles-by-hand-redux.html#Appendix-Circles-hub-source-code), which includes the token contract.)

Since `update()` is not a standard ERC-20 method, we’ll need to import the ABI for _Circles_-specific tokens. We can find that [on the _Circles_ github site](https://github.com/CirclesUBI/circles-contracts/blob/master/build/contracts/Token.json). As of sbt-ethereum 0.5.3, we can just provide the URL to ABI importing tasks ([`ethContractAbiImport`](https://www.sbt-ethereum.io/tasks/eth/contract/abi.html#ethcontractabiimport) and [`ethContractAbiDefaultImport`](https://www.sbt-ethereum.io/tasks/eth/contract/abi.html#ethcontractabidefaultimport)) and _sbt-ethereum_ will extract the ABI.

```
sbt:circles-tutorial> ethContractAbiImport CRC-snoopy
To import an ABI, you may provide the JSON ABI directly, or else a file path or URL from which the ABI can be downloaded.
Contract ABI or Source: https://github.com/CirclesUBI/circles-contracts/blob/master/build/contracts/Token.json
[info] Attempting to interactively import a contract ABI.
[info] Checking to see if you have provided a JSON array or object directly.
[info] The provided text does not appear to be a JSON ABI.
[info] Checking if the provided source exists as a File.
[info] No file found. Checking if the provided source is interpretable as a URL.
[info] 'https://github.com/CirclesUBI/circles-contracts/blob/master/build/contracts/Token.json' was reinterpreted into raw URL 'https://raw.githubusercontent.com/CirclesUBI/circles-contracts/master/build/contracts/Token.json. Trying that, will retry provided URL if necessary.
[info] Interpreted user-provided source as a URL. Attempting to fetch contents.
[info] Found JSON object. Will look for an ABI under the key 'abi'.
[info] The data discovered at source 'https://github.com/CirclesUBI/circles-contracts/blob/master/build/contracts/Token.json' was successfully interpreted as an ABI.
Ready to import the following ABI:
```
<details><summary><i>Show ABI</i></summary>
<div>

```
[ {
  "inputs" : [ {
    "internalType" : "address",
    "name" : "_owner",
    "type" : "address"l / Compile / ethContractAbiImport 0s
  } ],
  "stateMutability" : "nonpayable",
  "type" : "constructor"
}, {
  "anonymous" : false,
  "inputs" : [ {
    "indexed" : true,
    "internalType" : "address",
    "name" : "owner",
    "type" : "address"
  }, {
    "indexed" : true,
    "internalType" : "address",
    "name" : "spender",
    "type" : "address"
  }, {
    "indexed" : false,
    "internalType" : "uint256",
    "name" : "value",
    "type" : "uint256"
  } ],
  "name" : "Approval",
  "type" : "event"
}, {
  "anonymous" : false,
  "inputs" : [ {
    "indexed" : true,
    "internalType" : "address",
    "name" : "from",
    "type" : "address"
  }, {
    "indexed" : true,
    "internalType" : "address",
    "name" : "to",
    "type" : "address"
  }, {
    "indexed" : false,
    "internalType" : "uint256",
    "name" : "value",
    "type" : "uint256"
  } ],
  "name" : "Transfer",
  "type" : "event"
}, {
  "inputs" : [ {
    "internalType" : "address",
    "name" : "owner",
    "type" : "address"
  }, {
    "internalType" : "address",
    "name" : "spender",
    "type" : "address"
  } ],
  "name" : "allowance",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ {
    "internalType" : "address",
    "name" : "spender",
    "type" : "address"
  }, {
    "internalType" : "uint256",
    "name" : "amount",
    "type" : "uint256"
  } ],
  "name" : "approve",
  "outputs" : [ {
    "internalType" : "bool",
    "name" : "",
    "type" : "bool"
  } ],
  "stateMutability" : "nonpayable",
  "type" : "function"
}, {
  "inputs" : [ {
    "internalType" : "address",
    "name" : "account",
    "type" : "address"
  } ],
  "name" : "balanceOf",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "currentIssuance",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "decimals",
  "outputs" : [ {
    "internalType" : "uint8",
    "name" : "",
    "type" : "uint8"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ {
    "internalType" : "address",
    "name" : "spender",
    "type" : "address"
  }, {
    "internalType" : "uint256",
    "name" : "subtractedValue",
    "type" : "uint256"
  } ],
  "name" : "decreaseAllowance",
  "outputs" : [ {
    "internalType" : "bool",
    "name" : "",
    "type" : "bool"
  } ],
  "stateMutability" : "nonpayable",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "hub",
  "outputs" : [ {
    "internalType" : "address",
    "name" : "",
    "type" : "address"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ {
    "internalType" : "address",
    "name" : "spender",
    "type" : "address"
  }, {
    "internalType" : "uint256",
    "name" : "addedValue",
    "type" : "uint256"
  } ],
  "name" : "increaseAllowance",
  "outputs" : [ {
    "internalType" : "bool",
    "name" : "",
    "type" : "bool"
  } ],
  "stateMutability" : "nonpayable",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "inflationOffset",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "lastTouched",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "owner",
  "outputs" : [ {
    "internalType" : "address",
    "name" : "",
    "type" : "address"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "totalSupply",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ {
    "internalType" : "address",
    "name" : "sender",
    "type" : "address"
  }, {
    "internalType" : "address",
    "name" : "recipient",
    "type" : "address"
  }, {
    "internalType" : "uint256",
    "name" : "amount",
    "type" : "uint256"
  } ],
  "name" : "transferFrom",
  "outputs" : [ {
    "internalType" : "bool",
    "name" : "",
    "type" : "bool"
  } ],
  "stateMutability" : "nonpayable",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "time",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "symbol",
  "outputs" : [ {
    "internalType" : "string",
    "name" : "",
    "type" : "string"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "name",
  "outputs" : [ {
    "internalType" : "string",
    "name" : "",
    "type" : "string"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "period",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "periods",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "timeout",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "periodsWhenLastTouched",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "hubDeployedAt",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "stop",
  "outputs" : [ ],
  "stateMutability" : "nonpayable",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "stopped",
  "outputs" : [ {
    "internalType" : "bool",
    "name" : "",
    "type" : "bool"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "findInflationOffset",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "look",
  "outputs" : [ {
    "internalType" : "uint256",
    "name" : "",
    "type" : "uint256"
  } ],
  "stateMutability" : "view",
  "type" : "function"
}, {
  "inputs" : [ ],
  "name" : "update",
  "outputs" : [ ],
  "stateMutability" : "nonpayable",
  "type" : "function"
}, {
  "inputs" : [ {
    "internalType" : "address",
    "name" : "from",
    "type" : "address"
  }, {
    "internalType" : "address",
    "name" : "to",
    "type" : "address"
  }, {
    "internalType" : "uint256",
    "name" : "amount",
    "type" : "uint256"
  } ],
  "name" : "hubTransfer",
  "outputs" : [ {
    "internalType" : "bool",
    "name" : "",
    "type" : "bool"
  } ],
  "stateMutability" : "nonpayable",
  "type" : "function"
}, {
  "inputs" : [ {
    "internalType" : "address",
    "name" : "dst",
    "type" : "address"
  }, {
    "internalType" : "uint256",
    "name" : "wad",
    "type" : "uint256"
  } ],
  "name" : "transfer",
  "outputs" : [ {
    "internalType" : "bool",
    "name" : "",
    "type" : "bool"
  } ],
  "stateMutability" : "nonpayable",
  "type" : "function"
} ]
```

</div>
</details>

```
Do you wish to import this ABi? [y/n] y
[info] A default ABI is now known for the contract at address 0xf910549FdbA1083B7E515029601e8Bc748774C64
[info] Refreshing caches.
[success] Total time: 7 s, completed Mar 23, 2021, 12:06:23 AM
```

Now we can see and use methods that are not standard to ERC-20 tokens. We can check-out the read-only methods with [`ethTransactionView`](https://www.sbt-ethereum.io/tasks/eth/transaction/index.html#ethtransactionview):

```
sbt:circles-tutorial> ethTransactionView CRC-snoopy <tab>
allowance                balanceOf                currentIssuance          decimals                 findInflationOffset      
hub                      hubDeployedAt            inflationOffset          lastTouched              look                     
name                     owner                    period                   periods                  periodsWhenLastTouched   
stopped                  symbol                   time                     timeout                  totalSupply              
```

We can also check-out the methods that would modiy the blockchain and should be run in a transaction with [`ethTransactionInvoke`](https://www.sbt-ethereum.io/tasks/eth/transaction/index.html#ethtransactioninvoke)

```
sbt:circles-tutorial> ethTransactionInvoke CRC-snoopy <tab>
approve             decreaseAllowance   hubTransfer         increaseAllowance   stop                transfer            transferFrom        
update              ​                    
```

If we look at the h[ub source code](https://www.sbt-ethereum.io/blog/2021/03/23/(#Appendix-Circles-hub-source-code)) (which includes the source code for the _Circles_ tokens it produces), we’ll learn that the read-only `look` method tells us how much “UBI” a _Circles_ token in surrently entitled to, while the blockchain-modifying `update` method actually delivers the new tokens. Let’s try them out. First let’s call look:

```
sbt:circles-tutorial> ethTransactionView CRC-snoopy look
[info] The function 'look' yields 1 result.
[info]  + Result 1 of type 'uint256' is 16646759259259152720
[success] Total time: 0 s, completed Mar 23, 2021, 12:21:33 AM
sbt:circles-tutorial> 
```

Since `CRC-snoopy` is an [ERC-20 token with the standard 18 `decimals()`](https://eips.ethereum.org/EIPS/eip-20), this will correspond to 16.67 tokens.

Now let’s go ahead and call the blockchain-modifying function `update` in a trasaction:

```
sbt:circles-tutorial> ethTransactionInvoke CRC-snoopy update

==> T R A N S A C T I O N   S I G N A T U R E   R E Q U E S T
==>
==> The transaction would be a message with...
==>   To:    0xf910549FdbA1083B7E515029601e8Bc748774C64 (with aliases ['CRC-snoopy'] on chain with ID 100)
==>   From:  0xB157256Af409007d903B443349bf49A9D6a1f519 (with aliases ['circles-snoopy','default-sender'] on chain with ID 100)
==>   Data:  0xa2e62045
==>   Value: 0 etherial / Compile / ethTransactionInvoke 0s
==>
==> According to the ABI currently associated with the 'to' address, this message would amount to the following method call...
==>   Function called: update()
==>
==> The nonce of the transaction would be 3.
==>
==> $$$ The transaction you have requested could use up to 90590 units of gas.
==> $$$ You would pay 10 gwei for each unit of gas, for a maximum cost of 0.0009059 ether.
==> $$$ (No USD value could be determined for ETH on chain with ID 100 from Coinbase).

Would you like to sign this transaction? [y/n] y

[info] Unlocking address '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100).
Enter passphrase or hex private key for address '0xB157256Af409007d903B443349bf49A9D6a1f519': ************************
[info] Called function 'update', with args '', sending 0 wei to address '0xf910549FdbA1083B7E515029601e8Bc748774C64' in transaction with hash '0x70acc6f45712f2b5e8ab7c2e052a22fa70df2d8c484751ddd1a4d873606e977b'.
[info] Waiting for the transaction to be mined (will wait up to 5 minutes).
[info] Transaction Receipt:
[info]        Transaction Hash:    0x70acc6f45712f2b5e8ab7c2e052a22fa70df2d8c484751ddd1a4d873606e977b
[info]        Transaction Index:   1
[info]        Transaction Status:  SUCCEEDED
[info]        Block Hash:          0xc5e83a56b6d8cb49f6d2d32b11c64bfc48632cd21f57804422826368a881067c
[info]        Block Number:        15152993
[info]        From:                0xB157256Af409007d903B443349bf49A9D6a1f519
[info]        To:                  0xf910549FdbA1083B7E515029601e8Bc748774C64
[info]        Cumulative Gas Used: 1003680
[info]        Gas Used:            73924
[info]        Contract Address:    None
[info]        Logs:                0 => EthLogEntry [source=0xf910549FdbA1083B7E515029601e8Bc748774C64] (
[info]                                    topics=[
[info]                                      0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef,
[info]                                      0x0000000000000000000000000000000000000000000000000000000000000000,
[info]                                      0x000000000000000000000000b157256af409007d903b443349bf49a9d6a1f519
[info]                                    ],
[info]                                    data=000000000000000000000000000000000000000000000000e7663606ffbaab00
[info]                                  )
[info]        Events:              0 => Transfer [source=0xf910549FdbA1083B7E515029601e8Bc748774C64] (
[info]                                    from (of type address): 0x0000000000000000000000000000000000000000,
[info]                                    to (of type address): 0xB157256Af409007d903B443349bf49A9D6a1f519,
[info]                                    value (of type uint256): 16674074074073967360
[info]                                  )
[success] Total time: 40 s, completed Mar 23, 2021, 12:26:28 AM
```

Excellent. It looks like it succeeded. Now let’s check `CRC-snoopy`‘s balance:

```
sbt:circles-tutorial> erc20Balance CRC-snoopy
[info] For ERC20 Token Contract '0xf910549FdbA1083B7E515029601e8Bc748774C64' (with aliases ['CRC-snoopy'] on chain with ID 100), with 18 decimals...
[info]   For Address '0xB157256Af409007d903B443349bf49A9D6a1f519' (with aliases ['circles-snoopy','default-sender'] on chain with ID 100))...
[info]     Balance: 65.67407407407396736 tokens (which corresponds to 65674074074073967360 atoms)
[success] Total time: 1 s, completed Mar 23, 2021, 12:28:24 AM
```

It’s been credited with the expected additional 16.67 tokens. Yay UBI!

## Using `transferThrough` to make a “hub transfer”

You can send your _Circles_ tokens to any _Ethereum_ address. You can receive _Circles_ tokens from any _Ethereum_ address. But given how easy it is to create a new identity endowed with _Circles_ tokens, if someone sends you some random _Circles_ tokens, you shouldn’t feel very much obliged to provide some form of value to reciprocate for the value received.

However, if you receive tokens from an address that you’ve trusted, directly or indirectly according to the rules of the _Circles_ app, then you are arguably duty bound to treat those tokens as if they were as valuable as your own, so [to provide value or perform a favor as if the payer had redeemed one of your own tokens](https://www.sbt-ethereum.io/blog/2021/03/14/Circles-with-sbt-ethereum.html).

If you wish to pay a _Circles_ participant in a way that makes clear that your token is trusted and should be honored, you can perform a _hub transfer_. When you do so, you specify the [trust path](https://www.sbt-ethereum.io/blog/2021/03/14/Circles-with-sbt-ethereum.html) through which your tokens will travel, and the transfer will only succeed if the hub smart contract can validate that path.

In this tutorial, the identity `circles-snoopy` trusted my real identity `circles-steve (0x647E68F4BCBC843F39c80bb02da96dD13308f657)`.

From my main environment (rather than the temporary shoebox I’ve used for this exercise), I call `transferThrough`beginning with my own _Circles_ tokens, ending with `circles-snoopy`, generating a hub transfer event. The syntax will be a bit arcane, though. And note the different environment we’re in, different project, different sender, different aliases. (`circles-steve` is `circles-identity` here; `circles-hub` is `gnosis-circles-hub`.)

```
sbt:eth-command-line> ethNodeChainIdOverride 100
[info] The chain ID has been overridden to 100.
[info] The session is now active on chain with ID 100, with node URL 'https://rpc.xdaichain.com/'.
[info] The current session sender is '0x72a8a15ECa1f824ADE35cdEB2148223402f23448' (with aliases ['default-sender','testing-xDAI'] on chain with ID 100).
[info] The current default gas price according to your node is 20 gwei. (THIS MAY CHANGE AT ANY TIME.)
[info] Refreshing caches.
[success] Total time: 1 s, completed Mar 23, 2021, 12:50:00 AM
sbt:eth-command-line> ethAddressSenderOverride circles-identity
[info] Sender override set to '0x647E68F4BCBC843F39c80bb02da96dD13308f657' (on chain with ID 100, aliases ['circles-identity'])).
[success] Total time: 0 s, completed Mar 23, 2021, 12:50:17 AM
sbt:eth-command-line> eth
[info] The session is now active on chain with ID 100, with node URL 'https://rpc.xdaichain.com/'.
[info] The current session sender is '0x647E68F4BCBC843F39c80bb02da96dD13308f657' (with aliases ['circles-identity'] on chain with ID 100).
[info] The current default gas price according to your node is 20 gwei. (THIS MAY CHANGE AT ANY TIME.)
[warn] NOTE: The sender has been overridden to '0x647E68F4BCBC843F39c80bb02da96dD13308f657' (with aliases ['circles-identity'] on chain with ID 100).
[success] Total time: 0 s, completed Mar 23, 2021, 12:50:22 AM
sbt:eth-command-line> ethAddressAliasSet circles-snoopy 0xB157256Af409007d903B443349bf49A9D6a1f519
[info] Alias 'circles-snoopy' now points to address '0xB157256Af409007d903B443349bf49A9D6a1f519' (for chain with ID 100).
[info] Refreshing caches.
[success] Total time: 0 s, completed Mar 23, 2021, 12:51:45 AM
sbt:eth-command-line> ethTransactionInvoke gnosis-circles-hub transferThrough [0x647E68F4BCBC843F39c80bb02da96dD13308f657] [0x647E68F4BCBC843F39c80bb02da96dD13308f657] [0xB157256Af409007d903B443349bf49A9D6a1f519] [1000000000000000000]

==> T R A N S A C T I O N   S I G N A T U R E   R E Q U E S T
==>
==> The transaction would be a message with...
==>   To:    0x29b9a7fBb8995b2423a71cC17cf9810798F6C543 (with aliases ['gnosis-circles-hub'] on chain with ID 100)
==>   From:  0x647E68F4BCBC843F39c80bb02da96dD13308f657 (with aliases ['circles-identity'] on chain with ID 100)
==>   Data:  0xd62fd9a2000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000647e68f4bcbc843f39c80bb02da96dd13308f6570000000000000000000000000000000000000000000000000000000000000001000000000000000000000000647e68f4bcbc843f39c80bb02da96dd13308f6570000000000000000000000000000000000000000000000000000000000000001000000000000000000000000b157256af409007d903b443349bf49a9d6a1f51900000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a7640000
==>   Value: 0 ether
==>
==> According to the ABI currently associated with the 'to' address, this message would amount to the following method call...
==>   Function called: transferThrough(address[],address[],address[],uint256[])
==>     Arg 1 [name=tokenOwners, type=address[]]: [0x647E68F4BCBC843F39c80bb02da96dD13308f657]
==>     Arg 2 [name=srcs, type=address[]]: [0x647E68F4BCBC843F39c80bb02da96dD13308f657]
==>     Arg 3 [name=dests, type=address[]]: [0xB157256Af409007d903B443349bf49A9D6a1f519]
==>     Arg 4 [name=wads, type=uint256[]]: [1000000000000000000]
==>
==> The nonce of the transaction would be 8.
==>
==> $$$ The transaction you have requested could use up to 317089 units of gas.
==> $$$ You would pay 20 gwei for each unit of gas, for a maximum cost of 0.00634178 ether.
==> $$$ (No USD value could be determined for ETH on chain with ID 100 from Coinbase).

Would you like to sign this transaction? [y/n] y

[info] Unlocking address '0x647E68F4BCBC843F39c80bb02da96dD13308f657' (with aliases ['circles-identity'] on chain with ID 100).
Enter passphrase or hex private key for address '0x647E68F4BCBC843F39c80bb02da96dD13308f657': ************************
[info] Called function 'transferThrough', with args '[0x647E68F4BCBC843F39c80bb02da96dD13308f657], [0x647E68F4BCBC843F39c80bb02da96dD13308f657], [0xB157256Af409007d903B443349bf49A9D6a1f519], [1000000000000000000]', sending 0 wei to address '0x29b9a7fBb8995b2423a71cC17cf9810798F6C543' in transaction with hash '0x19df802de1068e648f55b949a38f5516f5a824684ae884534d65b31b5b0a9edc'.
[info] Waiting for the transaction to be mined (will wait up to 5 minutes).
[info] Transaction Receipt:
[info]        Transaction Hash:    0x19df802de1068e648f55b949a38f5516f5a824684ae884534d65b31b5b0a9edc
[info]        Transaction Index:   1
[info]        Transaction Status:  SUCCEEDED
[info]        Block Hash:          0x4fd82c1e996b947781d00280b7ce1dd5755d2d1dadc11158605bf411bc04c710
[info]        Block Number:        15153387
[info]        From:                0x647E68F4BCBC843F39c80bb02da96dD13308f657
[info]        To:                  0x29b9a7fBb8995b2423a71cC17cf9810798F6C543
[info]        Cumulative Gas Used: 211987
[info]        Gas Used:            131831
[info]        Contract Address:    None
[info]        Logs:                0 => EthLogEntry [source=0x6B378dB654BA05395D7615Be0F07ac1B3cC9ac74] (
[info]                                    topics=[
[info]                                      0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef,
[info]                                      0x000000000000000000000000647e68f4bcbc843f39c80bb02da96dd13308f657,
[info]                                      0x000000000000000000000000b157256af409007d903b443349bf49a9d6a1f519
[info]                                    ],
[info]                                    data=0000000000000000000000000000000000000000000000000de0b6b3a7640000
[info]                                  ),
[info]                             1 => EthLogEntry [source=0x29b9a7fBb8995b2423a71cC17cf9810798F6C543] (
[info]                                    topics=[
[info]                                      0x8451019aab65b4193860ef723cb0d56b475a26a72b7bfc55c1dbd6121015285a,
[info]                                      0x000000000000000000000000647e68f4bcbc843f39c80bb02da96dd13308f657,
[info]                                      0x000000000000000000000000b157256af409007d903b443349bf49a9d6a1f519
[info]                                    ],
[info]                                    data=0000000000000000000000000000000000000000000000000de0b6b3a7640000
[info]                                  )
[info]        Events:              0 => Anonymous Event [source=0x6B378dB654BA05395D7615Be0F07ac1B3cC9ac74],
[info]                             1 => HubTransfer [source=0x29b9a7fBb8995b2423a71cC17cf9810798F6C543] (
[info]                                    from (of type address): 0x647E68F4BCBC843F39c80bb02da96dD13308f657,
[info]                                    to (of type address): 0xB157256Af409007d903B443349bf49A9D6a1f519,
[info]                                    amount (of type uint256): 1000000000000000000
[info]                                  )
[success] Total time: 32 s, completed Mar 23, 2021, 12:59:24 AM
```

The `tranferThrough` call is a bit difficult to understand, for two reasons. Let’s look at the function signature:

```javascript
/// @notice walks through tokenOwners, srcs, dests, and amounts array and executes transtive transfer
/// @dev tokenOwners[0], srcs[0], dests[0], and wads[0] constitute a transaction step
/// @param tokenOwners the owner of the tokens being sent in each transaction step
/// @param srcs the sender of each transaction step
/// @param dests the recipient of each transaction step
/// @param wads the amount for each transaction step
function transferThrough(
    address[] memory tokenOwners,
    address[] memory srcs,
    address[] memory dests,
    uint[] memory wads
) public
```

Instead of transfering from one party to another in the usual ERC-20 way, here we specify potentially a series of one-to-one token exchanged between trusted parties until finally the last payer (the last element in `srcs`) pays the final recipient (the last element of `dests`). So we have to specify not a single transfer, but (potentially) a whole sequence. That’s why we have an array of sources, destinations, coins (identified by their owners), and amounts, rather than a single transfer.

This would always be a complicated function, but it looks even more arcane than it needs to, because ***sbt-ethereum*** **doesn’t (yet) support resolution of address aliases within array brackets**. So we had to supply all the addresses in the arguments as hex. This is… not ideal.

But. We did manage to execute `transferThrough`, generating a hub transfer event, signalling to the final recipient that, not only did she receive tokens, but she received a token that directly or indirectly she has promised to trust and treat as on par with her own. She is, arguably, duty bound to provide some value in return for this transfer, in a way she would not be from some unsolicited “ordinary” transfer.

## Conclusion

So, we’ve succeeded “by hand” at creating an identity, funding it on the xDAI block chain, and signing it up for _Circles_ on the hub contract. That generated a new ERC-20 token, of which our registered identity had an initial balance of 50 tokens. But, so long as anybody periodically “touches” the token contract by calling `update`, we’ve seen that `circles-identity`‘s balance will grow over time, receiving its “UBI” in its own scrip.

We’ve also seen that we can trust other identities, fully or partially, to define the “circles of trust” through which “hub transfers” occur. Although you can send _Circles_ tokens to, or receive them from, any address, “hub transfers” have a special meaning. If you receive a token by hub transfer, it means that you’ve been paid by someone whose tokens you’ve directly or indirectly promised to honor. In theory, you [owe them a favor in return](https://www.sbt-ethereum.io/blog/2021/03/14/Circles-with-sbt-ethereum.html).

## Appendix: Circles hub source code

<details><summary>Click here to show the full source code of the Circles hub. It includes the source code of the generated ERC-20 token contracts.</summary>
<div>

```javascript
// File: @openzeppelin/contracts/math/SafeMath.sol

pragma solidity ^0.7.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

// File: @openzeppelin/contracts/utils/Address.sol

pragma solidity ^0.7.0;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain`call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
      return functionCall(target, data, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        return _functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        return _functionCallWithValue(target, data, value, errorMessage);
    }

    function _functionCallWithValue(address target, bytes memory data, uint256 weiValue, string memory errorMessage) private returns (bytes memory) {
        require(isContract(target), "Address: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{ value: weiValue }(data);
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

// File: contracts/ERC20.sol

// Based on @openzeppelin/contracts/token/ERC20/ERC20.sol

pragma solidity ^0.7.0;



/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin guidelines: functions revert instead
 * of returning `false` on failure. This behavior is nonetheless conventional
 * and does not conflict with the expectations of ERC20 applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */

contract ERC20 {
    using SafeMath for uint256;
    using Address for address;

    mapping (address => uint256) private _balances;

    mapping (address => mapping (address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _symbol;
    uint8 private _decimals;

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() external virtual view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless {_setupDecimals} is
     * called.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() external virtual view returns (uint8) {
        return _decimals;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount) public virtual returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public virtual returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20};
     *
     * Requirements:
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for ``sender``'s tokens of at least
     * `amount`.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public virtual returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, _allowances[sender][msg.sender].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    /**
     * @dev Moves tokens `amount` from `sender` to `recipient`.
     *
     * This is internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(sender, recipient, amount);

        _balances[sender] = _balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements
     *
     * - `to` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner`s tokens.
     *
     * This is internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Sets {decimals} to a value other than the default one of 18.
     *
     * WARNING: This function should only be called from the constructor. Most
     * applications that interact with token contracts will not expect
     * {decimals} to ever change, and may work incorrectly if it does.
     */
    function _setupDecimals(uint8 decimals_) internal {
        _decimals = decimals_;
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be to transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }
}

// File: contracts/interfaces/HubI.sol

pragma solidity ^0.7.0;

interface HubI {
    function issuance() external view returns (uint256);
    function issuanceByStep(uint256) external view returns (uint256);
    function inflation() external view returns (uint256);
    function divisor() external view returns (uint256);
    function period() external view returns (uint256);
    function periods() external view returns (uint256);
    function signupBonus() external view returns (uint256);
    function pow(uint256, uint256) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function deployedAt() external view returns (uint256);
    function inflate(uint256, uint256) external view returns (uint256);
    function timeout() external view returns (uint256);
}

// File: contracts/Token.sol

pragma solidity ^0.7.0;




contract Token is ERC20 {
    using SafeMath for uint256;

    uint8 public immutable override decimals = 18;

    uint256 public lastTouched; // the timestamp of the last ubi payout
    address public hub; // the address of the hub this token was deployed through
    address public immutable owner; // the safe that deployed this token
    uint256 public inflationOffset; // the amount of seconds until the next inflation step
    uint256 public currentIssuance; // issanceRate at the time this token was deployed
    bool private manuallyStopped; // true if this token has been stopped by it's owner

    /// @dev modifier allowing function to be only called through the hub
    modifier onlyHub() {
        require(msg.sender == hub);
        _;
    }

    /// @dev modifier allowing function to be only called by the token owner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address _owner) {
        require(_owner != address(0));
        owner = _owner;
        hub = msg.sender;
        lastTouched = time();
        inflationOffset = findInflationOffset();
        currentIssuance = HubI(hub).issuance();
        _mint(_owner, HubI(hub).signupBonus());
    }

    /// @notice helper function for block timestamp
    /// @return the block timestamp
    function time() public view returns (uint) {
        return block.timestamp;
    }

    /// @notice helper function for the token symbol
    /// @dev all circles tokens should have the same symbol
    /// @return the token symbol
    function symbol() public view override returns (string memory) {
        return HubI(hub).symbol();
    }

    /// @notice helper function for the token name
    /// @dev all circles tokens should have the same name
    /// @return the token name
    function name() public view returns (string memory) {
        return HubI(hub).name();
    }

    /// @notice helper function for fetching the period length from the hub
    /// @return period length in seconds
    function period() public view returns (uint256) {
        return HubI(hub).period();
    }

    /// @notice helper function for fetching the number of periods from the hub
    /// @return the number of periods since the hub was deployed
    function periods() public view returns (uint256) {
        return HubI(hub).periods();
    }

    /// @notice helper function for fetching the timeout from the hub
    /// @return the number of seconds the token can go without being updated before it's deactivated
    function timeout() public view returns (uint256) {
        return HubI(hub).timeout();
    }

    /// @notice find the inflation step when ubi was last payed out
    /// @dev ie. if ubi was last payed out during the second inflation step, returns two
    /// @return the inflation step by count
    function periodsWhenLastTouched() public view returns (uint256) {
        return (lastTouched.sub(hubDeployedAt())).div(period());
    }

    /// @notice helper functio for getting the hub deployment time
    /// @return the timestamp the hub was deployed at
    function hubDeployedAt() public view returns (uint256) {
        return HubI(hub).deployedAt();
    }

    /// @notice Caution! manually deactivates or stops this token, no ubi will be payed out after this is called
    /// @dev intended for use in case of key loss, system failure, or migration to new contracts
    function stop() public onlyOwner {
        manuallyStopped = true;
    }

    /// @notice checks whether this token has been either stopped manually, or whether it has timed out
    /// @dev combines the manual stop variable with a dead man's switch
    /// @return true is the token is still paying out ubi, otherwise false
    function stopped() public view returns (bool) {
        if (manuallyStopped) return true;
        uint256 secondsSinceLastTouched = time().sub(lastTouched);
        if (secondsSinceLastTouched > timeout()) return true;
        return false;
    }

    /// @notice the amount of seconds until the ubi payout is next inflated
    /// @dev ubi is payed out continuously between inflation steps
    /// @return the amount of seconds until the next inflation step
    function findInflationOffset() public view returns (uint256) {
        // finds the timestamp of the next inflation step, and subtracts the current timestamp
        uint256 nextInflation = ((period().mul(periods().add(1))).add(hubDeployedAt()));
        return nextInflation.sub(time());
    }

    /// @notice checks how much ubi this token holder is owed, but doesn't update their balance
    /// @dev is called in the update method to write the new balance to state, but also useful in wallets
    /// @return how much ubi this token holder is owed
    function look() public view returns (uint256) {
        // don't payout ubi if the token has been deactivated/stopped
        if (stopped()) return 0;
        uint256 payout = 0;
        uint256 clock = lastTouched;
        uint256 offset = inflationOffset;
        uint256 rate = currentIssuance;
        uint256 p = periodsWhenLastTouched();
        // this while loop gets executed only when we're rolling over an inflation step 
        // in the course of a ubi payout aka while we have to pay out ubi for more time
        // than lastTouched + inflationOffset
        while (clock.add(offset) <= time()) {
            // add the remaining offset time to the payout total at the current rate
            payout = payout.add(offset.mul(rate));
            // adjust clock to the timestamp of the next inflation step
            clock = clock.add(offset);
            // the offset is now the length of 1 period
            offset = period();
            // increment the period we are paying out for
            p = p.add(1);
            // find the issuance rate as of the next period
            rate = HubI(hub).issuanceByStep(p);
        }
        // at this point, time() - clock should always be less than 1 period
        uint256 timeSinceLastPayout = time().sub(clock);
        payout = payout.add(timeSinceLastPayout.mul(rate));
        return payout;
    }

    /// @notice receive a ubi payout
    /// @dev this is the method to actually update storage with new token balance
    function update() public {
        uint256 gift = look();
        // does nothing if there's no ubi to be payed out
        if (gift > 0) {
            // update the state variables used to calculate ubi, then mint
            inflationOffset = findInflationOffset();
            lastTouched = time();
            currentIssuance = HubI(hub).issuance();
            _mint(owner, gift);
        }
    }

    /// @notice special method called by the hub to execute a transitive transaction
    /// @param from the address the tokens are being transfered from
    /// @param to the address the tokens are being transferred to
    /// @param amount the amount of tokens to transfer
    function hubTransfer(
        address from, address to, uint256 amount
    ) public onlyHub returns (bool) {
        _transfer(from, to, amount);
    }

    function transfer(address dst, uint wad) public override returns (bool) {
        // this code shouldn't be necessary, but when it's removed the gas estimation methods
        // in the gnosis safe no longer work, still true as of solidity 7.1
        return super.transfer(dst, wad);
    }
}

// File: contracts/Hub.sol

pragma solidity ^0.7.0;

contract Hub {
    using SafeMath for uint256;

    uint256 public immutable inflation; // the inflation rate expressed as 1 + percentage inflation, aka 7% inflation is 107
    uint256 public immutable divisor; // the largest power of 10 the inflation rate can be divided by
    uint256 public immutable period; // the amount of sections between inflation steps
    string public symbol;
    string public name;
    uint256 public immutable signupBonus; // a one-time payout made immediately on signup
    uint256 public immutable initialIssuance; // the starting payout per second, this gets inflated by the inflation rate
    uint256 public immutable deployedAt; // the timestamp this contract was deployed at
    uint256 public immutable timeout; // longest a token can go without a ubi payout before it gets deactivated

    mapping (address => Token) public userToToken;
    mapping (address => address) public tokenToUser;
    mapping (address => bool) public organizations;
    mapping (address => mapping (address => uint256)) public limits;

    event Signup(address indexed user, address token);
    event OrganizationSignup(address indexed organization);
    event Trust(address indexed canSendTo, address indexed user, uint256 limit);
    event HubTransfer(address indexed from, address indexed to, uint256 amount);

    // some data types used for validating transitive transfers
    struct transferValidator {
        bool seen;
        uint256 sent;
        uint256 received;
    }
    mapping (address => transferValidator) public validation;
    address[] public seen;

    constructor(
        uint256 _inflation,
        uint256 _period,
        string memory _symbol,
        string memory _name,
        uint256 _signupBonus,
        uint256 _initialIssuance,
        uint256 _timeout
    ) {
        inflation = _inflation;
        divisor = findDivisor(_inflation);
        period = _period;
        symbol = _symbol;
        name = _name;
        signupBonus = _signupBonus;
        initialIssuance = _initialIssuance;
        deployedAt = block.timestamp;
        timeout = _timeout;
    }

    /// @notice calculates the correct divisor for the given inflation rate
    /// @dev the divisor is used to maintain precision when doing math with percentages
    /// @param _inf the inflation rate
    /// @return the largest power of ten the inflation rate can be divided by
    function findDivisor(uint256 _inf) internal pure returns (uint256) {
        uint256 iter = 0;
        while (_inf.div(pow(10, iter)) > 9) {
            iter += 1;
        }
        return pow(10, iter);
    }

    /// @notice helper function for finding the amount of inflation periods since this hub was deployed
    /// @return the amount of periods since hub was deployed
    function periods() public view returns (uint256) {
        return (block.timestamp.sub(deployedAt)).div(period);
    }

    /// @notice calculates the current issuance rate per second
    /// @dev current issuance is the initial issuance inflated by the amount of inflation periods since the hub was deployed
    /// @return current issuance rate
    function issuance() public view returns (uint256) {
        return inflate(initialIssuance, periods());
    }

    /// @notice finds the inflation rate at a given inflation period
    /// @param _periods the step to calculate the issuance rate at
    /// @return inflation rate as of the given period
    function issuanceByStep(uint256 _periods) public view returns (uint256) {
        return inflate(initialIssuance, _periods);
    }

    /// @notice find the current issuance rate for any initial issuance and amount of periods
    /// @dev this is basically the calculation for compound interest, with some adjustments because of integer math
    /// @param _initial the starting issuance rate
    /// @param _periods the step to calculate the issuance rate as of
    /// @return initial issuance rate as if interest (inflation) has been compounded period times
    function inflate(uint256 _initial, uint256 _periods) public view returns (uint256) {
        // this returns P * (1 + r) ** t - which is a the formula for compound interest if 
        // interest is compounded only once per period
        // in our case, currentIssuanceRate = initialIssuance * (inflation) ** periods
        uint256 q = pow(inflation, _periods);
        uint256 d = pow(divisor, _periods);
        return (_initial.mul(q)).div(d);
    }

    /// @notice signup to this circles hub - create a circles token and join the trust graph
    /// @dev signup is permanent, there's no way to unsignup
    function signup() public {
        // signup can only be called once
        require(address(userToToken[msg.sender]) == address(0), "You can't sign up twice");
        // organizations cannot sign up for a token
        require(organizations[msg.sender] == false, "Organizations cannot signup as normal users");

        Token token = new Token(msg.sender);
        userToToken[msg.sender] = token;
        tokenToUser[address(token)] = msg.sender;
        // every user must trust themselves with a weight of 100
        // this is so that all users accept their own token at all times
        _trust(msg.sender, 100);

        emit Signup(msg.sender, address(token));
    }

    /// @notice register an organization address with the hub and join the trust graph
    /// @dev signup is permanent for organizations too, there's no way to unsignup
    function organizationSignup() public {
        // can't register as an organization if you have a token
        require(address(userToToken[msg.sender]) == address(0), "Normal users cannot signup as organizations");
        // can't register as an organization twice
        require(organizations[msg.sender] == false, "You can't sign up as an organization twice");

        organizations[msg.sender] = true;

        emit OrganizationSignup(msg.sender);
    }

    /// @notice trust a user, calling this means you're able to receive tokens from this user transitively
    /// @dev the trust graph is weighted and directed
    /// @param user the user to be trusted
    /// @param limit the amount this user is trusted, as a percentage of 100
    function trust(address user, uint limit) public {
        // only users who have signed up as tokens or organizations can enter the trust graph
        require(address(userToToken[msg.sender]) != address(0) || organizations[msg.sender], "You can only trust people after you've signed up!");
        // you must continue to trust yourself 100%
        require(msg.sender != user, "You can't untrust yourself");
        // organizations can't receive trust since they don't have their own token (ie. there's nothing to trust)
        require(organizations[user] == false, "You can't trust an organization");
        // must a percentage
        require(limit <= 100, "Limit must be a percentage out of 100");
        // organizations don't have a token to base send limits off of, so they can only trust at rates 0 or 100
        if (organizations[msg.sender]) {
            require(limit == 0 || limit == 100, "Trust is binary for organizations");
        }
        _trust(user, limit);
    }

    /// @dev used internally in both the trust function and signup
    /// @param user the user to be trusted
    /// @param limit the amount this user is trusted, as a percentage of 100
    function _trust(address user, uint limit) internal {
        limits[msg.sender][user] = limit;
        emit Trust(msg.sender, user, limit);
    }

    /// @dev this is an implementation of exponentiation by squares
    /// @param base the base to be used in the calculation
    /// @param exponent the exponent to be used in the calculation
    /// @return the result of the calculation
    function pow(uint256 base, uint256 exponent) public pure returns (uint256) {
        if (base == 0) {
            return 0;
        }
        if (exponent == 0) {
            return 1;
        }
        if (exponent == 1) {
            return base;
        }
        uint256 y = 1;
        while(exponent > 1) {
            if(exponent.mod(2) == 0) {
                base = base.mul(base);
                exponent = exponent.div(2);
            } else {
                y = base.mul(y);
                base = base.mul(base);
                exponent = (exponent.sub(1)).div(2);
            }
        }
        return base.mul(y);
    }

    /// @notice finds the maximum amount of a specific token that can be sent between two users
    /// @dev the goal of this function is to always return a sensible number, it's used to validate transfer throughs, and also heavily in the graph/pathfinding services
    /// @param tokenOwner the safe/owner that the token was minted to
    /// @param src the sender of the tokens
    /// @param dest the recipient of the tokens
    /// @return the amount of tokenowner's token src can send to dest
    function checkSendLimit(address tokenOwner, address src, address dest) public view returns (uint256) {

        // there is no trust
        if (limits[dest][tokenOwner] == 0) {
            return 0;
        }

        // if dest hasn't signed up, they cannot trust anyone
        if (address(userToToken[dest]) == address(0) && !organizations[dest] ) {
            return 0;
        }

        //if the token doesn't exist, it can't be sent/accepted
        if (address(userToToken[tokenOwner]) == address(0)) {
             return 0;
        }

        uint256 srcBalance = userToToken[tokenOwner].balanceOf(src);

        // if sending dest's token to dest, src can send 100% of their holdings
        // for organizations, trust is binary - if trust is not 0, src can send 100% of their holdings
        if (tokenOwner == dest || organizations[dest]) {
            return srcBalance;
        }

        // find the amount dest already has of the token that's being sent
        uint256 destBalance = userToToken[tokenOwner].balanceOf(dest);

        uint256 oneHundred = 100;
        
        // find the maximum possible amount based on dest's trust limit for this token
        uint256 max = (userToToken[dest].balanceOf(dest).mul(limits[dest][tokenOwner])).div(oneHundred);
        
        // if trustLimit has already been overriden by a direct transfer, nothing more can be sent
        if (max < destBalance) return 0;

        uint256 destBalanceScaled = destBalance.mul(oneHundred.sub(limits[dest][tokenOwner])).div(oneHundred);
        
        // return the max amount dest is willing to hold minus the amount they already have
        return max.sub(destBalanceScaled);
    }

    /// @dev builds the validation data structures, called for each transaction step of a transtive transactions
    /// @param src the sender of a single transaction step
    /// @param dest the recipient of a single transaction step
    /// @param wad the amount being passed along a single transaction step
    function buildValidationData(address src, address dest, uint wad) internal {
        // the validation mapping has this format
        // { address: {
        //     seen: whether this user is part of the transaction,
        //     sent: total amount sent by this user,
        //     received: total amount received by this user,
        //    }
        // }
        if (validation[src].seen != false) {
            // if we have seen the addresses, increment their sent amounts
            validation[src].sent = validation[src].sent.add(wad);
        } else {
            // if we haven't, add them to the validation mapping
            validation[src].seen = true;
            validation[src].sent = wad;
            seen.push(src);
        }
        if (validation[dest].seen != false) {
            // if we have seen the addresses, increment their sent amounts
            validation[dest].received = validation[dest].received.add(wad);
        } else {
            // if we haven't, add them to the validation mapping
            validation[dest].seen = true;
            validation[dest].received = wad; 
            seen.push(dest);   
        }
    }

    /// @dev performs the validation for an attempted transitive transfer
    /// @param steps the number of steps in the transitive transaction
    function validateTransferThrough(uint256 steps) internal {
        // a valid path has only one real sender and receiver
        address src;
        address dest;
        // iterate through the array of all the addresses that were part of the transaction data
        for (uint i = 0; i < seen.length; i++) {
            transferValidator memory curr = validation[seen[i]];
            // if the address sent more than they received, they are the sender
            if (curr.sent > curr.received) {
                // if we've already found a sender, transaction is invalid
                require(src == address(0), "Path sends from more than one src");
                // the real token sender must also be the transaction sender
                require(seen[i] == msg.sender, "Path doesn't send from transaction sender");
                src = seen[i];
            }
            // if the address received more than they sent, they are the recipient
            if (curr.received > curr.sent) {
                // if we've already found a recipient, transaction is invalid
                require(dest == address(0), "Path sends to more than one dest");
                dest = seen[i];
            }
        }
        // a valid path has both a sender and a recipient
        require(src != address(0), "Transaction must have a src");
        require(dest != address(0), "Transaction must have a dest");
        // sender should not recieve, recipient should not send
        // by this point in the code, we should have one src and one dest and no one else's balance should change
        require(validation[src].received == 0, "Sender is receiving");
        require(validation[dest].sent == 0, "Recipient is sending");
        // the total amounts sent and received by sender and recipient should match
        require(validation[src].sent == validation[dest].received, "Unequal sent and received amounts");
        // the maximum amount of addresses we should see is one more than steps in the path
        require(seen.length <= steps + 1, "Seen too many addresses");
        emit HubTransfer(src, dest, validation[src].sent);
        // clean up the validation datastructures
        for (uint i = seen.length; i >= 1; i--) {
            delete validation[seen[i-1]];
        }
        delete seen;
        // sanity check that we cleaned everything up correctly
        require(seen.length == 0, "Seen should be empty");
    }

    /// @notice walks through tokenOwners, srcs, dests, and amounts array and executes transtive transfer
    /// @dev tokenOwners[0], srcs[0], dests[0], and wads[0] constitute a transaction step
    /// @param tokenOwners the owner of the tokens being sent in each transaction step
    /// @param srcs the sender of each transaction step
    /// @param dests the recipient of each transaction step
    /// @param wads the amount for each transaction step
    function transferThrough(
        address[] memory tokenOwners,
        address[] memory srcs,
        address[] memory dests,
        uint[] memory wads
    ) public {
        // all the arrays must be the same length
        require(dests.length == tokenOwners.length, "Tokens array length must equal dests array");
        require(srcs.length == tokenOwners.length, "Tokens array length must equal srcs array");
        require(wads.length == tokenOwners.length, "Tokens array length must equal amounts array");
        for (uint i = 0; i < srcs.length; i++) {
            address src = srcs[i];
            address dest = dests[i];
            address token = tokenOwners[i];
            uint256 wad = wads[i];
            
            // check that no trust limits are violated
            uint256 max = checkSendLimit(token, src, dest);
            require(wad <= max, "Trust limit exceeded");

            buildValidationData(src, dest, wad);
            
            // go ahead and do the transfers now so that we don't have to walk through this array again
            userToToken[token].hubTransfer(src, dest, wad);
        }
        // this will revert if there are any problems found
        validateTransferThrough(srcs.length);
    }
}
```
</div>
</details>
