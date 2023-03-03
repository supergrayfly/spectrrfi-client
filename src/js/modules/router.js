// toggle offer actions button color when clicked
// reset colors when offers buttin is clicked
document.querySelectorAll(".offer-actions").forEach((item, index, arr) => {
  item.addEventListener("click", () => {
    arr.forEach((item) => {
      item.classList.remove("contrast");
    });

    item.classList.add("contrast");
  });
});

// toggle sale/buy offer button color when clicked
document.querySelectorAll(".toggle-sale-buy").forEach((item, index, arr) => {
  item.children[0].addEventListener("click", () => {
    item.children[0].classList.replace("secondary", "contrast");
    item.children[1].classList.replace("contrast", "secondary");
  });

  item.children[1].addEventListener("click", () => {
    item.children[1].classList.replace("secondary", "contrast");
    item.children[0].classList.replace("contrast", "secondary");
  });
});

// toggle dark & light theme
document.getElementById("dark").addEventListener("click", () => {
  document.documentElement.dataset.theme = "dark";
});

document.getElementById("light").addEventListener("click", () => {
  document.documentElement.dataset.theme = "light";
});

function listenAcceptOffer(offerType) {
  if (offerType === 0) {
    addEventListenerToBtnSale(
      ".accept-offer-sale",
      "goto-accept",
      "accept-sale-offer-id",
      0,
      ""
    );
  } else {
    addEventListenerToBtnBuy(
      ".accept-offer-buy",
      "goto-accept",
      switchAcceptBuy,
      "accept-buy-offer-id",
      0,
      "confirm-accept-buy"
    );
  }
}

function listenLiquidateOffer(offerType) {
  if (offerType === 0) {
    addEventListenerToBtnSale(
      ".liquidate-offer-sale",
      "goto-liquidate-applet",
      "liquidate-sale-offer-id",
      0,
      "confirm-liquidate-sale-offer"
    );
  } else {
    addEventListenerToBtnBuy(
      ".liquidate-offer-buy",
      "goto-liquidate-applet",
      switchLiquidateBuy,
      "liquidate-buy-offer-id",
      0,
      "confirm-liquidate-buy-offer"
    );
  }
}

function listenAddCollateral(offerType) {
  if (offerType === 0) {
    addEventListenerToBtnSale(
      ".add-collateral-offer-sale",
      "goto-add-collateral",
      "add-collateral-sale-id",
      0,
      ""
    );
  } else {
    addEventListenerToBtnBuy(
      ".add-collateral-offer-buy",
      "goto-add-collateral",
      switchAddCollateralBuy,
      "add-collateral-buy-id",
      0,
      ""
    );
  }
}

function listenForfeitOffer(offerType) {
  if (offerType === 0) {
    addEventListenerToBtnSale(
      ".forfeit-offer-sale",
      "goto-forfeit",
      "forfeit-sale-offer-id",
      0,
      "confirm-forfeit-sale-offer"
    );
  } else {
    addEventListenerToBtnBuy(
      ".forfeit-offer-buy",
      "goto-forfeit",
      switchForfeitBuy,
      "forfeit-buy-offer-id",
      0,
      "confirm-forfeit-buy-offer"
    );
  }
}

function listenCancelOffer(offerType) {
  if (offerType === 0) {
    addEventListenerToBtnSale(
      ".cancel-offer-sale",
      "goto-cancel",
      "cancel-sale-offer-id",
      1,
      "confirm-cancel-sale-offer"
    );
    addEventListenerToBtnSale(
      ".liquidate-offer-sale",
      "goto-liquidate-applet",
      "liquidate-sale-offer-id",
      1,
      "confirm-liquidate-sale-offer"
    );
    addEventListenerToBtnSale(
      ".change-addr-offer-sale",
      "goto-change-addr",
      "change-addr-sale-id",
      1,
      ""
    );
  } else {
    addEventListenerToBtnBuy(
      ".cancel-offer-buy",
      "goto-cancel",
      switchCancelBuy,
      "cancel-buy-offer-id",
      1,
      "confirm-cancel-buy-offer"
    );
    addEventListenerToBtnBuy(
      ".liquidate-offer-buy",
      "goto-liquidate-applet",
      switchLiquidateBuy,
      "liquidate-buy-offer-id",
      1,
      "confirm-liquidate-buy-offer"
    );
    addEventListenerToBtnBuy(
      ".change-addr-offer-buy",
      "goto-change-addr",
      switchChangeAddrBuy,
      "change-addr-buy-id",
      1,
      ""
    );
  }
}

