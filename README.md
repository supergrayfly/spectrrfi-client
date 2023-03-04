# Spectrr Finance Web Client

Web client for Spectrr Finance, designed to interact with Spectrr Finance smart contracts. 
This webpage will be available at the spectrrfi.eth Ethereum Name Service domain.

## Overview

Spectrr Finance is a lending and borrowing like platform. Indeed, users can sell and buy tokens (wFTM, wBTC, wETH, USDC, fBNB, and wLINK at the moment), and then repay their debt at a later pre-specified date. Naturally, to make sure that buyers repay their debts, users also need to post collateral (1.5 times the value of the debt) when buying tokens. Also, there is a 0.1% fee paid when an offer is accepted.
From a technical point a view, Spectrr finance is composed of Smart Contracts (business logic on blockchain), and a Subgraph running The Graph protocol (to get the latest data from the blockchain). The Last piece is this web client that interacts with the smart contracts and presents to users the latest data from the Subgraph.
Spectrr Finance aims to be an interest-free alternative to other interest-based lending and borrowing dApps.

## Installation

To get the client working on your machine, make sure
you have nodejs and npm (or any other package manager) installed. 
Also, you need to have a web3 wallet for your browser,
such as Metamask or Exodus. 
You can then do:

```
> git clone https://gitlab.com/spectrrfi/client
> cd client
// Install dependency (express)
> npm install
> npm run server
// or:
> node ./server.js
```
By default, the client will be running at http://localhost:8008

## Development

If you want to modify the client source code,
you need to install the development dependencies:

```
> git clone https://gitlab.com/spectrrfi/client
> cd client
> npm install --save-dev
// make changes
> npm run build 
> npm run server
```

## Miscellaneous

- Spectrr Finance ONLY officially runs on the following two chains:
  - Fantom Opera (Mainnet)
  - Fantom testnet (Testing)
- A simple usage guide is available on the webpage, 
by clicking on the 'Guide' button located in the upper menu.
Alternatively, it is also available in the ./src/guide directory.
- Smart Contracts git [repo](https://gitlab.com/spectrrfi/contracts)

## Contributing

Feel free to contribute in any way to this project.
Pull requests, comments, and emails are all appreciated.

## Disclaimer

- "SOFTWARE PROVIDED AS IS", No Warranty or Liability Whatsoever (See LICENSE.txt file).
- Trading Cryptocurrencies is Very Risky.
- Webpage hosted on
  <a href="https://docs.ipfs.tech/concepts/what-is-ipfs/"
  target="_blank">IPFS (Interplanetary file system)</a>
  , unless you run it locally on your machine.
- Using
  <a href="https://thegraph.com/docs/en/deploying/hosted-service/"
  target="_blank">The Graph Decentralized Network (hosted service)</a>
  to query all info about offers, if the service is down,
  the webpage will not be able to fetch any info on any offers.
- Prices are currently provided by Chainlink Price Feeds.

## Contact

- email: supergrayfly@proton.me
- gpg public key: https://gitlab.com/supergrayfly.gpg

## License

BSD-3-Clause
