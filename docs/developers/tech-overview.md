# Technical Architecture Circles Garden


## System Description

The system can be decomposed into two layers: 
**Layer 0** --> Blockchain layer
**Layer 1**  --> Circles Garden Services Layer

![]()![](https://i.imgur.com/Ie0H1Wz.png)

## Layer 0 - Blockchain layer

To understand Circles infrastructure, it is necesssary to understand the Blockchain infrastructure first. 

**Blockchain**

- Every block has a list of transactions.
- There is a limitation of how many transactions can be processed per time or per block.
- Transactions wait in the memory pool before being added into a block:

![Memory pool and transactions](https://i.imgur.com/RadXWx5.png)
Source: [Semanthics scholars](https://www.semanticscholar.org/paper/Contra-*%3A-Mechanisms-for-Countering-Spam-Attacks-on-Saad-Kim/0dd0a39b30fe4ad5fc637ba4f571623ed385b752)

**Ethereum**

- [Descentralised blockchain platform](https://ethereum.org/en/developers/docs/).
- An [Ethereum Client](https://ethereum.org/en/developers/docs/nodes-and-clients/) is a node of the network. There are different [node types](https://ethereum.org/en/developers/docs/nodes-and-clients/) and node implementations (we use Nethermind).
- [Ethereum full node vs archive node](https://www.quicknode.com/guides/infrastructure/ethereum-full-node-vs-archive-node): Full nodes are the nodes that copy and verify transactions on the blockchain and help maintain the blockchain state. They store the state of the most recent 128 blocks. Archive nodes are full nodes running with a special option known as "archive mode". Archive nodes have all the historical data of the blockchain since the genesis block.
- Running your own node can be difficult and you don’t always need to run your own instance. In this case, you can use a third party API provider like [GetBlock](https://getblock.io/) or [QuickNode](https://www.quicknode.com/).
- Every Ethereum client implements an [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/).
 - Ethereum protocol uses an [eliptic curve algorithm](https://www.oreilly.com/library/view/mastering-ethereum/9781491971932/ch04.html).
- [Ethereum Virtual Machine (EVM)](https://takenobu-hs.github.io/downloads/ethereum_evm_illustrated.pdf) is a sandboxed virtual stack embedded within each full Ethereum node, responsible for executing contract bytecode.
     - Transactions require time and money. Every write transaction needs to be paid by [gas fees](https://ethereum.org/en/developers/docs/gas/#what-is-gas).
    -  Storage in the EVM also requires a fee.
    -  The cost of an operation is not fixed. There are methods for gas estimation. 
    -  It is possible to reduce the gas price. This translates in longer waiting times for the transaction to get processed.
- Ethereum introduces the idea of:
    - Token: a simple transaction specifies `{from, to, value, token}`
    - Smart Contracts
- When multiple nodes are processing a transaction, they need to reach an agreement using a [consensus mechanism](https://ethereum.org/en/developers/docs/consensus-mechanisms/).
- [Proof of Stake (PoS)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/) is the consensus mechanism of Gnosis Chain and Ethereum.



**Smart Contracts in Ethereum**

[Smart contracts](https://ethereum.org/en/smart-contracts/) are the fundamental building blocks of Ethereum applications. They are computer programs stored on the blockchain. A "smart contract" is a collection of code (its functions) and data (its state) that resides at a specific address on the Ethereum blockchain.

Smart contracts are a type of [Ethereum account](https://ethereum.org/en/developers/docs/accounts/). This means they have a balance and they can send transactions over the network. However they're not controlled by a user, instead they are deployed to the network and run as programmed. User accounts can then interact with a smart contract by submitting transactions that execute a function defined on the smart contract. Smart contracts can define rules, like a regular contract, and automatically enforce them via the code. Smart contracts cannot be deleted by default, and interactions with them are irreversible.

Ethereum has developer-friendly languages for writing smart contracts such as [Solidity](https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html). Then the code is translated as a chain of commands on an EVM.


**Circles Protocol**

The Circles protocol is a set of smart contracts that are currently deployed on the [Gnosis Chain](https://www.gnosis.io/), which is a stable payments EVM (Ethereum Virtual Machine) blockchain.

Development on Gnosis Chain (GC) is easy and intuitive for Ethereum developers. Since GC is an EVM chain, smart contracts can be written and deployed in exactly the same way simply by setting a [different RPC endpoint](https://docs.gnosischain.com/tools/rpc).

![Blockchain/Circles World](https://i.imgur.com/xNCmwMp.png)

Read the [white paper](https://handbook.joincircles.net/docs/developers/whitepaper/) for context, where the Circles protocol is abstracted. Actually, the Circles protocol could be implemented in any other platform (not in Ethereum, which is a really slow and inefficient db).

The main [Circles smart contracts](https://github.com/CirclesUBI/circles-contracts) are:

- **[Hub Smart Contract](https://github.com/CirclesUBI/circles-contracts/blob/master/contracts/Hub.sol)**
    - It is a key-value storage that stores information about trust conections, token ownership, and all information required for the system to work.
    - It validates transfers, maintains the trust network.
    - Stores whether users are organizations.
    - Important methods:
        - **Sign up:** adds a user to the trust network and creates a circles token for that user.
        - **Transfer:** it applies the restrictions of the trust network in order to execute a transaction. In the blockchain, any token can be sent at any account at any time, however, the hubTransfer is what makes a difference to give real value to CRC inside the trust network.
        - **Trust:** provides trust from a user to another.
    - Any ethereum address can sign up in the Hub (smart contracts, EOA...) and participate in the trust network.
    - Subscription to the Hub through sockets.
    - There is only [one hub](https://blockscout.com/xdai/mainnet/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/read-contract) currently deployed on GC. 
    - As it is, the hub works, in case a new hub is implemented it will be necessary to migrate all users from one hub to another. 
    
- **[Token Smart Contract](https://github.com/CirclesUBI/circles-contracts/blob/master/contracts/Token.sol)**
    - Its implementation is inherited from the [ERC20 token standard implementation](https://eips.ethereum.org/EIPS/eip-20).
    - It is a hashmap `addr<>amount`.
    - It stores information about who owns which token (balance).
    - It is in charge of minting (which is represents the UBI issuance), through the public method `update()`.
    - It implements a liveliness triger to stop minting if the `update()` method hasn't been called for 90 days.
    - The minting can also be stopped manually by the owner of the token.

- **[Safe Smart Contract](https://github.com/CirclesUBI/safe-contracts)**
    - Circles protocol uses [Gnosis Safe](https://docs.gnosis-safe.io/) smart contracts to provide resilience and security using its multisignature feature.
    - A [Safe](https://help.gnosis-safe.io/en/articles/3876456-what-is-gnosis-safe) represents a Circles account (also called Circles profile). One smart contract is deployed per user.
    - In UBI accounts, the Safe is the owner of the Token.
    - The Safe has owners itself (only one by default), which are the device addresses.
    - The owner of the Safe (the keypair/ethereum account) manages the Safe, and can sign transactions on behalf of the Safe.
    - Organizations (also called Shared Wallets) are also Safes, without a token, and with many owners.
    - The Safe used in Circles is a clone of the Master copy. The version is explicitly set in the application.
    - Currently circles.garden uses the Safe `v1.3.0+L2`.

- **[Gnosis Proxy Factory](https://github.com/gnosis/safe-contracts/blob/main/contracts/proxies/GnosisSafeProxyFactory.sol) and Gnosis Master Safe**
    - Deploying a GnosisSafe smart contract in the blockchain is expensive.
    - Therefore, the Proxy Factory and the Master Copy are used for reducing the cost of the deployment of a new Safe.
    - Every deployment using GnosisSafe is done through the Proxy Factory, which is deployed once per blockchain. Only unique parts of the Safe smart contracts are deployed, making less expensive to deploy a new Safe.
    - There's one deployment per version. For example:
        - 1.1.1 -> the one Circles-Garden used before
        - 1.3.0 -> the one Circles-Garden uses now

There are also Ethereum events from the smart contracts, so our services can listen to blockchain events.

There's a new upgrade path, which will have to be verified by the community. Read [the Circles 2.0 proposal](https://aboutcircles.com/t/earth-circle-ip-1-circles-2-0-contracts/428) in the forum for more information.

## Layer 1 - Circles Garden Services Layer

Up to now, the blockchain and the smart contract world is the common environment where different Circles apps (or wallets) and services live on top of, such as **circles.garden**, **circles.pink**, or **https://staging.circlesubi.id/#/**.

The Circles Garden system architecture has multiple intermediate services to interact with the Blockchain world to overcome different limitations:

- Relayer
- graph-node
- Api
- Pathfinder
- Trust and Capacity Networks

Let's describe each one of the services by explaining the limitations they are solving, and how they are implemented.


### [Relayer](https://github.com/CirclesUBI/safe-relay-service)

#### Purpose

Every transaction in Ethereum carries some fees. The payment can be done with a token through an account that can be verified.

In the Ethereum mainnet these transactions are costly, that's the reason why Circles uses Gnosis side chain.

The relayer main purpose is to make transaction fees payment transparent for the user.

#### Solution

The Relayer pays for the transaction fees on behalf of the user through meta-transactions (see ERC20 specification) to the Gnosis Chain. It pays for the Safe deployment and the gas fees for all the users of circles.garden. Therefore, the relayer can be used for controlling expenses since writing in the blockchain is always done through this service. 

Also, as it deploys the Safe for the users, it takes care of which version of Safe contract is used.

#### Implementation

It is a django webapp, already developed by Gnosis. The Garden uses a fork of their implementation of the relayer, adding some patches by Bitspossessed. Currently the project is not maintained by Gnosis, they deprecated it.

It uses [Celery framework](https://docs.celeryproject.org/en/stable/getting-started/introduction.html) for task management and queues.

You can check the API documentation in the local env: http://relay.circles.local/

The Gnosis API also can be checked here [https://safe-transaction.gnosis.io/](https://safe-transaction.gnosis.io/)

There are 2 keys for the two functions: 
- the funder, for paying Safe deployments
- the sender, for paying other transactions

####  Bottlenecks

The main bottleneck is scalabitily. There is only one relayer, which means, this service is in charge of all the transactions for every user of circles.garden. If there is a large number of transactions asking for payment, these get added to the queue, and worsening the user experience because these translates in longer waiting times (delays).

The relayer takes care of some other tasks, that could be moved to a different service in order to mitigate the delays and improve simplification, such as: 
- create and pay for the Safe
- keep track of the nonce
- scans the gas price

####  Missing features

- Recovery mode to react to reorgs. Sometimes the relayer gets stuck because a transaction is registered in the DB but actually didn't happen in the blockchain and the nonce gets out of sync. The relayer was created for mainnet, not for Gnosis Chain, where forks happen more often
- Restart mechanism
- Failure tracing: errors are not propagated to the DApp
- Paralellelization: Having different relayers (different keys), sharing a db or making them not needing the db too much

### [The Graph](https://github.com/graphprotocol/graph-node)

#### Purpose

The data stored in the EVM storage is not in the shape you need for computing it. It's really limited (there's not even Arrays). Thus  The Graph exists to index the Circles data from the blockchain.

These are the most important limitations addressed:

- **Token indexing**: The Token Smart Contract holds the information about the amount of tokens an address has. So in order to get the total balance of an specific user it would be necessary to query all the circles tokens signed up in the Hub. This process would be quite costly. The subgraph stores the balances on the Safe entity to allow getting the balance of an user.

- **Trust indexing**: The Hub Smart Contract contains a mapping of the trust limits from one user to another. To build the trust network it would be necessary to go through every mapping in the hub and build the network. When a new account is created there is another node to be added to the network. This process is quite costly both economically and computationally.

- **Safe indexing**: We can easily get the owners of a given Safe, but not the opposite. The subgraph stores the Safes of a given owner.

#### Solution

[The Graph](https://thegraph.com/en/) listens to blockchain events. In each block there's a list of Events, and the graph uses this list to find the interesting transactions (txs), and index the useful information based on a predefined schema. It implements a materialization: it's a view of the blockchain data. Learn more in the [official documentation](https://thegraph.com/docs/en/about/introduction/).

The [`graph-node` service](https://github.com/graphprotocol/graph-node) allows indexing from a specific block, and it has many other interesting features.

Circles.Garden uses the graph as a database for:
- trust connections
- balances
- safes owned
- notifications

#### Implementation

There is a [subgraph](https://github.com/CirclesUBI/circles-subgraph) deployed for Circles data. It has functions to process the **Events** that are of interest. It includes also data types and entity definitions. 

That information retrieved from the events is structured in a way that is useful and easy to process. Then it is stored in a database (Postgres), and with graphql one is able to query the information on demand. The queries are fast because the indexing was previously done.

####  Bottlenecks

We are currently using a subgraph deployed in our [self-hosted service](https://github.com/CirclesUBI/circles-iac/tree/main/ansible/roles/graph-protocol) and keep backup in the [free Hosted Service of The Graph](https://thegraph.com/hosted-service/subgraph/circlesubi/circles-ubi). The Hosted Service is a centralised service run by Edge & Node, one of the core developer teams at The Graph. It is free to both deploy and query subgraphs on the Hosted Service.

Synchronisation is often lost between the subgraph and the blockchain. This can be seen in the [dashboard](https://dashboard.circles.garden/). The effect in the webapp is that the data comes with an undessirable delay.


### [API](https://github.com/CirclesUBI/circles-api)

#### Purpose

The API Solves 2 problems:
1. User data storage
    - Storage on-chain is expensive. Thus the api saves the off-chain data and makes it accessible for circles.garden. 
    - Storing sensitive information on-chain such us username or payment description is not desired. 
    - Profile pictures for example are saved in AWS at the moment.
2. Transitive transfer service (see next section "Pathfinder / transfer service")

#### Solution

The API takes responsibility of storing off-chain data in its database (postgres) and AWS.

#### Implementation

There's an authentication mechanism for some of queries to the API. Payment descriptions can only be requested by accounts involved in the transaction, for example.

####  Missing features/Improvements

- Add encryption layer around the username storage
- Use [IPFS](https://ipfs.io/) for storage instead of AWS

### Pathfinder / transfer service

#### Purpose

The Hub transfer() method does not provide a transitive transaction path between users.

#### Solution

Circles.garden uses a version of a pathfinder [implemented by Chriseth](https://github.com/chriseth/pathfinder2). This pathfinder uses a maxflow algorithm to come up with a path for the transitive transfers. It traverses possible paths from source to destination and returns the transfer steps of the calculated path.

#### Implementation

The API worker maintains a capacity network in its database by subscribing to blockchain events (Trust, Transfer). The API worker handles the events in different queues.

The pathfinder uses the capacity network data to calculate the maxflow path, and then returns the [transfer steps](https://chriseth.github.io/pathfinder/) necessary to make a transitive transaction from A to B.

There's a limit in the maximum amount of steps that are allowed for one transfer in the circles.garden webapp. The more steps, the more tx fees have to be paid. Also, we want all the transactions in a transitive transaction to end up in the same block on the blockchain and a block is limited in size. This limits the number of steps that a transaction can have and thus the amount. Read [here](https://handbook.joincircles.net/docs/developers/transitive-transactions/transfer-limitations-in-practice/) an in depth analysis on this matter.

#### Bottlenecks

The steps are currently calculated with the maxFlow algorithm, which gives a complete solution of the problem and the complexity grows with the infinite growth of the trust network. Other algorithms can be used, such as [A*](https://en.wikipedia.org/wiki/A*_search_algorithm).

### Trust and Capacity Networks

#### Trust network

It holds information regarding trust connections and trust limits.
The trust network can be obtained easily querying the Circles subgraph, but with a few blocks of delay because the graph has to process and index the Events found in the blocks.


#### Capacity network

It holds information regarding how much a user can send to another user of each token. 

Capacity/trust network diagram:

![](https://i.imgur.com/NhlE6zw.png)


To build the capacity network, the trust network is required because querying the blockchain is too expensive. The API worker keeps the edges of the capacity network up to date.

#### Syncing data challenge

The blockchain is the ultimate source of truth. In every block there is a potential change of the trust network. But in the blockchain the data is not structured.

The indexing tasks done by the graph and the api-worker take time, therefore the status will be always relatively old (the blockchain keeps adding blocks).