function listenRepayOffer(offerType) {
  if (offerType === 0) {
    addEventListenerToBtnSale(
      ".repay-offer-sale",
      "goto-repay",
      "repay-sale-offer-id",
      0,
      ""
    );
  } else {
    addEventListenerToBtnBuy(
      ".repay-offer-buy",
      "goto-repay",
      switchRepayBuy,
      "repay-buy-offer-id",
      0,
      ""
    );
  }
}

function listenAcceptedTable(offerType) {
  if (offerType === 0) {
    addEventListenerToBtnSale(
      ".repay-offer-sale",
      "goto-repay",
      "repay-sale-offer-id",
      1,
      ""
    );
    addEventListenerToBtnSale(
      ".add-collateral-offer-sale",
      "goto-add-collateral",
      "add-collateral-sale-id",
      1,
      ""
    );
    addEventListenerToBtnSale(
      ".forfeit-offer-sale",
      "goto-forfeit",
      "forfeit-sale-offer-id",
      1,
      "confirm-forfeit-sale-offer"
    );
    addEventListenerToBtnSale(
      ".change-addr-offer-sale",
      "goto-change-addr",
      "change-addr-sale-id",
      1,
      ""
    );
  } else {
    addEventListenerToBtnBuy(
      ".repay-offer-buy",
      "goto-repay",
      switchRepayBuy,
      "repay-buy-offer-id",
      1,
      ""
    );
    addEventListenerToBtnBuy(
      ".add-collateral-offer-buy",
      "goto-add-collateral",
      switchAddCollateralBuy,
      "add-collateral-buy-id",
      1,
      ""
    );
    addEventListenerToBtnBuy(
      ".forfeit-offer-buy",
      "goto-forfeit",
      switchForfeitBuy,
      "forfeit-buy-offer-id",
      1,
      "confirm-forfeit-buy-offer"
    );
    addEventListenerToBtnBuy(
      ".change-addr-offer-buy",
      "goto-change-addr",
      switchChangeAddrBuy,
      "change-addr-buy-id",
      1,
      ""
    );
  }
}

// Fill token selection with token name after clicking
document.querySelectorAll(".token").forEach((item) => {
  item.addEventListener("click", (evt) => {
    evt.preventDefault();
    /*
		item.parentElement.parentElement.previousElementSibling.innerHTML =
      item.innerHTML;
    item.parentElement.parentElement.parentElement.removeAttribute("open");
		*/
		item.closest('details').firstElementChild.innerHTML = item.innerHTML;
		item.closest('details').removeAttribute("open");
  });
});

// Route through sections of page
gotoHomeBtn.addEventListener("click", async () => {
  displaySection(home, "100%", 0);

  await getOffersHome();

  listenAcceptOffer(0);
  listenAcceptOffer(1);
});

gotoOffersBtn.addEventListener("click", async () => {
  displaySection(create, "100px 700px", 1);

  document.querySelectorAll(".offer-actions").forEach((item) => {
    item.classList.remove("contrast");
  });

  document.getElementsByClassName("offer-actions")[0].classList.add("contrast");
});

