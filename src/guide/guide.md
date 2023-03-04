---
title: Spectrr Finance How To Guide
author: Supergrayfly
---

# Spectrr Finance How to Guide

Welcome to Spectrr Finance! An interest-free lending and borrowing like decentralised platform.
Here, you can make _offers_, where you sell or buy tokens at an exchange rate and repayment period of your choice.
This guide aims to give a tour of the functionalities of the Spectrr Finance website.

## Accessing The Spectrr Finance Website

There are three ways to access the Spectrr.fi website:

1. Using a browser supporting ipfs (brave & opera), you can just search for: <a href="http://spectrr.eth" target="_blank"><i>spectrrfi.eth</i></a>
2. Using other browsers (firefox, chrome...), search for:
   <a target="_blank" href="https://spectrr.eth.limo"><i>spectrr.eth.limo</i></a> **or**
   <a href="https://spectrr.eth.link" target="_blank"><i>spectrr.eth.link</i></a>
3. Clone the git repo from https://gitlab.com/spectrrfi/client to run a server at localhost

## Getting a web3 Wallet

To interact with the Spectrr.fi Smart Contracts on the blockchain, you first need to have a web3 wallet browser extension.
To do so, you may install [metamask](https://metamask.io/), [exodus](https://www.exodus.com/web3-wallet/) (chrome & brave only), or any other major web3 provider.

## Supported Tokens (Fantom Opera)

- Wrapped Fantom or <a target="_blank" href="https://ftmscan.com/token/0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83">wFTM</a>
- Multichain Wrapped Bitcoin or <a target="_blank" href="https://ftmscan.com/token/0x321162cd933e2be498cd2267a90534a804051b11">wBTC</a>
- Multichain Wrapped Ether or Ether <a target="_blank" href="https://ftmscan.com/token/0x74b23882a30290451A17c44f4F05243b6b58C76d">wETH</a>
- Multichain Wrapped USD Coin or <a target="_blank" href="https://ftmscan.com/token/0x04068da6c83afcfa0e13ba15a6696662335d5b75">wUSDC</a>
- Multichain Wrapped Chainlink or <a target="_blank" href="https://ftmscan.com/token/0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8">wLINK</a>
- Wrapped Binance Coin or <a target="_blank" href="https://ftmscan.com/token/0x27f26F00e1605903645BbaBC0a73E35027Dccd45">wBNB</a>

## Trading Rules

- On Spectrr.fi, you cannot sell a token for the same token plus interest.
  For example, selling 1 BTC for 1.1 BTC.
- Likewise, you cannot buy a token and repay the same token plus interest.
  For instance, buying 1,000 USDT, and repaying 1,100 USDT.
- When creating a buy offer or accepting a sale offer,
  you need to provide 1.5 times the amount you are buying in collateral.
- Also, in the case of accepting a sale offer, the collateral token cannot
  be the same as the token you are buying. Otherwise, if a liquidation occurs,
  the seller would have sold a token for the same token plus interest.
- Accordingly, in the case of creating a buy offer, the collateral token
  cannot be the same as the buying token. Because of the same reasons
  cited previously.
- There is a 0.1% fee taken whenever an offer is created and accepted.

---

## Home

The home tab displays two tables, showing data on the latest
open (not accepted or closed) sale and buy offers.

![Spectrr.fi Home Page](./../pics/home.webp)

## Offers

On the offers tab, the user can directly interact with the Spectrr.fi Smart Contracts.
The picture below presents the different possible actions:

![Offers Actions](./../pics/offers.webp)

### Create

The create action simply creates a sale/buy offer based on the user's input.

#### Sale Offer

In the picture below, we are creating a **sale offer**, where we are _selling 0.01 wBTC_ at an _exchange rate of 24,000 USD/wBTC_, in _exchange of USDC_. Also, we specify a _repayment period of 2 days_.

![Creating a Sale Offer](./../pics/createSaleOffer.webp)

Before sending tokens from your wallet, you firstly have to approve an allowance for Spectrr Finance:

![Approve Allowance](./../pics/approveAllowanceCreateSale.webp)

![Approve Allowance](./../pics/approveAllowanceCreateSaleWallet.webp)

After the transaction has been confirmed on the blockchain, the following prompt will be presented after clicking on the confirm button again:

![Confirm Creating a Sale Offer](./../pics/createSaleOfferConfirm.webp)

Clicking the 'Create Buy Offer' button will prompt you to confirm the transaction in your wallet.
After its confirmation, your offer will be open and visible to others!

#### Buy Offer

The process of creating a **buy offer** is similar to creating a sale offer.
The buy offer template look like so:

![Create Buy Offer Template](./../pics/createBuyOfferTemplate.webp)

Let us create an offer were we want to buy _1000 USDC_ at an _exchange rate of 0.000645 USDC/wETH_.
We will collateralize the offer with wETH, and specify a repayment period of 30 minutes.

![Creating a Buy Offer](./../pics/createBuyOffer.webp)

If the approve allowance prompt pops out, you will have to approve the transactions in order to continue:

![Approve Allowance](./../pics/approveAllowanceCreateBuy.webp)

We will then have the following prompt summarizing the offer:

![Confirm Creating a Buy offer](./../pics/createBuyOfferConfirm.webp)

Clicking the 'Create Buy Offer' button will prompt you to confirm the transaction in your wallet.
After its confirmation, your offer will be open and visible to others!

### Cancel

Cancel an offer, given that it not accepted yet, by entering its Id in the input box.
For example, to cancel **sale offer** #3, we will do the following:

![Cancel a Sale Offer](./../pics/cancelSaleOffer.webp)

After clicking 'Cancel Sale Offer':

![Confirm Cancel Sale Offer](./../pics/cancelSaleOfferConfirm.webp)

Canceling a **buy offer** follows the same exact procedure presented above.

### Accept

Accept an offer by entering its Id in the input box.

#### Sale Offer

To accept a sale offer, you first need to select the token you want to collateralize the offer with.
The value of this collateral is 1.5 times the value of the amount buying.
Also, this collateral will be stored on the address of the Smart Contract

Here we will accept sale offer #4, and provide a USDC collateral:

![Accept Sale Offer](./../pics/acceptSaleOffer.webp)

After confirming, you may need to approve an allowance in order to continue.

After clicking 'Accept Sale Offer':

![Confirm Accept Sale Offer](./../pics/acceptSaleOfferConfirm.webp)

#### Buy Offer

Accept a buy offer by just entering its Id in the input box.

Accepting _buy offer_ #1 will like:

![Accept Buy Offer](./../pics/acceptBuyOffer.webp)

After confirming, you may need to approve an allowance in order to continue.

![Confirm Accept Buy Offer](./../pics/acceptBuyOfferConfirm.webp)

### Forfeit

Forfeit an offer by entering its Id in the input box, given that the the collateral value is not below that of the debt.
For example, to forfeit **sale offer** #4, we will do the following:

![Forfeit a Sale Offer](./../pics/forfeitSaleOffer.webp)

After clicking 'Forfeit Sale Offer':

![Confirm Forfeit Sale Offer](./../pics/forfeitSaleOfferConfirm.webp)

Forfeiting a **buy offer** follows the same exact procedure presented above.

### Repay

Repay an offer by entering its Id in the input box.
If no repayment amount is specified, it assumed that the full debt is being repaid.

Let us partly repay 100 USDC of **sale offer** #2:

![Repay a Sale Offer](./../pics/repaySaleOffer.webp)
![Confirm Repay Sale Offer](./../pics/repaySaleOfferConfirm.webp)

Repaying a **buy offer** follows the same procedure above.

### Add Collateral

Add collateral to an offer by entering its Id and the amount being added.
Adding collateral to an offer raises the collateral to debt ratio,
and thus distances the buyer from a potential liquidation
_Note_: Liquidation can occur when collateral to debt ratio is less than 1.25)

