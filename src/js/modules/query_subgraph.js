const actionsMarkupHomeSale =
  '<button class="accept-offer-sale" style="line-height: 1px; margin-bottom: 0">Accept</button>';
const actionsMarkupHomeBuy =
  '<button class="accept-offer-buy" style="line-height: 1px; margin-bottom: 0">Accept</button>';
const actionsMarkupLiquidateSale =
  '<button class="liquidate-offer-sale" style="line-height: 1px; margin-bottom: 0">Liquidate</button>';
const actionsMarkupLiquidateBuy =
  '<button class="liquidate-offer-buy" style="line-height: 1px">Liquidate</button>';
const actionsMarkupPostedSale =
  '<details role="list" style="margin-bottom: 0"> <summary aria-haspopup="listbox" role="button" style="line-height: 1px; padding-bottom: 0;">Actions</summary><ul role="listbox"class="actions-dropdown" style="background-color: #1095c1; margin-top: 3px"><li style="padding: 3px 0; margin-top: 0;"><button class="cancel-offer-sale">Cancel</button></li><li style="padding: 3px 0; margin-bottom: 0"><button class="liquidate-offer-sale">Liquidate</button></li><li style="padding: 3px 0; margin-bottom: 0"><button class="change-addr-offer-sale" style="white-space: normal; padding: 3px 0; line-height: 15px;">Change Addr.</button></li></ul></details>';
const actionsMarkupAcceptedSale =
  '<details role="list" style="margin-bottom: 0"> <summary aria-haspopup="listbox" role="button" style="line-height: 1px; padding-bottom: 0;">Actions</summary><ul role="listbox"class="actions-dropdown" style="background-color: #1095c1; margin-top: 3px"><li style="padding: 3px 0; margin-top: 0;"><button class="repay-offer-sale">Repay</button></li><li style="padding: 3px 0;"><button class="add-collateral-offer-sale" style="white-space: normal; padding: 3px 0; line-height: 30px;">Add Collat.</button></li><li style="padding: 3px 0; margin-bottom: 0"><button class="forfeit-offer-sale">Forfeit</button></li><li style="padding: 3px 0; margin-bottom: 0"><button class="change-addr-offer-sale" style="white-space: normal; padding: 3px 0; line-height: 15px;">Change Addr.</button></li></ul></details>';
const actionsMarkupPostedBuy =
  '<details role="list" style="margin-bottom: 0"> <summary aria-haspopup="listbox" role="button" style="line-height: 1px; padding-bottom: 0;">Actions</summary><ul role="listbox"class="actions-dropdown" style="background-color: #1095c1; margin-top: 3px"><li style="padding: 3px 0; margin-top: 0;"><button class="repay-offer-buy">Repay</button></li><li style="padding: 3px 0; margin-bottom: 0"><button class="cancel-offer-buy">Cancel</button></li><li style="padding: 3px 0; margin-bottom: 0"><button class="forfeit-offer-buy">Forfeit</button></li><li style="padding: 3px 0;"><button class="add-collateral-offer-buy" style="white-space: normal; padding: 3px 0; line-height: 30px;">Add Collat.</button></li><li style="padding: 3px 0; margin-bottom: 0"><button class="change-addr-offer-buy" style="white-space: normal; padding: 3px 0; line-height: 15px;">Change Addr.</button></li></ul></details>';
const actionsMarkupAcceptedBuy =
  '<details role="list" style="margin-bottom: 0"><summary aria-haspopup="listbox" role="button" style="line-height: 1px; padding-bottom: 0">Actions</summary><ul role="listbox"class="actions-dropdown" style="background-color: #1095c1; margin-top: 3px"><li style="padding: 3px 0; margin-bottom: 0"><button class="liquidate-offer-buy">Liquidate</button></li><li style="padding: 3px 0; margin-bottom: 0"><button class="change-addr-offer-sale" style="white-space: normal; padding: 3px 0; line-height: 15px;">Change Addr.</button></li></ul></details>';