// TODO: give user possibility to filter query
gotoBrowseBtn.addEventListener("click", async () => {
  displaySection(browse, "100%", 0);

  await getOffers(
    0,
    `first: ${OFFERS_TBL_BIG}, where: { status: 0 }, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupHomeSale,
    browseSaleOffersTblBody.id,
    0
  );

  listenAcceptOffer(0);

  await getOffers(
    1,
    `first: ${OFFERS_TBL_BIG}, where: { status: 0 }, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupHomeBuy,
    browseBuyOffersTblBody.id,
    0
  );

  listenAcceptOffer(1);
});

gotoLiquidateBtn.addEventListener("click", async () => {
  displaySection(liquidate, "100%", 0);

  await getOffers(
    0,
    `first: ${OFFERS_TBL_BIG}, where: { status: 1 }, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupLiquidateSale,
    liquidateSaleOffersTblBody.id,
    0
  );

  listenLiquidateOffer(0);

  await getOffers(
    1,
    `first: ${OFFERS_TBL_BIG}, where: { status: 1 }, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupLiquidateBuy,
    liquidateBuyOffersTblBody.id,
    0
  );

  listenLiquidateOffer(1);
});

gotoDashboardBtn.addEventListener("click", async () => {
  displaySection(dashboard, "100%", 0);

  let sender = await getSenderAddr();

  if (dashboardSaleOffersTbl.style.display == "") {
    if (dashboardSalePostedOffersTbl.style.display == "") {
      await getOffers(
        0,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, seller: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupPostedSale,
        dashboardPostedSaleOffersTblBody.id,
        0
      );

      listenCancelOffer(0);
    } else {
      await getOffers(
        0,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, buyer: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupAcceptedSale,
        dashboardAcceptedSaleOffersTblBody.id,
        0
      );

      listenAcceptedTable(0);
    }
  } else {
    if (dashboardBuyPostedOffersTbl.style.display == "") {
      await getOffers(
        1,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, buyer: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupPostedBuy,
        dashboardPostedBuyOffersTblBody.id,
        0
      );

      listenCancelOffer(1);
    } else {
      await getOffers(
        1,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, seller: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupAcceptedBuy,
        dashboardAcceptedBuyOffersTblBody.id,
        0
      );

      listenAcceptedTable(1);
    }
  }
});

gotoCreateBtn.addEventListener("click", () => {
  displayOffersSection(create);
});

gotoCancelBtn.addEventListener("click", () => {
  displayOffersSection(cancel);
});

gotoAcceptBtn.addEventListener("click", () => {
  displayOffersSection(accept);
});

gotoForfeitBtn.addEventListener("click", () => {
  displayOffersSection(forfeit);
});

gotoRepayBtn.addEventListener("click", () => {
  displayOffersSection(repay);
});

gotoAddCollateralBtn.addEventListener("click", () => {
  displayOffersSection(addCollateral);
});

gotoChangeAddrBtn.addEventListener("click", () => {
  displayOffersSection(changeAddr);
});

gotoApproveBtn.addEventListener("click", () => {
  displaySection(approve, "100%", 0);
});

gotoLiquidateAppletBtn.addEventListener("click", () => {
  displayOffersSection(liquidateApplet);
});

connectWalletBtn.addEventListener("click", async () => {
  await connectWallet();
});

connectToFantomTestnet.addEventListener("click", async () => {
  await connectNetwork(
    dataFtmTestnet.CHAIN_ID,
    dataFtmTestnet.CHAIN_NAME_LONG,
    dataFtmTestnet.CHAIN_NAME,
    dataFtmTestnet.CHAIN_SCAN_URL,
    dataFtmTestnet.CHAIN_RPC_URL
  );
});

connectToFtmOpera.addEventListener("click", async () => {
  await connectNetwork(
    dataFtm.CHAIN_ID,
    dataFtm.CHAIN_NAME_LONG,
    dataFtm.CHAIN_NAME,
    dataFtm.CHAIN_SCAN_URL,
    dataFtm.CHAIN_RPC_URL
  );
});

