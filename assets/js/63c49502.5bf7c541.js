(self.webpackChunkcircles_handbook=self.webpackChunkcircles_handbook||[]).push([[623],{3905:function(e,t,a){"use strict";a.d(t,{Zo:function(){return h},kt:function(){return d}});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=r.createContext({}),c=function(e){var t=r.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},h=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,l=e.parentName,h=o(e,["components","mdxType","originalType","parentName"]),u=c(a),d=n,m=u["".concat(l,".").concat(d)]||u[d]||p[d]||i;return a?r.createElement(m,s(s({ref:t},h),{},{components:a})):r.createElement(m,s({ref:t},h))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,s=new Array(i);s[0]=u;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:n,s[1]=o;for(var c=2;c<i;c++)s[c]=a[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,a)}u.displayName="MDXCreateElement"},4564:function(e,t,a){"use strict";var r=a(5697),n=a.n(r),i=a(7294),s=function(e){var t=e.relativesize,a=e.src,r=e.alt;return i.createElement("img",{alt:r,src:a,style:{width:t,height:t,padding:"1.2rem",display:"block",marginLeft:"auto",marginRight:"auto"}})};s.propTypes={alt:n().string.isRequired,relativesize:n().string.isRequired,src:n().string.isRequired},t.Z=s},3499:function(e,t,a){"use strict";a.r(t),a.d(t,{frontMatter:function(){return o},metadata:function(){return l},toc:function(){return c},default:function(){return p}});var r=a(4786),n=a(6843),i=(a(7294),a(3905)),s=a(4564),o={id:"tech-overview",title:"Technical Overview for Circles Garden",slug:"/developers/architecture/tech-overview"},l={unversionedId:"developers/architecture/tech-overview",id:"developers/architecture/tech-overview",isDocsHomePage:!1,title:"Technical Overview for Circles Garden",description:"Author: Jacqueline Monta  | 2022",source:"@site/docs/developers/architecture/tech-overview.md",sourceDirName:"developers/architecture",slug:"/developers/architecture/tech-overview",permalink:"/docs/developers/architecture/tech-overview",editUrl:"https://github.com/CirclesUBI/circles-handbook/edit/main/docs/developers/architecture/tech-overview.md",version:"current",frontMatter:{id:"tech-overview",title:"Technical Overview for Circles Garden",slug:"/developers/architecture/tech-overview"},sidebar:"developers",previous:{title:"Whitepaper",permalink:"/docs/developers/whitepaper"},next:{title:"The limitation of transitive transactions in practice",permalink:"/docs/developers/transitive-transactions/transfer-limitations-in-practice"}},c=[{value:"System Description",id:"system-description",children:[]},{value:"Layer 0 - Blockchain layer",id:"layer-0---blockchain-layer",children:[]},{value:"Layer 1 - Circles Garden Services Layer",id:"layer-1---circles-garden-services-layer",children:[{value:"Relayer",id:"relayer",children:[]},{value:"The Graph",id:"the-graph",children:[]},{value:"API",id:"api",children:[]},{value:"Pathfinder / transfer service",id:"pathfinder--transfer-service",children:[]},{value:"Trust and Capacity Networks",id:"trust-and-capacity-networks",children:[]}]}],h={toc:c};function p(e){var t=e.components,o=(0,n.Z)(e,["components"]);return(0,i.kt)("wrapper",(0,r.Z)({},h,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"Author: Jacqueline Monta  | 2022")),(0,i.kt)("h2",{id:"system-description"},"System Description"),(0,i.kt)("p",null,"The system can be decomposed into two layers:\n",(0,i.kt)("strong",{parentName:"p"},"Layer 0")," --\x3e Blockchain layer\n",(0,i.kt)("strong",{parentName:"p"},"Layer 1"),"  --\x3e Circles Garden Services Layer"),(0,i.kt)(s.Z,{relativesize:"90%",src:a(5685).Z,alt:"Architecture layers",mdxType:"FormattedImage"}),(0,i.kt)("h2",{id:"layer-0---blockchain-layer"},"Layer 0 - Blockchain layer"),(0,i.kt)("p",null,"To understand Circles infrastructure, it is necesssary to understand the Blockchain infrastructure first. "),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Blockchain")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Every block has a list of transactions."),(0,i.kt)("li",{parentName:"ul"},"There is a limitation of how many transactions can be processed per time or per block."),(0,i.kt)("li",{parentName:"ul"},"Transactions wait in the memory pool before being added into a block:")),(0,i.kt)(s.Z,{relativesize:"80%",src:a(5401).Z,alt:"Memory pool and transactions",mdxType:"FormattedImage"}),(0,i.kt)("p",null,"Source: ",(0,i.kt)("a",{parentName:"p",href:"https://www.semanticscholar.org/paper/Contra-*%3A-Mechanisms-for-Countering-Spam-Attacks-on-Saad-Kim/0dd0a39b30fe4ad5fc637ba4f571623ed385b752"},"Semanthics scholars")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Ethereum")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://ethereum.org/en/developers/docs/"},"Descentralised blockchain platform"),"."),(0,i.kt)("li",{parentName:"ul"},"An ",(0,i.kt)("a",{parentName:"li",href:"https://ethereum.org/en/developers/docs/nodes-and-clients/"},"Ethereum Client")," is a node of the network. There are different ",(0,i.kt)("a",{parentName:"li",href:"https://ethereum.org/en/developers/docs/nodes-and-clients/"},"node types")," and node implementations (we use Nethermind)."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.quicknode.com/guides/infrastructure/ethereum-full-node-vs-archive-node"},"Ethereum full node vs archive node"),': Full nodes are the nodes that copy and verify transactions on the blockchain and help maintain the blockchain state. They store the state of the most recent 128 blocks. Archive nodes are full nodes running with a special option known as "archive mode". Archive nodes have all the historical data of the blockchain since the genesis block.'),(0,i.kt)("li",{parentName:"ul"},"Running your own node can be difficult and you don\u2019t always need to run your own instance. In this case, you can use a third party API provider like ",(0,i.kt)("a",{parentName:"li",href:"https://getblock.io/"},"GetBlock")," or ",(0,i.kt)("a",{parentName:"li",href:"https://www.quicknode.com/"},"QuickNode"),"."),(0,i.kt)("li",{parentName:"ul"},"Every Ethereum client implements an ",(0,i.kt)("a",{parentName:"li",href:"https://ethereum.org/en/developers/docs/apis/json-rpc/"},"JSON-RPC API"),"."),(0,i.kt)("li",{parentName:"ul"},"Ethereum protocol uses an ",(0,i.kt)("a",{parentName:"li",href:"https://www.oreilly.com/library/view/mastering-ethereum/9781491971932/ch04.html"},"eliptic curve algorithm"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://takenobu-hs.github.io/downloads/ethereum_evm_illustrated.pdf"},"Ethereum Virtual Machine (EVM)")," is a sandboxed virtual stack embedded within each full Ethereum node, responsible for executing contract bytecode.",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Transactions require time and money. Every write transaction needs to be paid by ",(0,i.kt)("a",{parentName:"li",href:"https://ethereum.org/en/developers/docs/gas/#what-is-gas"},"gas fees"),"."),(0,i.kt)("li",{parentName:"ul"},"Storage in the EVM also requires a fee."),(0,i.kt)("li",{parentName:"ul"},"The cost of an operation is not fixed. There are methods for gas estimation. "),(0,i.kt)("li",{parentName:"ul"},"It is possible to reduce the gas price. This translates in longer waiting times for the transaction to get processed."))),(0,i.kt)("li",{parentName:"ul"},"Ethereum introduces the idea of:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Token: a simple transaction specifies ",(0,i.kt)("inlineCode",{parentName:"li"},"{from, to, value, token}")),(0,i.kt)("li",{parentName:"ul"},"Smart Contracts"))),(0,i.kt)("li",{parentName:"ul"},"When multiple nodes are processing a transaction, they need to reach an agreement using a ",(0,i.kt)("a",{parentName:"li",href:"https://ethereum.org/en/developers/docs/consensus-mechanisms/"},"consensus mechanism"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/"},"Proof of Stake (PoS)")," is the consensus mechanism of Gnosis Chain and Ethereum.")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Smart Contracts in Ethereum")),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://ethereum.org/en/smart-contracts/"},"Smart contracts"),' are the fundamental building blocks of Ethereum applications. They are computer programs stored on the blockchain. A "smart contract" is a collection of code (its functions) and data (its state) that resides at a specific address on the Ethereum blockchain.'),(0,i.kt)("p",null,"Smart contracts are a type of ",(0,i.kt)("a",{parentName:"p",href:"https://ethereum.org/en/developers/docs/accounts/"},"Ethereum account"),". This means they have a balance and they can send transactions over the network. However they're not controlled by a user, instead they are deployed to the network and run as programmed. User accounts can then interact with a smart contract by submitting transactions that execute a function defined on the smart contract. Smart contracts can define rules, like a regular contract, and automatically enforce them via the code. Smart contracts cannot be deleted by default, and interactions with them are irreversible."),(0,i.kt)("p",null,"Ethereum has developer-friendly languages for writing smart contracts such as ",(0,i.kt)("a",{parentName:"p",href:"https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html"},"Solidity"),". Then the code is translated as a chain of commands on an EVM."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Circles Protocol")),(0,i.kt)("p",null,"The Circles protocol is a set of smart contracts that are currently deployed on the ",(0,i.kt)("a",{parentName:"p",href:"https://www.gnosis.io/"},"Gnosis Chain"),", which is a stable payments EVM (Ethereum Virtual Machine) blockchain."),(0,i.kt)("p",null,"Development on Gnosis Chain (GC) is easy and intuitive for Ethereum developers. Since GC is an EVM chain, smart contracts can be written and deployed in exactly the same way simply by setting a ",(0,i.kt)("a",{parentName:"p",href:"https://docs.gnosischain.com/tools/rpc"},"different RPC endpoint"),"."),(0,i.kt)(s.Z,{relativesize:"80%",src:a(2290).Z,alt:"Blockchain-Circles world",mdxType:"FormattedImage"}),(0,i.kt)("p",null,"Read the ",(0,i.kt)("a",{parentName:"p",href:"https://handbook.joincircles.net/docs/developers/whitepaper/"},"white paper")," for context, where the Circles protocol is abstracted. Actually, the Circles protocol could be implemented in any other platform (not in Ethereum, which is a really slow and inefficient db)."),(0,i.kt)("p",null,"The main ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/CirclesUBI/circles-contracts"},"Circles smart contracts")," are:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/CirclesUBI/circles-contracts/blob/master/contracts/Hub.sol"},"Hub Smart Contract"))),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"It is a key-value storage that stores information about trust conections, token ownership, and all information required for the system to work."),(0,i.kt)("li",{parentName:"ul"},"It validates transfers, maintains the trust network."),(0,i.kt)("li",{parentName:"ul"},"Stores whether users are organizations."),(0,i.kt)("li",{parentName:"ul"},"Important methods:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Sign up:")," adds a user to the trust network and creates a circles token for that user."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Transfer:")," it applies the restrictions of the trust network in order to execute a transaction. In the blockchain, any token can be sent at any account at any time, however, the hubTransfer is what makes a difference to give real value to CRC inside the trust network."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Trust:")," provides trust from a user to another."))),(0,i.kt)("li",{parentName:"ul"},"Any ethereum address can sign up in the Hub (smart contracts, EOA...) and participate in the trust network."),(0,i.kt)("li",{parentName:"ul"},"Subscription to the Hub through sockets."),(0,i.kt)("li",{parentName:"ul"},"There is only ",(0,i.kt)("a",{parentName:"li",href:"https://blockscout.com/xdai/mainnet/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/read-contract"},"one hub")," currently deployed on GC. "),(0,i.kt)("li",{parentName:"ul"},"As it is, the hub works, in case a new hub is implemented it will be necessary to migrate all users from one hub to another. "))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/CirclesUBI/circles-contracts/blob/master/contracts/Token.sol"},"Token Smart Contract"))),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Its implementation is inherited from the ",(0,i.kt)("a",{parentName:"li",href:"https://eips.ethereum.org/EIPS/eip-20"},"ERC20 token standard implementation"),"."),(0,i.kt)("li",{parentName:"ul"},"It is a hashmap ",(0,i.kt)("inlineCode",{parentName:"li"},"addr<>amount"),"."),(0,i.kt)("li",{parentName:"ul"},"It stores information about who owns which token (balance)."),(0,i.kt)("li",{parentName:"ul"},"It is in charge of minting (which is represents the UBI issuance), through the public method ",(0,i.kt)("inlineCode",{parentName:"li"},"update()"),"."),(0,i.kt)("li",{parentName:"ul"},"It implements a liveliness triger to stop minting if the ",(0,i.kt)("inlineCode",{parentName:"li"},"update()")," method hasn't been called for 90 days."),(0,i.kt)("li",{parentName:"ul"},"The minting can also be stopped manually by the owner of the token."))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/CirclesUBI/safe-contracts"},"Safe Smart Contract"))),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Circles protocol uses ",(0,i.kt)("a",{parentName:"li",href:"https://docs.gnosis-safe.io/"},"Gnosis Safe")," smart contracts to provide resilience and security using its multisignature feature."),(0,i.kt)("li",{parentName:"ul"},"A ",(0,i.kt)("a",{parentName:"li",href:"https://help.gnosis-safe.io/en/articles/3876456-what-is-gnosis-safe"},"Safe")," represents a Circles account (also called Circles profile). One smart contract is deployed per user."),(0,i.kt)("li",{parentName:"ul"},"In UBI accounts, the Safe is the owner of the Token."),(0,i.kt)("li",{parentName:"ul"},"The Safe has owners itself (only one by default), which are the device addresses."),(0,i.kt)("li",{parentName:"ul"},"The owner of the Safe (the keypair/ethereum account) manages the Safe, and can sign transactions on behalf of the Safe."),(0,i.kt)("li",{parentName:"ul"},"Organizations (also called Shared Wallets) are also Safes, without a token, and with many owners."),(0,i.kt)("li",{parentName:"ul"},"The Safe used in Circles is a clone of the Master copy. The version is explicitly set in the application."),(0,i.kt)("li",{parentName:"ul"},"Currently circles.garden uses the Safe ",(0,i.kt)("inlineCode",{parentName:"li"},"v1.3.0+L2"),"."))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/gnosis/safe-contracts/blob/main/contracts/proxies/GnosisSafeProxyFactory.sol"},"Gnosis Proxy Factory")," and Gnosis Master Safe")),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Deploying a GnosisSafe smart contract in the blockchain is expensive."),(0,i.kt)("li",{parentName:"ul"},"Therefore, the Proxy Factory and the Master Copy are used for reducing the cost of the deployment of a new Safe."),(0,i.kt)("li",{parentName:"ul"},"Every deployment using GnosisSafe is done through the Proxy Factory, which is deployed once per blockchain. Only unique parts of the Safe smart contracts are deployed, making less expensive to deploy a new Safe."),(0,i.kt)("li",{parentName:"ul"},"There's one deployment per version. For example:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"1.1.1 -> the one Circles-Garden used before"),(0,i.kt)("li",{parentName:"ul"},"1.3.0 -> the one Circles-Garden uses now")))))),(0,i.kt)("p",null,"There are also Ethereum events from the smart contracts, so our services can listen to blockchain events."),(0,i.kt)("p",null,"There's a new upgrade path, which will have to be verified by the community. Read ",(0,i.kt)("a",{parentName:"p",href:"https://aboutcircles.com/t/earth-circle-ip-1-circles-2-0-contracts/428"},"the Circles 2.0 proposal")," in the forum for more information."),(0,i.kt)("h2",{id:"layer-1---circles-garden-services-layer"},"Layer 1 - Circles Garden Services Layer"),(0,i.kt)("p",null,"Up to now, the blockchain and the smart contract world is the common environment where different Circles apps (or wallets) and services live on top of, such as ",(0,i.kt)("strong",{parentName:"p"},"circles.garden"),", ",(0,i.kt)("strong",{parentName:"p"},"circles.pink"),", or ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://staging.circlesubi.id/#/"},"https://staging.circlesubi.id/#/")),"."),(0,i.kt)("p",null,"The Circles Garden system architecture has multiple intermediate services to interact with the Blockchain world to overcome different limitations:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Relayer"),(0,i.kt)("li",{parentName:"ul"},"graph-node"),(0,i.kt)("li",{parentName:"ul"},"Api"),(0,i.kt)("li",{parentName:"ul"},"Pathfinder"),(0,i.kt)("li",{parentName:"ul"},"Trust and Capacity Networks")),(0,i.kt)("p",null,"Let's describe each one of the services by explaining the limitations they are solving, and how they are implemented."),(0,i.kt)("h3",{id:"relayer"},(0,i.kt)("a",{parentName:"h3",href:"https://github.com/CirclesUBI/safe-relay-service"},"Relayer")),(0,i.kt)("h4",{id:"purpose"},"Purpose"),(0,i.kt)("p",null,"Every transaction in Ethereum carries some fees. The payment can be done with a token through an account that can be verified."),(0,i.kt)("p",null,"In the Ethereum mainnet these transactions are costly, that's the reason why Circles uses Gnosis side chain."),(0,i.kt)("p",null,"The relayer main purpose is to make transaction fees payment transparent for the user."),(0,i.kt)("h4",{id:"solution"},"Solution"),(0,i.kt)("p",null,"The Relayer pays for the transaction fees on behalf of the user through meta-transactions (see ERC20 specification) to the Gnosis Chain. It pays for the Safe deployment and the gas fees for all the users of circles.garden. Therefore, the relayer can be used for controlling expenses since writing in the blockchain is always done through this service. "),(0,i.kt)("p",null,"Also, as it deploys the Safe for the users, it takes care of which version of Safe contract is used."),(0,i.kt)("h4",{id:"implementation"},"Implementation"),(0,i.kt)("p",null,"It is a django webapp, already developed by Gnosis. The Garden uses a fork of their implementation of the relayer, adding some patches by Bitspossessed. Currently the project is not maintained by Gnosis, they deprecated it."),(0,i.kt)("p",null,"It uses ",(0,i.kt)("a",{parentName:"p",href:"https://docs.celeryproject.org/en/stable/getting-started/introduction.html"},"Celery framework")," for task management and queues."),(0,i.kt)("p",null,"You can check the API documentation in the local env: ",(0,i.kt)("a",{parentName:"p",href:"http://relay.circles.local/"},"http://relay.circles.local/")),(0,i.kt)("p",null,"The Gnosis API also can be checked here ",(0,i.kt)("a",{parentName:"p",href:"https://safe-transaction.gnosis.io/"},"https://safe-transaction.gnosis.io/")),(0,i.kt)("p",null,"There are 2 keys for the two functions: "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"the funder, for paying Safe deployments"),(0,i.kt)("li",{parentName:"ul"},"the sender, for paying other transactions")),(0,i.kt)("h4",{id:"bottlenecks"},"Bottlenecks"),(0,i.kt)("p",null,"The main bottleneck is scalabitily. There is only one relayer, which means, this service is in charge of all the transactions for every user of circles.garden. If there is a large number of transactions asking for payment, these get added to the queue, and worsening the user experience because these translates in longer waiting times (delays)."),(0,i.kt)("p",null,"The relayer takes care of some other tasks, that could be moved to a different service in order to mitigate the delays and improve simplification, such as: "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"create and pay for the Safe"),(0,i.kt)("li",{parentName:"ul"},"keep track of the nonce"),(0,i.kt)("li",{parentName:"ul"},"scans the gas price")),(0,i.kt)("h4",{id:"missing-features"},"Missing features"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Recovery mode to react to reorgs. Sometimes the relayer gets stuck because a transaction is registered in the DB but actually didn't happen in the blockchain and the nonce gets out of sync. The relayer was created for mainnet, not for Gnosis Chain, where forks happen more often"),(0,i.kt)("li",{parentName:"ul"},"Restart mechanism"),(0,i.kt)("li",{parentName:"ul"},"Failure tracing: errors are not propagated to the DApp"),(0,i.kt)("li",{parentName:"ul"},"Paralellelization: Having different relayers (different keys), sharing a db or making them not needing the db too much")),(0,i.kt)("h3",{id:"the-graph"},(0,i.kt)("a",{parentName:"h3",href:"https://github.com/graphprotocol/graph-node"},"The Graph")),(0,i.kt)("h4",{id:"purpose-1"},"Purpose"),(0,i.kt)("p",null,"The data stored in the EVM storage is not in the shape you need for computing it. It's really limited (there's not even Arrays). Thus  The Graph exists to index the Circles data from the blockchain."),(0,i.kt)("p",null,"These are the most important limitations addressed:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Token indexing"),": The Token Smart Contract holds the information about the amount of tokens an address has. So in order to get the total balance of an specific user it would be necessary to query all the circles tokens signed up in the Hub. This process would be quite costly. The subgraph stores the balances on the Safe entity to allow getting the balance of an user.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Trust indexing"),": The Hub Smart Contract contains a mapping of the trust limits from one user to another. To build the trust network it would be necessary to go through every mapping in the hub and build the network. When a new account is created there is another node to be added to the network. This process is quite costly both economically and computationally.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Safe indexing"),": We can easily get the owners of a given Safe, but not the opposite. The subgraph stores the Safes of a given owner."))),(0,i.kt)("h4",{id:"solution-1"},"Solution"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://thegraph.com/en/"},"The Graph")," listens to blockchain events. In each block there's a list of Events, and the graph uses this list to find the interesting transactions (txs), and index the useful information based on a predefined schema. It implements a materialization: it's a view of the blockchain data. Learn more in the ",(0,i.kt)("a",{parentName:"p",href:"https://thegraph.com/docs/en/about/introduction/"},"official documentation"),"."),(0,i.kt)("p",null,"The ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/graphprotocol/graph-node"},(0,i.kt)("inlineCode",{parentName:"a"},"graph-node")," service")," allows indexing from a specific block, and it has many other interesting features."),(0,i.kt)("p",null,"Circles.Garden uses the graph as a database for:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"trust connections"),(0,i.kt)("li",{parentName:"ul"},"balances"),(0,i.kt)("li",{parentName:"ul"},"safes owned"),(0,i.kt)("li",{parentName:"ul"},"notifications")),(0,i.kt)("h4",{id:"implementation-1"},"Implementation"),(0,i.kt)("p",null,"There is a ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/CirclesUBI/circles-subgraph"},"subgraph")," deployed for Circles data. It has functions to process the ",(0,i.kt)("strong",{parentName:"p"},"Events")," that are of interest. It includes also data types and entity definitions. "),(0,i.kt)("p",null,"That information retrieved from the events is structured in a way that is useful and easy to process. Then it is stored in a database (Postgres), and with graphql one is able to query the information on demand. The queries are fast because the indexing was previously done."),(0,i.kt)("h4",{id:"bottlenecks-1"},"Bottlenecks"),(0,i.kt)("p",null,"We are currently using a subgraph deployed in our ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/CirclesUBI/circles-iac/tree/main/ansible/roles/graph-protocol"},"self-hosted service")," and keep backup in the ",(0,i.kt)("a",{parentName:"p",href:"https://thegraph.com/hosted-service/subgraph/circlesubi/circles-ubi"},"free Hosted Service of The Graph"),". The Hosted Service is a centralised service run by Edge & Node, one of the core developer teams at The Graph. It is free to both deploy and query subgraphs on the Hosted Service."),(0,i.kt)("p",null,"Synchronisation is often lost between the subgraph and the blockchain. This can be seen in the ",(0,i.kt)("a",{parentName:"p",href:"https://dashboard.circles.garden/"},"dashboard"),". The effect in the webapp is that the data comes with an undessirable delay."),(0,i.kt)("h3",{id:"api"},(0,i.kt)("a",{parentName:"h3",href:"https://github.com/CirclesUBI/circles-api"},"API")),(0,i.kt)("h4",{id:"purpose-2"},"Purpose"),(0,i.kt)("p",null,"The API Solves 2 problems:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"User data storage",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"Storage on-chain is expensive. Thus the api saves the off-chain data and makes it accessible for circles.garden. "),(0,i.kt)("li",{parentName:"ul"},"Storing sensitive information on-chain such us username or payment description is not desired. "),(0,i.kt)("li",{parentName:"ul"},"Profile pictures for example are saved in AWS at the moment."))),(0,i.kt)("li",{parentName:"ol"},'Transitive transfer service (see next section "Pathfinder / transfer service")')),(0,i.kt)("h4",{id:"solution-2"},"Solution"),(0,i.kt)("p",null,"The API takes responsibility of storing off-chain data in its database (postgres) and AWS."),(0,i.kt)("h4",{id:"implementation-2"},"Implementation"),(0,i.kt)("p",null,"There's an authentication mechanism for some of queries to the API. Payment descriptions can only be requested by accounts involved in the transaction, for example."),(0,i.kt)("h4",{id:"missing-featuresimprovements"},"Missing features/Improvements"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Add encryption layer around the username storage"),(0,i.kt)("li",{parentName:"ul"},"Use ",(0,i.kt)("a",{parentName:"li",href:"https://ipfs.io/"},"IPFS")," for storage instead of AWS")),(0,i.kt)("h3",{id:"pathfinder--transfer-service"},"Pathfinder / transfer service"),(0,i.kt)("h4",{id:"purpose-3"},"Purpose"),(0,i.kt)("p",null,"The Hub transfer() method does not provide a transitive transaction path between users."),(0,i.kt)("h4",{id:"solution-3"},"Solution"),(0,i.kt)("p",null,"Circles.garden uses a version of a pathfinder ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/chriseth/pathfinder2"},"implemented by Chriseth"),". This pathfinder uses a maxflow algorithm to come up with a path for the transitive transfers. It traverses possible paths from source to destination and returns the transfer steps of the calculated path."),(0,i.kt)("h4",{id:"implementation-3"},"Implementation"),(0,i.kt)("p",null,"The API worker maintains a capacity network in its database by subscribing to blockchain events (Trust, Transfer). The API worker handles the events in different queues."),(0,i.kt)("p",null,"The pathfinder uses the capacity network data to calculate the maxflow path, and then returns the ",(0,i.kt)("a",{parentName:"p",href:"https://chriseth.github.io/pathfinder/"},"transfer steps")," necessary to make a transitive transaction from A to B."),(0,i.kt)("p",null,"There's a limit in the maximum amount of steps that are allowed for one transfer in the circles.garden webapp. The more steps, the more tx fees have to be paid. Also, we want all the transactions in a transitive transaction to end up in the same block on the blockchain and a block is limited in size. This limits the number of steps that a transaction can have and thus the amount. Read ",(0,i.kt)("a",{parentName:"p",href:"https://handbook.joincircles.net/docs/developers/transitive-transactions/transfer-limitations-in-practice/"},"here")," an in depth analysis on this matter."),(0,i.kt)("h4",{id:"bottlenecks-2"},"Bottlenecks"),(0,i.kt)("p",null,"The steps are currently calculated with the maxFlow algorithm, which gives a complete solution of the problem and the complexity grows with the infinite growth of the trust network. Other algorithms can be used, such as ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/A*_search_algorithm"},"A*"),"."),(0,i.kt)("h3",{id:"trust-and-capacity-networks"},"Trust and Capacity Networks"),(0,i.kt)("h4",{id:"trust-network"},"Trust network"),(0,i.kt)("p",null,"It holds information regarding trust connections and trust limits.\nThe trust network can be obtained easily querying the Circles subgraph, but with a few blocks of delay because the graph has to process and index the Events found in the blocks."),(0,i.kt)("h4",{id:"capacity-network"},"Capacity network"),(0,i.kt)("p",null,"It holds information regarding how much a user can send to another user of each token. "),(0,i.kt)("p",null,"Capacity/trust network diagram:"),(0,i.kt)(s.Z,{relativesize:"80%",src:a(4322).Z,alt:"Architecture for capacity and trust network",mdxType:"FormattedImage"}),(0,i.kt)("p",null,"To build the capacity network, the trust network is required because querying the blockchain is too expensive. The API worker keeps the edges of the capacity network up to date."),(0,i.kt)("h4",{id:"syncing-data-challenge"},"Syncing data challenge"),(0,i.kt)("p",null,"The blockchain is the ultimate source of truth. In every block there is a potential change of the trust network. But in the blockchain the data is not structured."),(0,i.kt)("p",null,"The indexing tasks done by the graph and the api-worker take time, therefore the status will be always relatively old (the blockchain keeps adding blocks)."))}p.isMDXComponent=!0},2290:function(e,t,a){"use strict";t.Z=a.p+"69da4aaed9927db6811b1a6927eccaeb.png"},4322:function(e,t,a){"use strict";t.Z=a.p+"657a229e2ecd0fd032011d31fecaab6e.png"},5685:function(e,t,a){"use strict";t.Z=a.p+"6a04f63ca71ebaf05265487367401677.jpg"},5401:function(e,t,a){"use strict";t.Z=a.p+"88162ffa16b526214ef5f5c32923185e.png"}}]);