Below, we are adding 0.5 wETH of collateral to **sale offer** #2:

![Add Collateral Sale Offer](./../pics/addCollateralSaleOffer.webp)
![Confirm Add Collateral Sale Offer](./../pics/addCollateralSaleOfferConfirm.webp)

Adding collateral to a **buy offer** follows the same above procedure.

### Liquidate

Liquidate an offer by entering its Id in the input box.
_Note_: You can liquidate an offer if the collateral to debt ratio is less than 1.25 **or** if the repayment deadline has passed.

In the pictures below, we are liquidating **buy offer** #1.
As it can be seen, the offer is liquidable because the repayment period has expired.
Also, the repayment amount is 0 USDC, since the sender of the transaction is the seller of the offer.

![Liquidate Buy Offer](./../pics/liquidateBuyOffer.webp)
![Confirm Liquidate Buy Offer](./../pics/liquidateBuyOfferConfirm.webp)

Liquidating a **sale offer** follows the same above procedure.

### Change address

If you are the seller/buyer of an offer, you can change the initial address you used to create/accept the offer.
To do so, simply enter the Id of the offer in question, and the new address that you want to set.

**Warning**: If the user enters an invalid address, control of the funds
on the offer will be completely relinquished to that address with no turning back.

Here, we will change the seller address of **sale offer** #1;

