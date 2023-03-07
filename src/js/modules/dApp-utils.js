// dApp Utils Functions
async function createSaleOffer(
  sellingAmount,
  sellingId,
  exchangeRate,
  sellForId,
  repayInSeconds,
  markup
) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (
    await handleTx(markup, spectrr.createSaleOffer, [
      `${sellingAmount * 10 ** getTokenDecimals(sellingId)}`,
      sellingId,
      `${exchangeRate * 10 ** getTokenDecimals(sellForId)}`,
      sellForId,
      repayInSeconds,
    ])
  ) {
    return true;
  } else {
    return false;
  }
}

async function createBuyOffer(
  buyingAmount,
  buyingId,
  exchangeRate,
  buyForId,
  collateralId,
  repayInSeconds,
  markup
) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (
    await handleTx(markup, spectrr.createBuyOffer, [
      `${buyingAmount * 10 ** getTokenDecimals(buyingId)}`,
      buyingId,
      `${exchangeRate * 10 ** getTokenDecimals(buyForId)}`,
      buyForId,
      collateralId,
      repayInSeconds,
    ])
  ) {
    return true;
  } else {
    return false;
  }
}

async function acceptSaleOffer(markup, offerId, collateralId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (
    await handleTx(markup, spectrr.acceptSaleOffer, [offerId, collateralId])
  ) {
    return true;
  } else {
    return false;
  }
}

async function acceptBuyOffer(markup, offerId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (await handleTx(markup, spectrr.acceptBuyOffer, [offerId])) {
    return true;
  } else {
    return false;
  }
}

async function cancelSaleOffer(markup, offerId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (await handleTx(markup, spectrr.cancelSaleOffer, [offerId])) {
    return true;
  } else {
    return false;
  }
}

async function cancelBuyOffer(markup, offerId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (await handleTx(markup, spectrr.cancelBuyOffer, [offerId])) {
    return true;
  } else {
    return false;
  }
}

async function forfeitSaleOffer(markup, offerId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (await handleTx(markup, spectrr.forfeitSaleOffer, [offerId])) {
    return true;
  } else {
    return false;
  }
}

async function forfeitBuyOffer(markup, offerId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (await handleTx(markup, spectrr.forfeitBuyOffer, [offerId])) {
    return true;
  } else {
    return false;
  }
}

async function repaySaleOffer(markup, offerId, repayAmount, repayTokenId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (repayAmount == "") {
    if (await handleTx(markup, spectrr.repaySaleOffer, [offerId])) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      await handleTx(markup, spectrr.repaySaleOfferPart, [
        offerId,
        `${repayAmount * 10 ** getTokenDecimals(repayTokenId)}`,
      ])
    ) {
      return true;
    } else {
      return false;
    }
  }
}

async function repayBuyOffer(markup, offerId, repayAmount, repayTokenId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (repayAmount == "") {
    if (await handleTx(markup, spectrr.repayBuyOffer, [offerId])) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      await handleTx(markup, spectrr.repayBuyOfferPart, [
        offerId,
        `${repayAmount * 10 ** getTokenDecimals(repayTokenId)}`,
      ])
    ) {
      return true;
    } else {
      return false;
    }
  }
}

async function addCollateralSaleOffer(markup, offerId, amount, amountId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (
    await handleTx(markup, spectrr.addCollateralSaleOffer, [
      offerId,
      `${amount * 10 ** getTokenDecimals(amountId)}`,
    ])
  ) {
    return true;
  } else {
    return false;
  }
}

async function addCollateralBuyOffer(markup, offerId, amount, amountId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (
    await handleTx(markup, spectrr.addCollateralBuyOffer, [
      offerId,
      `${amount * 10 ** getTokenDecimals(amountlId)}`,
    ])
  ) {
    return true;
  } else {
    return false;
  }
}

async function changeAddrSaleOffer(markup, offerId, newAddr, addrType) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (
    await handleTx(markup, spectrr.changeAddressSale, [
      offerId,
      newAddr,
      addrType,
    ])
  ) {
    return true;
  } else {
    return false;
  }
}

async function changeAddrBuyOffer(markup, offerId, newAddr, addrType) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (
    await handleTx(markup, spectrr.changeAddressBuy, [
      offerId,
      newAddr,
      addrType,
    ])
  ) {
    return true;
  } else {
    return false;
  }
}

