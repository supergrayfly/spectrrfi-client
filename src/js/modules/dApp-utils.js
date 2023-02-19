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
      toWei(sellingAmount),
      sellingId,
      toWei(exchangeRate),
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
      toWei(buyingAmount),
      buyingId,
      toWei(exchangeRate),
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

async function repaySaleOffer(markup, offerId, repayAmount) {
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
      await handleTx(markup, spectrr.repaySaleOfferPart, [offerId, repayAmount])
    ) {
      return true;
    } else {
      return false;
    }
  }
}

async function repayBuyOffer(markup, offerId, repayAmount) {
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
      await handleTx(markup, spectrr.repayBuyOfferPart, [offerId, repayAmount])
    ) {
      return true;
    } else {
      return false;
    }
  }
}

async function addCollateralSaleOffer(markup, offerId, amount) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (
    await handleTx(markup, spectrr.addCollateralSaleOffer, [offerId, amount])
  ) {
    return true;
  } else {
    return false;
  }
}

async function addCollateralBuyOffer(markup, offerId, amount) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  if (
    await handleTx(markup, spectrr.addCollateralBuyOffer, [offerId, amount])
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

  approveAmount = approveAmount == "" ? toWei("1000000") : toWei(ApproveAmount);

  if (await handleTx(markup, token.approve, [addrSpectrr, approveAmount])) {
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

	let allowance = await ((tokenIdToContract(tokenId)).allowance(await getSenderAddr(), addrSpectrr));

  if (amount > allowance) {
    return false;
  } else {
    return true;
  }
}

async function checkBalance(tokenId, amount) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }
	
	let balance = await ((tokenIdToContract(tokenId)).balanceOf(await getSenderAddr()));

	if (amount > balance) {
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
    if (err.code == ("ACTION_REJECTED" || 4001)) {
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
  if (tokenChoice.contains(chainName.toLowerCase())) {
    return "1";
  } else if (tokenChoice[0] == "btc") {
    return "2";
  } else if (tokenChoice[0] == "eth") {
    return "3";
  } else if (tokenChoice[0] == "usdt") {
    return "4";
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