// Query The Graph for offers
async function getOffers(offerType, args, actionsMarkup, appendTo, tableType) {
  if (offerType == 0) {
    let _appendTo = document.getElementById(appendTo);
    try {
      _appendTo.parentElement.children[0].setAttribute("aria-busy", "true");
      let data = await queryData(offerType, args);

      _appendTo.innerHTML = "";

      if (data.saleOffers.length == 0) {
        if (tableType == 0) {
          _appendTo.insertAdjacentHTML(
            "beforeend",
            "<tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>"
          );
          return;
        } else {
          _appendTo.insertAdjacentHTML(
            "beforeend",
            "<tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>"
          );
          return;
        }
      } else {
        if (tableType === 0) {
          appendDataSaleOffer(data.saleOffers, actionsMarkup, appendTo);
        } else {
          appendDataSaleOfferHome(data.saleOffers, actionsMarkup, appendTo);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      _appendTo.parentElement.children[0].setAttribute("aria-busy", "false");
    }
  } else if (offerType == 1) {
    let _appendTo = document.getElementById(appendTo);
    try {
      _appendTo.parentElement.children[0].setAttribute("aria-busy", "true");
      let data = await queryData(offerType, args);

      _appendTo.innerHTML = "";

      if (data.buyOffers.length == 0) {
        if (tableType == 0) {
          _appendTo.insertAdjacentHTML(
            "beforeend",
            "<tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>"
          );
          return;
        } else {
          _appendTo.insertAdjacentHTML(
            "beforeend",
            "<tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>"
          );
          return;
        }
      } else {
        if (tableType === 0) {
          appendDataBuyOffer(data.buyOffers, actionsMarkup, appendTo);
        } else {
          appendDataBuyOfferHome(data.buyOffers, actionsMarkup, appendTo);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      _appendTo.parentElement.children[0].setAttribute("aria-busy", "false");
    }
  } else {
    throw "Invalid offer type";
  }
}

// offerType: 0 for sale offer, 1 for buy offer
async function queryData(offerType, args) {
  let offerPrefix = "";
  let offerTypeStr = "";

  if (offerType == 0) {
    offerPrefix = "sell";
    offerTypeStr = "saleOffers";
  } else if (offerType == 1) {
    offerPrefix = "buy";
    offerTypeStr = "buyOffers";
  } else {
    throw "Invalid offer type";
  }

  let query = `{
		${offerTypeStr}( ${args} ) {
			id
			${offerPrefix}ing
			${offerPrefix}ingId
			${offerPrefix}For
			${offerPrefix}ForId
			collateral
			collateralId
			timeAccepted
			exchangeRate
			seller
			buyer
			status
			repayInSec
		}
	}`;

  console.log("Fetching data...");
  console.log("#########");

  try {
    let data = await axios.post(subgraphApiUrl, { query });
    console.log("Fetched data!");
    console.log("#########");
    return data.data.data;
  } catch (err) {
    console.log("Failed to fetch data:");
    console.log(
      `Error Code: ${err.code}\nError Message: ${err.message}\nError Name: ${err.name}`
    );
    console.log("#########");
  }
}

// append data to home tables
async function appendDataSaleOfferHome(data, actionsMarkup, appendTo) {
  data.forEach((offer) => {
    // console.log(offer);
    let deadline = formatSeconds(offer.repayInSec);

    appendOffersSaleHomeToHTML(
      offer.id,
      offer.selling,
      offer.sellingId,
      offer.sellFor,
      offer.sellForId,
      deadline,
      offer.exchangeRate,
      actionsMarkup,
      appendTo
    );
  });
}

async function appendDataBuyOfferHome(data, actionsMarkup, appendTo) {
  data.forEach((offer) => {
    // console.log(offer);

    let deadline = formatSeconds(offer.repayInSec);
    let ratio = getRatio(
      toEther(offer.collateral),
      offer.collateralId,
      toEther(offer.buyFor),
      offer.buyForId
    );

    appendOffersBuyHomeToHTML(
      offer.id,
      offer.buying,
      offer.buyingId,
      offer.buyFor,
      offer.buyForId,
      offer.collateralId,
      deadline,
      ratio,
      offer.exchangeRate,
      actionsMarkup,
      appendTo
    );
  });
}

function appendOffersSaleHomeToHTML(
  offerId,
  offerAmount,
  offerAmountId,
  offerAmountFor,
  offerAmountForId,
  offerRepayDeadline,
  offerExchangeRate,
  actionsMarkup,
  appendTo
) {
  let marketRate = getExchangeRate(offerAmountId, offerAmountForId);
  let rateDiff = getRateDiff(toEther(offerExchangeRate), marketRate)[0];

  document
    .getElementById(`${appendTo}`)
    .insertAdjacentHTML(
      "beforeend",
      "<tr><td>" +
        offerId +
        `</td><td><div class='td-token-logo' data-tooltip='${tokenIdToNameLong(
          offerAmountId
        )}' data-placement='top' style='border-bottom: none;'>` +
        formatAmount(Number(round(toEther(offerAmount), 100000, 3))) +
        `<img src='${tokenIdToLogo(
          offerAmountId
        )}' style='border-bottom: 1px dotted;'/>` +
        `</div></td><td><div class='td-token-logo' data-tooltip='${tokenIdToNameLong(
          offerAmountForId
        )}' style="border-bottom: none">` +
        formatAmount(Number(round(toEther(offerAmountFor), 100000, 3))) +
        `<img src='${tokenIdToLogo(
          offerAmountForId
        )}' style="border-bottom: 1px dotted"/>` +
        "</td><td>" +
        offerRepayDeadline +
        "</td><td>" +
        formatAmount(Number(round(toEther(offerExchangeRate), 100000, 3))) +
        " " +
        tokenIdToName(offerAmountForId) +
        "/" +
        tokenIdToName(offerAmountId) +
        ` (${rateDiff})` +
        `</td><td>${actionsMarkup}</td></tr>`
    );
}

function appendOffersBuyHomeToHTML(
  offerId,
  offerAmount,
  offerAmountId,
  offerAmountFor,
  offerAmountForId,
  offerCollateralId,
  offerRepayDeadline,
  offerRatio,
  offerExchangeRate,
  actionsMarkup,
  appendTo
) {
  let marketRate = getExchangeRate(offerAmountId, offerAmountForId);
  let rateDiff = getRateDiff(toEther(offerExchangeRate), marketRate)[0];

  document
    .getElementById(`${appendTo}`)
    .insertAdjacentHTML(
      "beforeend",
      "<tr><td>" +
        offerId +
        `</td><td><div class='td-token-logo' data-tooltip='${tokenIdToNameLong(
          offerAmountId
        )}' data-placement='top' style='border-bottom: none;'>` +
        formatAmount(Number(round(toEther(offerAmount), 100000, 3))) +
        `<img src='${tokenIdToLogo(
          offerAmountId
        )}' style='border-bottom: 1px dotted;'/>` +
        `</div></td><td><div class='td-token-logo' data-tooltip='${tokenIdToNameLong(
          offerAmountForId
        )}' data-placement='top' style='border-bottom: none;'>` +
        formatAmount(Number(round(toEther(offerAmountFor), 100000, 3))) +
        `<img src='${tokenIdToLogo(
          offerAmountForId
        )}' style="border-bottom: 1px dotted"/>` +
        "</td><td>" +
        offerRepayDeadline +
        `</td><td><div class='td-token-logo-collateral' data-tooltip='${tokenIdToNameLong(
          offerAmountForId
        )}' data-placement='top' style='border-bottom: none;'>` +
        `${round(offerRatio, 10000, 3)}%` +
        `<a>(<img src='${tokenIdToLogo(
          offerCollateralId
        )}' style="border-bottom: 1px dotted"/>)</a>` +
        "</div></td><td>" +
        formatAmount(Number(round(toEther(offerExchangeRate), 100000, 3))) +
        " " +
        tokenIdToName(offerAmountForId) +
        "/" +
        tokenIdToName(offerAmountId) +
        ` (${rateDiff})` +
        `</td><td>${actionsMarkup}</td></tr>`
    );
}

async function appendDataSaleOffer(data, actionsMarkup, appendTo) {
  data.forEach((offer) => {
    // console.log(offer);

    let deadline = getOfferRepayDeadline(offer.timeAccepted, offer.repayInSec);
    let ratio =
      offer.status == 1
        ? getRatio(
            toEther(offer.collateral),
            offer.collateralId,
            toEther(offer.sellFor),
            offer.sellForId
          )
        : 0;

    appendOffersToHTML(
      offer.id,
      offer.selling,
      offer.sellingId,
      offer.sellFor,
      offer.sellForId,
      offer.collateralId,
      deadline,
      offer.status,
      ratio,
      offer.exchangeRate,
      actionsMarkup,
      appendTo
    );
  });
}

async function appendDataBuyOffer(data, actionsMarkup, appendTo) {
  data.forEach((offer) => {
    // console.log(offer);

    let deadline = getOfferRepayDeadline(offer.timeAccepted, offer.repayInSec);
    let ratio = getRatio(
      toEther(offer.collateral),
      offer.collateralId,
      toEther(offer.buyFor),
      offer.buyForId
    );

    appendOffersToHTML(
      offer.id,
      offer.buying,
      offer.buyingId,
      offer.buyFor,
      offer.buyForId,
      offer.collateralId,
      deadline,
      offer.status,
      ratio,
      offer.exchangeRate,
      actionsMarkup,
      appendTo
    );
  });
}

function appendOffersToHTML(
  offerId,
  offerAmount,
  offerAmountId,
  offerAmountFor,
  offerAmountForId,
  offerCollateralId,
  offerRepayDeadline,
  offerStatus,
  offerRatio,
  offerExchangeRate,
  actionsMarkup,
  appendTo
) {
  let marketRate = getExchangeRate(offerAmountId, offerAmountForId);
  let rateDiff = getRateDiff(toEther(offerExchangeRate), marketRate)[0];

  const collateralRatioMarkup =
    offerCollateralId != null
      ? `<a>(<img src='${tokenIdToLogo(
          offerCollateralId
        )}' style='border-bottom: 1px dotted'/>)</a>`
      : "";

  document
    .getElementById(`${appendTo}`)
    .insertAdjacentHTML(
      "beforeend",
      "<tr><td>" +
        offerId +
        `</td><td><div class='td-token-logo' data-tooltip='${tokenIdToNameLong(
          offerAmountId
        )}' data-placement='top' style='border-bottom: none;'>` +
        formatAmount(Number(round(toEther(offerAmount), 100000, 3))) +
        `<img src='${tokenIdToLogo(
          offerAmountId
        )}' style="border-bottom: 1px dotted"/>` +
        `</div></td><td><div class='td-token-logo' data-tooltip='${tokenIdToNameLong(
          offerAmountForId
        )}' style="border-bottom: none">` +
        formatAmount(Number(round(toEther(offerAmountFor), 100000, 3))) +
        `<img src='${tokenIdToLogo(
          offerAmountForId
        )}' style="border-bottom: 1px dotted"/>` +
        "</td><td>" +
        offerRepayDeadline +
        "</td><td>" +
        formatOfferStatus(offerStatus) +
        `</td><td><div class='td-token-logo-collateral' data-tooltip='${tokenIdToNameLong(
          offerAmountForId
        )}' data-placement='top' style='border-bottom: none;'>` +
        `${round(offerRatio, 10000, 3)}%` +
        `${collateralRatioMarkup}` +
        "</div></td><td>" +
        isLiquidable(offerRepayDeadline, offerRatio) +
        "</td><td>" +
        formatAmount(Number(round(toEther(offerExchangeRate), 100000, 3))) +
        " " +
        tokenIdToName(offerAmountForId) +
        "/" +
        tokenIdToName(offerAmountId) +
        ` (${rateDiff})` +
        `</td><td>${actionsMarkup}</td></tr>`
    );
}

async function getSaleOfferInfo(offerId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  try {
    let offer = await spectrr.saleOffers(offerId);
    if (offer.offerId == 0) {
      return false;
    } else {
      return parseSaleOfferDataFromHex(offer);
    }
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

async function getBuyOfferInfo(offerId) {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  try {
    let offer = await spectrr.buyOffers(offerId);
    if (offer.offerId == 0) {
      return false;
    } else {
      return parseBuyOfferDataFromHex(offer);
    }
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

function parseSaleOfferDataFromHex(offer) {
  return {
    status: offer[0].toString(),
    id: offer[2].toString(),
    selling: offer[3].toString(),
    sellFor: offer[4].toString(),
    collateral: offer[5].toString(),
    repayInSec: offer[6].toString(),
    timeAccepted: offer[7].toString(),
    sellingId: offer[8].toString(),
    sellForId: offer[9].toString(),
    collateralId: offer[10].toString(),
    seller: offer[11].toString(),
    buyer: offer[12].toString(),
  };
}

function parseBuyOfferDataFromHex(offer) {
  return {
    status: offer[0],
    id: offer[2].toString(),
    buying: offer[3].toString(),
    buyFor: offer[4].toString(),
    collateral: offer[5].toString(),
    repayInSec: offer[6].toString(),
    timeAccepted: offer[7].toString(),
    buyingId: offer[8].toString(),
    buyForId: offer[9].toString(),
    collateralId: offer[10].toString(),
    buyer: offer[11].toString(),
    seller: offer[12].toString(),
  };
}

function addEventListenerToBtnSale(
  buttonClass,
  redirectTo,
  offerIdField,
  clickConfirm
) {
  document.querySelectorAll(buttonClass).forEach((item) => {
    item.addEventListener("click", () => {
      let offerId =
        item.closest("td").parentElement.firstElementChild.innerText;

      document.getElementById("goto-offers").click();
      document.getElementById(redirectTo).click();
      document.getElementById(offerIdField).value = offerId;

      if (clickConfirm != "") {
        document.getElementById(clickConfirm).click();
      }
    });
  });
}

function addEventListenerToBtnBuy(
  buttonClass,
  redirectTo,
  switchToBuy,
  offerIdField,
  clickConfirm
) {
  document.querySelectorAll(buttonClass).forEach((item) => {
    item.addEventListener("click", () => {
      let offerId =
        item.closest("td").parentElement.firstElementChild.innerText;

      document.getElementById("goto-offers").click();
      document.getElementById(redirectTo).click();
      switchToBuy.click();

      document.getElementById(offerIdField).value = offerId;

      if (clickConfirm != "") {
        document.getElementById(clickConfirm).click();
      }
    });
  });
}