async function liquidateSaleOffer(markup, offerId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (await handleTx(markup, spectrr.liquidateSaleOffer, [offerId])) {
    return true;
  } else {
    return false;
  }
}

async function liquidateBuyOffer(markup, offerId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (await handleTx(markup, spectrr.liquidateBuyOffer, [offerId])) {
    return true;
  } else {
    return false;
  }
}

async function approveAllowance(tokenId, approveAmount, markup) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  let token = tokenIdToContract(tokenId);
  let multiplier = bigNumber.from(10).pow(getTokenDecimals(tokenId));

  approveAmount =
    approveAmount == ""
      ? `${bigNumber.from(1000000).mul(multiplier)}`
      : `${bigNumber.from(approveAmount).mul(multiplier)}`;

  if (
    await handleTx(markup, token.approve, [
      addrSpectrr,
      approveAmount.toString(),
    ])
  ) {
    return true;
  } else {
    return false;
  }
}

async function revokeAllowance(tokenId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  let token = tokenIdToContract(tokenId);

  if (await handleTx("", token.approve, [addrSpectrr, "0"])) {
    return true;
  } else {
    return false;
  }
}

async function checkAllowance(tokenId, amount) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  let token = tokenIdToContract(tokenId);

  if (
    amount * 10 ** getTokenDecimals(tokenId) >
    (await token.allowance(await getSenderAddr(), addrSpectrr))
  ) {
    return false;
  } else {
    return true;
  }
}

async function checkBalance(tokenId, amount) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  let token = tokenIdToContract(tokenId);

  if (
    amount >
    toEther(await token.balanceOf(await getSenderAddr())) *
      10 ** (18 - getTokenDecimals(tokenId))
  ) {
    return false;
  } else {
    return true;
  }
}

async function handleTx(markup, fn, args) {
  if (markup != "") {
    if ((await createOfferPrompt(markup)) === true) {
      if (await tryTx(fn, args)) {
        return true;
      } else {
        return false;
      }
    } else {
      // create_res_prompt("Tx canceled by user");
    }
  } else {
    if (await tryTx(fn, args)) {
      return true;
    } else {
      return false;
    }
  }
}

async function tryTx(fn, args) {
  try {
    var tx;
    const argsLen = args.length;

    if (argsLen == 1) {
      tx = await fn(args[0]);
    } else if (argsLen == 2) {
      tx = await fn(args[0], args[1]);
    } else if (argsLen == 3) {
      tx = await fn(args[0], args[1], args[2]);
    } else if (argsLen == 5) {
      tx = await fn(args[0], args[1], args[2], args[3], args[4]);
    } else if (argsLen == 6) {
      tx = await fn(args[0], args[1], args[2], args[3], args[4], args[5]);
    }

    let txUrl = chainScanUrl + tx.hash;
    let txMarkup = `<p>Transaction at:</p><a id="txlink" target="_blank" href="${txUrl}">${txUrl.slice(
      0,
      50
    )}...</a> `;

    createResponsePrompt(txMarkup);
    return true;
  } catch (err) {
    console.log(err);
    if (err.code == "ACTION_REJECTED" || err.code == 4001) {
      createResponsePrompt("Transaction denied in wallet");
    } else if (err.code == -32603) {
      createResponsePrompt(
        "Transaction Underpriced! Try higher Gas/Price Limits."
      );
    } else {
      createResponsePrompt(err.reason);
    }
    // -32603 code for erc20 insufficient balance
    return false;
  }
}

function tokenChoiceToId(tokenChoice) {
  if (tokenChoice[0] == "ftm") {
    return "1";
  } else if (tokenChoice[0] == "btc") {
    return "2";
  } else if (tokenChoice[0] == "eth") {
    return "3";
  } else if (tokenChoice[0] == "usdc") {
    return "4";
  } else if (tokenChoice[0] == "link") {
    return "5";
  } else if (tokenChoice[0] == "bnb") {
    return "6";
  } else {
    throw "Invalid Choice";
  }
}

async function checkEthereumAndWallet() {
  if (typeof window.ethereum == "undefined") {
    createResponsePrompt("Please Install a Web3 Wallet");
    return false;
  }

  if ((await getWallet()) == false) {
    createResponsePrompt("Your Wallet is Locked or Not Connected.");
    return false;
  }
}