browseSwitchSaleOfferBtn.addEventListener("click", async () => {
  if (browseSaleOffersTbl.style.display == "none") {
    browseSaleOffersTbl.style.display = "";
    browseBuyOffersTbl.style.display = "none";
  }

  await getOffers(
    0,
    `first: ${OFFERS_TBL_BIG}, where: { status: 0 }, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupHomeSale,
    browseSaleOffersTblBody.id,
    0
  );

  listenAcceptOffer(0);
});

browseSwitchBuyOfferBtn.addEventListener("click", async () => {
  if (browseBuyOffersTbl.style.display == "none") {
    browseSaleOffersTbl.style.display = "none";
    browseBuyOffersTbl.style.display = "";
  }

  await getOffers(
    1,
    `first: ${OFFERS_TBL_BIG}, where: { status: 0 }, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupHomeBuy,
    browseBuyOffersTblBody.id,
    0
  );

  listenAcceptOffer(1);
});

liquidateSwitchSaleOfferBtn.addEventListener("click", async () => {
  if (liquidateSaleOffersTbl.style.display == "none") {
    liquidateSaleOffersTbl.style.display = "";
    liquidateBuyOffersTbl.style.display = "none";
  }

  await getOffers(
    0,
    `first: ${OFFERS_TBL_BIG}, where: { status: 1 }, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupLiquidateSale,
    liquidateSaleOffersTblBody.id,
    0
  );

  listenLiquidateOffer(0);
});

liquidateSwitchBuyOfferBtn.addEventListener("click", async () => {
  if (liquidateBuyOffersTbl.style.display == "none") {
    liquidateSaleOffersTbl.style.display = "none";
    liquidateBuyOffersTbl.style.display = "";
  }

  await getOffers(
    1,
    `first: ${OFFERS_TBL_BIG}, where: { status: 1 }, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupLiquidateBuy,
    liquidateBuyOffersTblBody.id,
    0
  );

  listenLiquidateOffer(1);
});

dashboardSwitchSaleOfferBtn.addEventListener("click", async () => {
  if (dashboardSaleOffersTbl.style.display == "none") {
    dashboardSaleOffersTbl.style.display = "";
    dashboardBuyOffersTbl.style.display = "none";
    dashboardToggleOfferTypeSale.style.display = "flex";
    dashboardToggleOfferTypeBuy.style.display = "none";

    let sender = await getSenderAddr();

    if (dashboardSalePostedOffersTbl.style.display == "") {
      await getOffers(
        0,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, seller: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupPostedSale,
        dashboardPostedSaleOffersTblBody.id,
        0
      );

      listenCancelOffer(0);
    } else {
      await getOffers(
        0,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, buyer: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupAcceptedSale,
        dashboardAcceptedSaleOffersTblBody.id,
        0
      );

      listenAcceptedTable(0);
    }
  }
});

dashboardSwitchBuyOfferBtn.addEventListener("click", async () => {
  if (dashboardBuyOffersTbl.style.display == "none") {
    dashboardSaleOffersTbl.style.display = "none";
    dashboardBuyOffersTbl.style.display = "";
    dashboardToggleOfferTypeSale.style.display = "none";
    dashboardToggleOfferTypeBuy.style.display = "flex";

    let sender = await getSenderAddr();

    if (dashboardBuyPostedOffersTbl.style.display == "") {
      await getOffers(
        1,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, buyer: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupPostedBuy,
        dashboardPostedBuyOffersTblBody.id,
        0
      );

      listenCancelOffer(1);
    } else {
      await getOffers(
        1,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, seller: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupAcceptedBuy,
        dashboardAcceptedBuyOffersTblBody.id,
        0
      );

      listenAcceptedTable(1);
    }
  }
});

