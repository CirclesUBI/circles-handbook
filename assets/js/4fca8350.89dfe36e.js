(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{106:function(e,t,a){"use strict";a.d(t,"a",(function(){return u})),a.d(t,"b",(function(){return m}));var n=a(0),r=a.n(n);function s(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){s(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=r.a.createContext({}),p=function(e){var t=r.a.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},u=function(e){var t=p(e.components);return r.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,s=e.originalType,o=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),u=p(a),d=n,m=u["".concat(o,".").concat(d)]||u[d]||b[d]||s;return a?r.a.createElement(m,c(c({ref:t},l),{},{components:a})):r.a.createElement(m,c({ref:t},l))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var s=a.length,o=new Array(s);o[0]=d;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:n,o[1]=c;for(var l=2;l<s;l++)o[l]=a[l];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,a)}d.displayName="MDXCreateElement"},85:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return o})),a.d(t,"metadata",(function(){return c})),a.d(t,"toc",(function(){return i})),a.d(t,"default",(function(){return p}));var n=a(3),r=a(7),s=(a(0),a(106)),o={id:"estimate-gas-cost",title:"Exploring transfer steps and estimating the gas cost",slug:"/developers/tutorials/estimate-gas-cost"},c={unversionedId:"developers/tutorials/estimate-gas-cost",id:"developers/tutorials/estimate-gas-cost",isDocsHomePage:!1,title:"Exploring transfer steps and estimating the gas cost",description:"This tutorial is made for finding the transfer steps that the circles api would chose to make a hypothetical transitive transaction. It also explains how to find the estimated gas cost.",source:"@site/docs/developers/tutorials/estimate-gas-cost.md",slug:"/developers/tutorials/estimate-gas-cost",permalink:"/docs/developers/tutorials/estimate-gas-cost",editUrl:"https://github.com/CirclesUBI/circles-handbook/edit/main/docs/developers/tutorials/estimate-gas-cost.md",version:"current"},i=[{value:"To find the transfer steps you will need:",id:"to-find-the-transfer-steps-you-will-need",children:[]},{value:"To estimate the gas cost you will also need:",id:"to-estimate-the-gas-cost-you-will-also-need",children:[]},{value:"Steps",id:"steps",children:[]}],l={toc:i};function p(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(s.b)("wrapper",Object(n.a)({},l,a,{components:t,mdxType:"MDXLayout"}),Object(s.b)("p",null,"This tutorial is made for finding the transfer steps that the circles api would chose to make a ",Object(s.b)("strong",{parentName:"p"},"hypothetical transitive transaction"),". It also explains how to find the estimated gas cost."),Object(s.b)("h3",{id:"to-find-the-transfer-steps-you-will-need"},"To find the transfer steps you will need:"),Object(s.b)("ul",null,Object(s.b)("li",{parentName:"ul"},"A circles account with enough circles"),Object(s.b)("li",{parentName:"ul"},"The checksummed* safe address to that account (you can find it in your circles wallet) "),Object(s.b)("li",{parentName:"ul"},"The checksummed* adddress to another account you want to transfer to")),Object(s.b)("h3",{id:"to-estimate-the-gas-cost-you-will-also-need"},"To estimate the gas cost you will also need:"),Object(s.b)("ul",null,Object(s.b)("li",{parentName:"ul"},"A metamask account connected to the first circles account",Object(s.b)("ul",{parentName:"li"},Object(s.b)("li",{parentName:"ul"},"You can follow ",Object(s.b)("a",{parentName:"li",href:"https://handbook.joincircles.net/docs/developers/tutorials/gnosis-safe-as-wallet"},"this guide")),Object(s.b)("li",{parentName:"ul"},"Switch from Ethereum mainnet to the xdai network. To add xdai chose custom RCP under Networks and specify the following:",Object(s.b)("ul",{parentName:"li"},Object(s.b)("li",{parentName:"ul"},"name: xdai"),Object(s.b)("li",{parentName:"ul"},"URL: ",Object(s.b)("a",{parentName:"li",href:"https://xdai.poanetwork.dev"},"https://xdai.poanetwork.dev")),Object(s.b)("li",{parentName:"ul"},"Chain ID: 100")))))),Object(s.b)("p",null,"*A checksummed address will contain some capital letters unlike the non-checksummed address."),Object(s.b)("h3",{id:"steps"},"Steps"),Object(s.b)("ol",null,Object(s.b)("li",{parentName:"ol"},Object(s.b)("strong",{parentName:"li"},"Decide on a transfer:")," ",Object(s.b)("ul",{parentName:"li"},Object(s.b)("li",{parentName:"ul"},"from whom (use an account you have access to)"),Object(s.b)("li",{parentName:"ul"},"to whom"),Object(s.b)("li",{parentName:"ul"},"how many circles"))),Object(s.b)("li",{parentName:"ol"},Object(s.b)("strong",{parentName:"li"},"Find the transfer steps")," ")),Object(s.b)("p",null,"Run this command in the terminal with your specified data"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-shell=fish"},'curl -H "Content-Type: application/json" -X POST -d \'{"from":"<FROM_ADDRESS>","to":"<TO_ADDRESS>","value":"<AMOUNT OF CIRCLES IN WEI>"}\' https://api.circles.garden/api/transfers\n')),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-shell=fish"},'curl -H "Content-Type: application/json" -X POST -d \'{"from":"0x0B900CBbc0e6bc4edc12f56360C8bC141eD1cc1b","to":"0x6dd9EEAb489b59bdd57a59694bEe653feCE987b6","value":"100000000000000000000"}\' https://api.circles.garden/api/transfers\n')),Object(s.b)("p",null,"This is what the circles.garden](",Object(s.b)("a",{parentName:"p",href:"https://circles.garden/"},"https://circles.garden/"),") wallet calls to find out how much you can send to an account when doing a transaction through the app.\nIt uses a large amounts of circles to get the maximum amount:\n1 000 000 000 000 000 000 000 000 000 000 000 Wei = 1 trillion circles. (1 Circle is 1 000 000 000 000 000 000 Wei)"),Object(s.b)("p",null,"The result will look something like this:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-json"},'{\n    "status":"ok",\n    "data":\n    {\n        "from":"...","\n        to":"...",\n        "maxFlowValue":"...",\n        "processDuration":...,\n        "transferValue":"...",\n        "transferSteps":\n        [\n            {"from":"...","step":0,"to":"...","value":"...","tokenOwnerAddress":"..."},\n            {"from":"...","step":1,"to":"...","value":"...","tokenOwnerAddress":"..."}\n        ]\n    }\n}\n')),Object(s.b)("ol",{start:3},Object(s.b)("li",{parentName:"ol"},Object(s.b)("strong",{parentName:"li"},"Extract data arrays specifying the transfers"))),Object(s.b)("p",null,"Use a script like this to extract arrays of token owners, to, from and values:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-javascript"},"const transfers = require('./transfer.json');\n\nconst tokenOwnerAddresses = [];\nconst srcs = [];\nconst dests = [];\nconst amounts = [];\n\ntransfers.data.transferSteps.forEach(transfer =>{\n    tokenOwnerAddresses.push(transfer.tokenOwnerAddress);\n    srcs.push(transfer.from);\n    dests.push(transfer.to);\n    amounts.push(transfer.value);\n});\n\nconsole.log({\n    tokenOwnerAddresses,\n    srcs,\n    dests,\n    amounts\n});\n")),Object(s.b)("p",null,"Then remove white spaces and make sure quotations are double quotations."),Object(s.b)("ol",{start:4},Object(s.b)("li",{parentName:"ol"},Object(s.b)("strong",{parentName:"li"},"Get the hex data for the transaction"))),Object(s.b)("p",null,"Now that you have the lists of tokenOwnerAddresses, srcs, dests and amounts, go to ",Object(s.b)("a",{parentName:"p",href:"https://blockscout.com/poa/xdai/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/write-contract"},"the circles Hub on blockscout"),"\nIn the write contract tab:"),Object(s.b)("ul",null,Object(s.b)("li",{parentName:"ul"},"connect to your metamask account"),Object(s.b)("li",{parentName:"ul"},'use "3.transferThrough" and paste the value arrays from above'),Object(s.b)("li",{parentName:"ul"},'click "write"'),Object(s.b)("li",{parentName:"ul"},"Metamask will open, switch to the data tab and copy the hex data")),Object(s.b)("ol",{start:5},Object(s.b)("li",{parentName:"ol"},Object(s.b)("strong",{parentName:"li"},"Get the gas estimates from the circles api"))),Object(s.b)("p",null,"Running this curl command (it needs the checksummed safe address, which you can find it in your circles wallet and the hex data)"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-shell=fish"},'curl -X POST "\nhttps://relay.circles.garden/api/v2/safes/\n<SAFE_ADDRESS>/transactions/estimate/" -H  "Content-Type: application/json" -H  "accept: application/json" -d \'{ "safe": "<SAFE_ADDRESS>", "data": "<HEX_DATA>", "to": "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543", "value": 0, "operation": 0, "gasToken": "0x0000000000000000000000000000000000000000" }\'\n')),Object(s.b)("p",null,"returns the gas information like this:"),Object(s.b)("pre",null,Object(s.b)("code",{parentName:"pre",className:"language-json"},'{\n  "safeTxGas": "4064004",\n  "baseGas": "95328",\n  "dataGas": "95328",\n  "operationalGas": "0",\n  "gasPrice": "1000000000",\n  "lastUsedNonce": 30,\n  "gasToken": "0x0000000000000000000000000000000000000000",\n  "refundReceiver": "0x0739a8D036c966aC9161Ea14855CE0f94C15B87b"\n}\n')),Object(s.b)("p",null,"The total gas is ",Object(s.b)("inlineCode",{parentName:"p"},"safeTxGas + baseGas"),". In the example above, the total gas is then ",Object(s.b)("inlineCode",{parentName:"p"},"4.159.332")," (which under the ",Object(s.b)("inlineCode",{parentName:"p"},"12.500.000")," gas per block limit). "),Object(s.b)("p",null,"The gas price is specified in Wei and is constant on the xDai network."))}p.isMDXComponent=!0}}]);