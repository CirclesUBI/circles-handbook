---
id: overview
title: Overview
slug: /developers/overview
---

When we talk about Circles as a *technical* system we usually mean a couple of services, databases and protocols which interact with each other making it possible to maintain a UBI system on the blockchain. This view on the whole ecosystem is crucial for understanding the current developments and challenges we face with realizing Circles but might take away the fact that there might actually be also other perspectives and approaches. This overview want to give an introduction into the current Circles architecture while also highlighting which parts are actually part of the core protocol and which are solutions built around it.

## Smart Contracts

The most crucial part of Circles are the *Smart Contracts* defining the core rules and behaviours of the UBI system. Here, all the important values are defined: How much UBI is issued per day? What is the inflation rate? Who is signed-up for Circles? Who is trusting whom? How much do I trust this user? How much UBI do I receive next? How much can I send to this user? Also, we use the Smart Contracts to take action: Joining Circles, sending tokens to a user, trusting or untrusting somebody. Circles consist of two separate Smart Contracts: The `Hub` and the `Token` contract.

### `Hub` contract

The `Hub` defines the focal point of the ecosystem, it stores all configuration values, known trust connections, users, tokens and UBI payouts. The official `Hub` of Circles was deployed in Block *12529458* on *October 15th 2020* at the address [0x29b9a7fBb8995b2423a71cC17cf9810798F6C543](https://blockscout.com/xdai/mainnet/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/transactions).

### `Token` contract

When joining a `Hub` as a user with the [`signup`](https://github.com/CirclesUBI/circles-contracts/blob/master/contracts/Hub.sol#L107) method, the Smart Contract automatically deploys a `Token` contract for this new user and registers them in the trust network. This means that every participating user holds their own individual `Token` contract connected to their address. The `Token` contract is inherited from a regular [ERC20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) token contract extending it with UBI functionality. An additional [`look`](https://github.com/CirclesUBI/circles-contracts/blob/master/contracts/Token.sol#L122) method calculates how much UBI will be payed out to the user. With the [`update`](https://github.com/CirclesUBI/circles-contracts/blob/master/contracts/Token.sol#L153) method this payout can be issed which will mint the regarding tokens for the user. Besides of this most important functionality it also contains a [`stopped`](https://github.com/CirclesUBI/circles-contracts/blob/master/contracts/Token.sol#L102) method which indicates if the `Token` expired and got inactive, meaning that it can't issue any UBI anymore. This serves as a "Dead Man Switch" mechanism and is activated automatically after 90 days of inactivity.