dashboardSwitchToPostedSale.addEventListener("click", async () => {
  dashboardSalePostedOffersTbl.style.display = "";
  dashboardSaleAcceptedOffersTbl.style.display = "none";

  let sender = await getSenderAddr();

  await getOffers(
    0,
    `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, seller: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupPostedSale,
    dashboardPostedSaleOffersTblBody.id,
    0
  );

  listenCancelOffer(0);
});

dashboardSwitchToAcceptedSale.addEventListener("click", async () => {
  dashboardSalePostedOffersTbl.style.display = "none";
  dashboardSaleAcceptedOffersTbl.style.display = "";

  let sender = await getSenderAddr();

  await getOffers(
    0,
    `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, buyer: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupAcceptedSale,
    dashboardAcceptedSaleOffersTblBody.id,
    0
  );

  listenAcceptedTable(0);
});

dashboardSwitchToPostedBuy.addEventListener("click", async () => {
  dashboardBuyPostedOffersTbl.style.display = "";
  dashboardBuyAcceptedOffersTbl.style.display = "none";

  let sender = await getSenderAddr();

  await getOffers(
    1,
    `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, buyer: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupPostedBuy,
    dashboardPostedBuyOffersTblBody.id,
    0
  );

  listenAcceptedTable(1);
});

dashboardSwitchToAcceptedBuy.addEventListener("click", async () => {
  dashboardBuyPostedOffersTbl.style.display = "none";
  dashboardBuyAcceptedOffersTbl.style.display = "";

  let sender = await getSenderAddr();

  await getOffers(
    1,
    `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, seller: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkupAcceptedBuy,
    dashboardAcceptedBuyOffersTblBody.id,
    0
  );

  listenAcceptedTable(1);
});

// Navigate through offers in tables
gotoPreviousBrowseOffersSale.addEventListener("click", async () => {
  await gotoPreviousOffers(
    skip1,
    OFFERS_TBL_BIG,
    actionsMarkupHomeSale,
    browseSaleOffersTblBody.id,
    0,
    "status: 0"
  );

  listenAcceptOffer(0);
});

gotoNextBrowseOffersSale.addEventListener("click", async () => {
  await gotoNextOffers(
    skip1,
    OFFERS_TBL_BIG,
    actionsMarkupHomeSale,
    browseSaleOffersTblBody.id,
    0,
    "status: 0"
  );

  listenAcceptOffer(0);
});

gotoPreviousBrowseOffersBuy.addEventListener("click", async () => {
  await gotoPreviousOffers(
    skip2,
    OFFERS_TBL_BIG,
    actionsMarkupHomeBuy,
    browseBuyOffersTblBody.id,
    1,
    "status: 0"
  );

  listenAcceptOffer(1);
});

gotoNextBrowseOffersBuy.addEventListener("click", async () => {
  await gotoNextOffers(
    skip2,
    OFFERS_TBL_BIG,
    actionsMarkupHomeSale,
    browseBuyOffersTblBody.id,
    1,
    "status: 0"
  );

  listenAcceptOffer(1);
});

gotoPreviousLiquidateOffersSale.addEventListener("click", async () => {
  await gotoPreviousOffers(
    skip3,
    OFFERS_TBL_BIG,
    actionsMarkupLiquidateSale,
    liquidateSaleOffersTblBody.id,
    0,
    "status: 1"
  );

  listenLiquidateOffer(0);
});

gotoNextLiquidateOffersSale.addEventListener("click", async () => {
  await gotoNextOffers(
    skip3,
    OFFERS_TBL_BIG,
    actionsMarkupLiquidateSale,
    liquidateSaleOffersTblBody.id,
    0,
    "status: 1"
  );

  listenLiquidateOffer(0);
});

gotoPreviousLiquidateOffersBuy.addEventListener("click", async () => {
  await gotoPreviousOffers(
    skip4,
    OFFERS_TBL_BIG,
    actionsMarkupLiquidateBuy,
    liquidateBuyOffersTblBody.id,
    1,
    "status: 1"
  );

  listenLiquidateOffer(1);
});