![Change Address Sale Offer](./../pics/changeAddressSaleOffer.webp)
![Confirm Change Address Sale Offer](./../pics/changeAddressSaleOfferConfirm.webp)

Changing the address of a **buy offer** follows the same above procedure.

## Browse

The browse tab tabulates data on the latest open and accepted sale offers.
The latest buy offers can be shown by clicking on the 'Buy Offers' tab, above the table caption.
Offers can also be accepted from the browse tab by clicking on the accept button:

![Accept Action Button](./../pics/acceptAction.webp)

## Liquidate

This tab displays information on offers that are accepted, and thus potentially liquidable.
Also, you can liquidate offers by clicking on the liquidate button.

![Liquidate Action Button](./../pics/actionLiquidate.webp)

## Dashboard

The dashboard can show data on the offers posted and accepted by the user.
From there, you can also cancel, liquidate, and change the seller/buyer address of an offer:

![Dashboard Action Buttons](./../pics/dashboardActions.webp)

## Allowance

### Approve

The approve tab basically allows the Spectrr.fi Smart Contracts
(i.e., The Spectrr.fi website) to use the tokens in your wallet.
By default, it allocates an allowance of 1,000,000 tokens.
An optional amount can be specified in the Approve Amount box.

Clicking on the confirm button will directly open your wallet,
which will then ask you for confirmation.

In the picture below we are approving an allowance of 0.05 wBTC:

![Approving Allowance of 0.05 wBTC](./../pics/approveAllowance.webp)

### Revoke

This tab revokes a previously allocated allowance to Spectrr.fi. In other words, one will not be able to send tokens through the Spectrr.fi Smart Contracts.

![Revoke Allowance wBTC](./../pics/revokeAllowance.webp)

## Guide

Clicking on this tab will redirect you this page.
Alternatively, this guide, source code of the Spectrr.fi website, and Smart contracts, can also be found
<a href="https://gitlab.com/spectrrfi/client/-/blob/master/src/guide/guide.md" target="_blank">here</a>.

## Disclaimer

- "SOFTWARE PROVIDED AS IS", No Warranty or Liability Whatsoever.
- Trading cryptocurrencies is **very** risky, do not invest in what you can **not** afford to lose.
- Web page hosted on
  <a href="https://docs.ipfs.tech/concepts/what-is-ipfs/"
  target="_blank">IPFS (Interplanetary file system)</a>
  , unless you run it locally on your machine.
- Using
  <a href="https://thegraph.com/docs/en/deploying/hosted-service/"
  target="_blank">The Graph Decentralized Network (hosted service)</a>
  to query all info about offers, if the service is down,
  the web page will not be able to fetch any info on any offers.
- Prices used by the Smart Contracts are currently provided by Chainlink Oracles Price Feeds.

## Contact

- email: supergrayfly@proton.me
- gpg pub key: https://gitlab.com/supergrayfly.gpg

## License

BSD-3-Clause

---

<center>
Generated with
<a href="https://github.com/mixu/markdown-styles"
target="_blank">mixu/markdown-styles</a> | Copyright &copy; Supergrayfly
</center>