gotoNextLiquidateOffersBuy.addEventListener("click", async () => {
  await gotoNextOffers(
    skip4,
    OFFERS_TBL_BIG,
    actionsMarkupLiquidateBuy,
    liquidateBuyOffersTblBody.id,
    1,
    "status: 1"
  );

  listenLiquidateOffer(1);
});

gotoPreviousPostedOffersSale.addEventListener("click", async () => {
  let sender = await getSenderAddr();

  await gotoPreviousOffers(
    skip5,
    OFFERS_TBL_BIG,
    actionsMarkupPostedSale,
    dashboardPostedSaleOffersTblBody.id,
    0,
    `status_not: 2, seller: "${sender}"`
  );

  listenCancelOffer(0);
});

gotoNextPostedOffersSale.addEventListener("click", async () => {
  let sender = await getSenderAddr();

  await gotoNextOffers(
    skip5,
    OFFERS_TBL_BIG,
    actionsMarkupPostedSale,
    dashboardPostedSaleOffersTblBody.id,
    0,
    `status_not: 2, seller: "${sender}"`
  );

  listenCancelOffer(0);
});

gotoPreviousPostedOffersBuy.addEventListener("click", async () => {
  let sender = await getSenderAddr();

  await gotoPreviousOffers(
    skip6,
    OFFERS_TBL_BIG,
    actionsMarkupPostedBuy,
    dashboardPostedBuyOffersTblBody.id,
    1,
    `status_not: 2, buyer: "${sender}"`
  );

  listenCancelOffer(1);
});

gotoNextPostedOffersBuy.addEventListener("click", async () => {
  let sender = await getSenderAddr();

  await gotoNextOffers(
    skip6,
    OFFERS_TBL_BIG,
    actionsMarkupPostedBuy,
    dashboardPostedBuyOffersTblBody.id,
    1,
    `status_not: 2, buyer: "${sender}"`
  );

  listenCancelOffer(1);
});

gotoPreviousAcceptedOffersSale.addEventListener("click", async () => {
  let sender = await getSenderAddr();

  await gotoPreviousOffers(
    skip7,
    OFFERS_TBL_BIG,
    actionsMarkupPostedSale,
    dashboardAcceptedSaleOffersTblBody.id,
    0,
    `status_not: 2, buyer: "${sender}"`
  );

  listenAcceptedTable(0);
});

gotoNextOffersAcceptedOffersSale.addEventListener("click", async () => {
  let sender = await getSenderAddr();

  await gotoNextOffers(
    skip7,
    OFFERS_TBL_BIG,
    actionsMarkupAcceptedSale,
    dashboardAcceptedSaleOffersTblBody.id,
    0,
    `status_not: 2, buyer: "${sender}"`
  );

  listenAcceptedTable(0);
});

gotoPreviousOffersAcceptedOffersBuy.addEventListener("click", async () => {
  let sender = await getSenderAddr();

  await gotoPreviousOffers(
    skip8,
    OFFERS_TBL_BIG,
    actionsMarkupAcceptedBuy,
    dashboardAcceptedBuyOffersTblBody.id,
    1,
    `status_not: 2, seller: "${sender}"`
  );

  listenAcceptedTable(1);
});

gotoNextOffersAcceptedOffersBuy.addEventListener("click", async () => {
  let sender = await getSenderAddr();

  await gotoNextOffers(
    skip8,
    OFFERS_TBL_BIG,
    actionsMarkupAcceptedBuy,
    dashboardAcceptedBuyOffersTblBody.id,
    1,
    `status_not: 2, seller: "${sender}"`
  );

  listenAcceptedTable(1);
});

// Navigate through sale and buy applets
switchCreateSale.addEventListener("click", async () => {
  alterVisibility(createSale, createBuy);
});

switchCreateBuy.addEventListener("click", async () => {
  alterVisibility(createBuy, createSale);
});

switchCancelSale.addEventListener("click", async () => {
  alterVisibility(cancelSale, cancelBuy);
});

switchCancelBuy.addEventListener("click", async () => {
  alterVisibility(cancelBuy, cancelSale);
});

switchAcceptSale.addEventListener("click", async () => {
  alterVisibility(acceptSale, acceptBuy);
});

switchAcceptBuy.addEventListener("click", async () => {
  alterVisibility(acceptBuy, acceptSale);
});

switchForfeitSale.addEventListener("click", async () => {
  alterVisibility(forfeitSale, forfeitBuy);
});

switchForfeitBuy.addEventListener("click", async () => {
  alterVisibility(forfeitBuy, forfeitSale);
});

switchRepaySale.addEventListener("click", async () => {
  alterVisibility(repaySale, repayBuy);
});

switchRepayBuy.addEventListener("click", async () => {
  alterVisibility(repayBuy, repaySale);
});

switchAddCollateralSale.addEventListener("click", async () => {
  alterVisibility(addCollateralSale, addCollateralBuy);
});

switchAddCollateralBuy.addEventListener("click", async () => {
  alterVisibility(addCollateralBuy, addCollateralSale);
});

switchChangeAddrSale.addEventListener("click", async () => {
  alterVisibility(changeAddrSale, changeAddrBuy);
});

switchChangeAddrBuy.addEventListener("click", async () => {
  alterVisibility(changeAddrBuy, changeAddrSale);
});

switchApprove.addEventListener("click", async () => {
  alterVisibility(approveApplet, revokeApplet);
});

switchRevoke.addEventListener("click", async () => {
  alterVisibility(revokeApplet, approveApplet);
});

switchLiquidateSale.addEventListener("click", async () => {
  alterVisibility(liquidateSale, liquidateBuy);
});

switchLiquidateBuy.addEventListener("click", async () => {
  alterVisibility(liquidateBuy, liquidateSale);
});

function displaySection(section, resizeTo, _displayAside) {
  resetLayout();
  resizeMainContainerColumns(resizeTo);

  if (_displayAside == 0) {
    removeAside();
  } else {
    displayAside();
  }

  section.style.display = "";
}

function displayOffersSection(section) {
  resetLayout();
  section.style.display = "";
}

function alterVisibility(displaySection, hideSection) {
  displaySection.style.display = "";
  hideSection.style.display = "none";
}

function resetLayout() {
  for (var i = 0; i < appsLen; i++) {
    apps[i].style.display = "none";
  }
}

function resizeMainContainerColumns(resizeTo) {
  if (main.style.gridTemplateRows != resizeTo) {
    main.style.gridTemplateRows = resizeTo;
  }
}

function removeAside() {
  if (aside.style.display == "") {
    aside.style.display = "none";
  }
}

function displayAside() {
  if (aside.style.display != "") {
    aside.style.display = "";
  }
}

async function gotoNextOffers(
  skip,
  numOffers,
  actionsMarkup,
  appendTo,
  offerType,
  xtraArgs
) {
  if (skip < 0) {
    skip = 0;
  } else {
    skip += numOffers;
  }

  if (
    (await getOffers(
      offerType,
      `first: ${numOffers}, skip: ${skip}, where: { ${xtraArgs} }, orderDirection: desc, orderBy: timeCreated`,
      actionsMarkup,
      appendTo,
      0
    )) == 0
  ) {
    skip -= numOffers;
  }
}

async function gotoPreviousOffers(
  skip,
  numOffers,
  actionsMarkup,
  appendTo,
  offerType,
  xtraArgs
) {
  if (skip < 0) {
    skip = 0;
  } else if (skip - numOffers >= 0) {
    skip -= numOffers;
  }

  await getOffers(
    offerType,
    `first: ${numOffers}, skip: ${skip}, where: { ${xtraArgs} }, orderDirection: desc, orderBy: timeCreated`,
    actionsMarkup,
    appendTo,
    0
  );
}
