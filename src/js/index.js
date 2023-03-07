console.log("Welcome to Spectrr Finance!");

// Library & data files Imports
const contracts = require("@ethersproject/contracts");
const utils = require("@ethersproject/units");
const bigNumber = require("@ethersproject/bignumber").BigNumber;
const providers = require("@ethersproject/providers");
const axios = require("./../../node_modules/axios/dist/axios.min");
const dataFtm = require("./modules/data_ftm_opera.js");
const dataFtmTestnet = require("./modules/data_ftm_testnet.js");
const abiERC20 = require("./../assets/abis/IERC20.json");
const abiSpectrr = require("./../assets/abis/SpectrrCore.json");

// Tokens logos
const chainLogo = new URL(
  "./../assets/pics/fantom-ftm-logo.svg",
  import.meta.url
);
const btcLogo = new URL(
  "./../assets/pics/wrapped-bitcoin-wbtc.svg",
  import.meta.url
);
const linkLogo = new URL(
  "./../assets/pics/chainlink-link-logo.svg",
  import.meta.url
);
const bnbLogo = new URL("./../assets/pics/bnb-bnb-logo.svg", import.meta.url);
const usdcLogo = new URL(
  "./../assets/pics/usd-coin-usdc-logo.svg",
  import.meta.url
);
const ethLogo = new URL(
  "./../assets/pics/ethereum-eth-logo.svg",
  import.meta.url
);

// Constants used for calculations and table generation
const LIQUIDATION_LIMIT = 1.25;
const COLLATERAL_RATIO = 1.5;
const OFFERS_TBL_BIG = 16;
const OFFERS_TBL_SML = 8;
const FEE_PERCENT = 0.1;

// Sections of page
const home = document.getElementById("home");
const browse = document.getElementById("browse");
const create = document.getElementById("create");
const accept = document.getElementById("accept");
const cancel = document.getElementById("cancel");
const forfeit = document.getElementById("forfeit");
const repay = document.getElementById("repay");
const addCollateral = document.getElementById("add-collateral");
const liquidate = document.getElementById("liquidate");
const liquidateApplet = document.getElementById("liquidate-applet");
const dashboard = document.getElementById("dashboard");
const changeAddr = document.getElementById("change-addr");
const approve = document.getElementById("approve");

// Array containing all page sections
const apps = [
  home,
  browse,
  create,
  accept,
  cancel,
  forfeit,
  addCollateral,
  repay,
  liquidate,
  liquidateApplet,
  dashboard,
  changeAddr,
  approve,
];
const appsLen = apps.length;

// Info on user & wallet user
const infoWallet = document.getElementById("info-wallet");
const infoNetworkStatus = document.getElementById("info-network");
const infoRpcStatus = document.getElementById("info-rpc-status");

// Buttons to go to a specific section of page
const gotoHomeBtn = document.getElementById("goto-home");
const gotoOffersBtn = document.getElementById("goto-offers");
const gotoBrowseBtn = document.getElementById("goto-browse");
const gotoLiquidateBtn = document.getElementById("goto-liquidate");
const gotoDashboardBtn = document.getElementById("goto-dashboard");
const gotoLiquidateAppletBtn = document.getElementById("goto-liquidate-applet");
const gotoCreateBtn = document.getElementById("goto-create");
const gotoCancelBtn = document.getElementById("goto-cancel");
const gotoAcceptBtn = document.getElementById("goto-accept");
const gotoForfeitBtn = document.getElementById("goto-forfeit");
const gotoRepayBtn = document.getElementById("goto-repay");
const gotoAddCollateralBtn = document.getElementById("goto-add-collateral");
const gotoChangeAddrBtn = document.getElementById("goto-change-addr");
const gotoApproveBtn = document.getElementById("goto-approve");

// Wallet Buttons
const connectWalletBtn = document.getElementById("connect-wallet");
const connectToFantomTestnet = document.getElementById("connect-ftm-testnet");
const connectToFtmOpera = document.getElementById("connect-ftm-opera");

// Switch between sale/buy sections
const browseSwitchSaleOfferBtn = document.getElementById(
  "browse-switch-sale-offer-btn"
);
const browseSwitchBuyOfferBtn = document.getElementById(
  "browse-switch-buy-offer-btn"
);
const liquidateSwitchSaleOfferBtn = document.getElementById(
  "liquidate-switch-sale-offer-btn"
);
const liquidateSwitchBuyOfferBtn = document.getElementById(
  "liquidate-switch-buy-offer-btn"
);
const dashboardSwitchSaleOfferBtn = document.getElementById(
  "dashboard-switch-sale-offer-btn"
);
const dashboardSwitchBuyOfferBtn = document.getElementById(
  "dashboard-switch-buy-offer-btn"
);
const dashboardSwitchToPostedSale = document.getElementById(
  "dashboard-switch-posted-offers-sale"
);
const dashboardSwitchToAcceptedSale = document.getElementById(
  "dashboard-switch-accepted-offers-sale"
);
const dashboardSwitchToPostedBuy = document.getElementById(
  "dashboard-switch-posted-offers-buy"
);
const dashboardSwitchToAcceptedBuy = document.getElementById(
  "dashboard-switch-accepted-offers-buy"
);
const dashboardToggleOfferTypeSale = document.getElementById(
  "dashboard-toggle-offer-type-sale"
);
const dashboardToggleOfferTypeBuy = document.getElementById(
  "dashboard-toggle-offer-type-buy"
);

// Navigate through offers button
const gotoPreviousBrowseOffersSale = document.getElementById(
  "nav-browse-offers-sale"
).children[0];
const gotoNextBrowseOffersSale = document.getElementById(
  "nav-browse-offers-sale"
).children[1];
const gotoPreviousBrowseOffersBuy = document.getElementById(
  "nav-browse-offers-buy"
).children[0];
const gotoNextBrowseOffersBuy = document.getElementById("nav-browse-offers-buy")
  .children[1];
const gotoPreviousLiquidateOffersSale = document.getElementById(
  "nav-liquidate-offers-sale"
).children[0];
const gotoNextLiquidateOffersSale = document.getElementById(
  "nav-liquidate-offers-sale"
).children[1];
const gotoPreviousLiquidateOffersBuy = document.getElementById(
  "nav-liquidate-offers-buy"
).children[0];
const gotoNextLiquidateOffersBuy = document.getElementById(
  "nav-liquidate-offers-buy"
).children[1];
const gotoPreviousPostedOffersSale = document.getElementById(
  "nav-posted-offers-sale"
).children[0];
const gotoNextPostedOffersSale = document.getElementById(
  "nav-posted-offers-sale"
).children[1];
const gotoPreviousPostedOffersBuy = document.getElementById(
  "nav-posted-offers-buy"
).children[0];
const gotoNextPostedOffersBuy = document.getElementById("nav-posted-offers-buy")
  .children[1];
const gotoPreviousAcceptedOffersSale = document.getElementById(
  "nav-accepted-offers-sale"
).children[0];
const gotoNextOffersAcceptedOffersSale = document.getElementById(
  "nav-accepted-offers-sale"
).children[1];
const gotoPreviousOffersAcceptedOffersBuy = document.getElementById(
  "nav-accepted-offers-buy"
).children[0];
const gotoNextOffersAcceptedOffersBuy = document.getElementById(
  "nav-accepted-offers-buy"
).children[1];

// Navigate through sale and buy applets buttons
const switchLiquidateSale = liquidateApplet.children[0].children[0].children[0];
const switchLiquidateBuy = liquidateApplet.children[0].children[0].children[1];
const switchCreateSale = create.children[0].children[0].children[0];
const switchCreateBuy = create.children[0].children[0].children[1];
const switchAcceptSale = accept.children[0].children[0].children[0];
const switchAcceptBuy = accept.children[0].children[0].children[1];
const switchCancelSale = cancel.children[0].children[0].children[0];
const switchCancelBuy = cancel.children[0].children[0].children[1];
const switchForfeitSale = forfeit.children[0].children[0].children[0];
const switchForfeitBuy = forfeit.children[0].children[0].children[1];
const switchRepaySale = repay.children[0].children[0].children[0];
const switchRepayBuy = repay.children[0].children[0].children[1];
const switchAddCollateralSale =
  addCollateral.children[0].children[0].children[0];
const switchAddCollateralBuy =
  addCollateral.children[0].children[0].children[1];
const switchChangeAddrSale = changeAddr.children[0].children[0].children[0];
const switchChangeAddrBuy = changeAddr.children[0].children[0].children[1];
const switchApprove = approve.children[0].children[0].children[0];
const switchRevoke = approve.children[0].children[0].children[1];

// applets
const createSale = document.getElementById("applet-create-sale");
const createBuy = document.getElementById("applet-create-buy");
const cancelSale = document.getElementById("applet-cancel-sale");
const cancelBuy = document.getElementById("applet-cancel-buy");
const acceptSale = document.getElementById("applet-accept-sale");
const acceptBuy = document.getElementById("applet-accept-buy");
const forfeitSale = document.getElementById("applet-forfeit-sale");
const forfeitBuy = document.getElementById("applet-forfeit-buy");
const repaySale = document.getElementById("applet-repay-sale");
const repayBuy = document.getElementById("applet-repay-buy");
const addCollateralSale = document.getElementById("applet-add-collateral-sale");
const addCollateralBuy = document.getElementById("applet-add-collateral-buy");
const changeAddrSale = document.getElementById("applet-change-addr-sale");
const changeAddrBuy = document.getElementById("applet-change-addr-buy");
const approveApplet = document.getElementById("applet-approve");
const revokeApplet = document.getElementById("applet-revoke");
const liquidateSale = document.getElementById("applet-liquidate-sale");
const liquidateBuy = document.getElementById("applet-liquidate-buy");

// Tables
const browseSaleOffersTbl = document.getElementById("browse").children[1];
const browseBuyOffersTbl = document.getElementById("browse").children[2];
const liquidateSaleOffersTbl = document.getElementById("liquidate").children[1];
const liquidateBuyOffersTbl = document.getElementById("liquidate").children[2];
const dashboardSaleOffersTbl = document.getElementById("dashboard").children[3];
const dashboardBuyOffersTbl = document.getElementById("dashboard").children[4];
const dashboardSalePostedOffersTbl = dashboardSaleOffersTbl.children[0];
const dashboardSaleAcceptedOffersTbl = dashboardSaleOffersTbl.children[1];
const dashboardBuyPostedOffersTbl = dashboardBuyOffersTbl.children[0];
const dashboardBuyAcceptedOffersTbl = dashboardBuyOffersTbl.children[1];

// Tables body
const homeSaleOffersTblBody = document.getElementById("home-offers-sale");
const homeBuyOffersTblBody = document.getElementById("home-offers-buy");
const browseSaleOffersTblBody = document.getElementById(
  "browse-offers-sale-tbl"
);
const browseBuyOffersTblBody = document.getElementById("browse-offers-buy-tbl");
const liquidateSaleOffersTblBody = document.getElementById(
  "liquidate-offers-sale-tbl"
);
const liquidateBuyOffersTblBody = document.getElementById(
  "liquidate-offers-buy-tbl"
);
const dashboardPostedSaleOffersTblBody = document.getElementById(
  "dashboard-offers-posted-tbl-sale"
);
const dashboardAcceptedSaleOffersTblBody = document.getElementById(
  "dashboard-offers-accepted-tbl-sale"
);
const dashboardPostedBuyOffersTblBody = document.getElementById(
  "dashboard-offers-posted-tbl-buy"
);
const dashboardAcceptedBuyOffersTblBody = document.getElementById(
  "dashboard-offers-accepted-tbl-buy"
);

// html tag elements
const aside = document.getElementsByTagName("aside")[0];
const main = document.getElementsByTagName("main")[0];

// Variables depending on chain
var data, provider, signer, blockTimestamp;
var skip1 = 0,
  skip2 = 0,
  skip3 = 0,
  skip4 = 0,
  skip5 = 0,
  skip6 = 0,
  skip7 = 0,
  skip8 = 0;
var chainScanUrl, chainRpcUrl, subgraphApiUrl;
var addrEther, addrBtc, addrUsdc, addrEth, addrBnb, addrLink, addrSpectrr;
var chainId, chainName, chainNameLong;
var spectrr, ether, btc, eth, usdc, bnb, link;
var prices = [0, 0, 0, 0, 0, 0];
// toggle offer actions button color when clicked
// reset colors when offers button is clicked
document.querySelectorAll(".offer-actions").forEach((item, index, arr) => {
  item.addEventListener("click", () => {
    arr.forEach((item) => {
      item.classList.remove("contrast");
    });

    item.classList.add("contrast");
  });
});

["#dashboard-toggle-offer-type-buy", "#dashboard-toggle-offer-type-sale", '.switch-offer-type', '.toggle-sale-buy'].forEach(itm => {
document.querySelectorAll(itm).forEach((item, index, arr) => {
  item.children[0].addEventListener("click", () => {
    item.children[0].classList.replace("secondary", "contrast");
    item.children[1].classList.replace("contrast", "secondary");
  });

  item.children[1].addEventListener("click", () => {
    item.children[1].classList.replace("secondary", "contrast");
    item.children[0].classList.replace("contrast", "secondary");
  });
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
      ""
    );
  } else {
    addEventListenerToBtnBuy(
      ".accept-offer-buy",
      "goto-accept",
      switchAcceptBuy,
      "accept-buy-offer-id",
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
      "confirm-liquidate-sale-offer"
    );
  } else {
    addEventListenerToBtnBuy(
      ".liquidate-offer-buy",
      "goto-liquidate-applet",
      switchLiquidateBuy,
      "liquidate-buy-offer-id",
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
      ""
    );
  } else {
    addEventListenerToBtnBuy(
      ".add-collateral-offer-buy",
      "goto-add-collateral",
      switchAddCollateralBuy,
      "add-collateral-buy-id",
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
      "confirm-forfeit-sale-offer"
    );
  } else {
    addEventListenerToBtnBuy(
      ".forfeit-offer-buy",
      "goto-forfeit",
      switchForfeitBuy,
      "forfeit-buy-offer-id",
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
      "confirm-cancel-sale-offer"
    );
  } else {
    addEventListenerToBtnBuy(
      ".cancel-offer-buy",
      "goto-cancel",
      switchCancelBuy,
      "cancel-buy-offer-id",
      "confirm-cancel-buy-offer"
    );
  }
}

function listenRepayOffer(offerType) {
  if (offerType === 0) {
    addEventListenerToBtnSale(
      ".repay-offer-sale",
      "goto-repay",
      "repay-sale-offer-id",
      ""
    );
  } else {
    addEventListenerToBtnBuy(
      ".repay-offer-buy",
      "goto-repay",
      switchRepayBuy,
      "repay-buy-offer-id",
      ""
    );
  }
}

function listenChangeAddr(offerType) {
  if (offerType === 0) {
    addEventListenerToBtnSale(
      ".change-addr-offer-sale",
      "goto-change-addr",
      "change-addr-sale-id",
      ""
    );
  } else {
    addEventListenerToBtnBuy(
      ".change-addr-offer-buy",
      "goto-change-addr",
      switchChangeAddrBuy,
      "change-addr-buy-id",
      ""
    );
  }
}

function listenPostedSale() {
  listenCancelOffer(0);
  listenLiquidateOffer(0);
  listenChangeAddr(0);
}

function listenPostedBuy() {
  listenRepayOffer(1);
  listenCancelOffer(1);
  listenForfeitOffer(1);
  listenAddCollateral(1);
  listenChangeAddr(1);
}

function listenAcceptedSale() {
  listenRepayOffer(0);
  listenForfeitOffer(0);
  listenAddCollateral(0);
  listenChangeAddr(0);
}

function listenAcceptedBuy() {
  listenCancelOffer(1);
  listenLiquidateOffer(1);
  listenChangeAddr(1);
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
    item.closest("details").firstElementChild.innerHTML = item.innerHTML;
    item.closest("details").removeAttribute("open");
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

      listenPostedSale();
    } else {
      await getOffers(
        0,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, buyer: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupAcceptedSale,
        dashboardAcceptedSaleOffersTblBody.id,
        0
      );

      listenAcceptedSale();
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

      listenPostedBuy();
    } else {
      await getOffers(
        1,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, seller: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupAcceptedBuy,
        dashboardAcceptedBuyOffersTblBody.id,
        0
      );

      listenAcceptedBuy();
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

      listenPostedSale();
    } else {
      await getOffers(
        0,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, buyer: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupAcceptedSale,
        dashboardAcceptedSaleOffersTblBody.id,
        0
      );

      listenAcceptedSale();
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

      listenPostedBuy();
    } else {
      await getOffers(
        1,
        `first: ${OFFERS_TBL_BIG}, where: { status_not: 2, seller: "${sender}"}, orderDirection: desc, orderBy: timeCreated`,
        actionsMarkupAcceptedBuy,
        dashboardAcceptedBuyOffersTblBody.id,
        0
      );

      listenAcceptedBuy();
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

  listenPostedSale();
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

  listenAcceptedSale();
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

  listenPostedBuy();
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

  listenAcceptedBuy();
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

  listenPostedSale();
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

  listenPostedSale();
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

  listenPostedBuy();
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

  listenPostedBuy();
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

  listenAcceptedSale();
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

  listenAcceptedSale();
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

  listenAcceptedBuy();
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

  listenAcceptedBuy();
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
// Initialize data when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  overlay.style.display = "flex";
  overlay.setAttribute("aria-busy", "true");

  await initPageFromChain();
  await updateWalletStatus();
  await updateRpcStatus();
  await updateChainStatus();

  chainScanUrl = data.CHAIN_SCAN_URL;
  chainRpcUrl = data.CHAIN_RPC_URL;
  subgraphApiUrl = data.SUBGRAPH_API_URL;
  chainId = data.CHAIN_ID;
  addrEther = data.ADDR_ETHER;
  addrBtc = data.ADDR_BTC;
  addrBnb = data.ADDR_BNB;
  addrUsdc = data.ADDR_USDC;
  addrEth = data.ADDR_ETH;
  addrLink = data.ADDR_LINK;
  addrSpectrr = data.ADDR_SPECTRR;
  chainName = data.CHAIN_NAME;
  chainNameLong = data.CHAIN_NAME_LONG;

  if (typeof window.ethereum !== "undefined") {
    const accounts = await ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length !== 0) {
      provider = new providers.Web3Provider(window.ethereum, "any");
      signer = provider.getSigner();

      if ((await getChainId()) == chainId) {
        spectrr = new contracts.Contract(addrSpectrr, abiSpectrr, signer);
        ether = new contracts.Contract(addrEther, abiERC20, signer);
        usdc = new contracts.Contract(addrUsdc, abiERC20, signer);
        btc = new contracts.Contract(addrBtc, abiERC20, signer);
        bnb = new contracts.Contract(addrBnb, abiERC20, signer);
        link = new contracts.Contract(addrLink, abiERC20, signer);
        eth = new contracts.Contract(addrEth, abiERC20, signer);

        await getPrices();

        updateBlockTimestamp();

        await getOffersHome();

        overlay.style.display = "none";
        overlay.setAttribute("aria-busy", "false");
      } else {
        createResponsePrompt(
          "<p>Spectrr Finance is only supported on the Fantom Opera and Fantom Testnet Networks!</p><p>Please change the chain from your wallet.</p>"
        );
        document.getElementsByClassName("dropdown")[0].style.zIndex = "2";
        document.getElementsByClassName("dropdown")[0].style.boxShadow =
          "0px 0px 3px 3px #f4f4f4";
      }
    } else {
      createResponsePrompt(
        "Unlock or Connect Your Wallet To Use Spectrr Finance!"
      );
      document.getElementById("connect-wallet").style.zIndex = "2";
      document.getElementById("connect-wallet").style.boxShadow =
        "0px 0px 3px 3px #f4f4f4";
    }
  } else {
    createResponsePrompt(
      "Please Install a Web3 Wallet to Use Spectrr Finance!"
    );
  }
});
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
// dApp Logic
document
  .getElementById("confirm-create-sale")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-create-sale")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let sellingAmount = document.getElementById("selling-amount").value;
      let exchangeRate = document.getElementById("exchange-rate-sale").value;
      let repayInTime = document.getElementById("repay-in-sale-offer").value;
      let repayInTimeFormat = document.getElementById(
        "repay-in-format-sale-offer"
      ).value;
      let sellingId = tokenChoiceToId(
        document.getElementById("selling-amount").nextElementSibling.children[0]
          .children[0].classList
      );
      let sellForId = tokenChoiceToId(
        document.getElementById("exchange-rate-sale").nextElementSibling
          .children[0].children[0].classList
      );
      let repayInSeconds;

      if (repayInTime == "" || repayInTime == 0) {
        repayInSeconds = "0";
      } else if (repayInTimeFormat == 1) {
        if (repayInTime < 1) {
          repayInSeconds = "1";
        } else {
          repayInSeconds = Math.round(repayInTime).toString();
        }
      } else {
        repayInSeconds = timeToSeconds(
          repayInTime,
          repayInTimeFormat
        ).toString();
      }

      if (sellingId == sellForId) {
        createResponsePrompt(
          "Selling and Selling For token can not be the same..."
        );
        return;
      }

      let fee = getFee(sellingAmount);

      if (
        (await checkBalance(sellingId, Number(sellingAmount) + fee)) == false
      ) {
        createResponsePrompt(
          `Insufficient balance for ${tokenIdToName(sellingId)}`
        );
        return;
      }

      if (
        (await checkAllowance(sellingId, Number(sellingAmount) + fee)) == false
      ) {
        await approveAllowance(
          sellingId,
          "",
          `Insufficient allowance for ${tokenIdToName(
            sellingId
          )}, please approve following transaction to continue...`
        );
        return;
      }

      let marketExchangeRate = getExchangeRate(sellingId, sellForId);
      let rateDiff = getRateDiff(exchangeRate, marketExchangeRate);

      let markup = `
				<p>Creating Sale Offer:</p>
				<p>---------------------------------</p>
		 		<p>Amount Selling: ${formatAmount(parseFloat(sellingAmount))} ${tokenIdToName(
        sellingId
      )}</p>
				<p>Amount Selling For: ${formatAmount(
          exchangeRate * sellingAmount
        )} ${tokenIdToName(sellForId)}</p>
				<p>Repayment in: ${formatSeconds(repayInSeconds)}</p>
				<p>---------------------------------</p>
				<p>Exchange Rate: ${formatAmount(Number(exchangeRate))} ${tokenIdToName(
        sellForId
      )}/${tokenIdToName(sellingId)}</p>
				<p>Market Rate: ${formatAmount(
          getExchangeRate(sellingId, sellForId)
        )} ${tokenIdToName(sellForId)}/${tokenIdToName(sellingId)}</p>
        <p>Rate: ${rateDiff[0]} ${rateDiff[1]} market</p>
			  <p>---------------------------------</p>
		    <p>Fee: ${formatAmount(fee)} ${tokenIdToName(sellingId)}</p>
		`;

      if (
        (await createSaleOffer(
          sellingAmount,
          sellingId,
          exchangeRate,
          sellForId,
          repayInSeconds,
          markup
        )) == true
      ) {
        document.getElementById("applet-create-sale").reset();
        document.getElementById("selling-token-id").innerText = "Selling Token";
        document.getElementById("selling-for-token-id").innerText =
          "Selling For Token";
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-create-sale")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-create-buy")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-create-buy")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let buyingAmount = document.getElementById("buying-amount").value;
      let exchangeRate = document.getElementById("exchange-rate-buy").value;
      let repayInTime = document.getElementById("repay-in-buy-offer").value;
      let repayInTimeFormat = document.getElementById(
        "repay-in-format-buy-offer"
      ).value;
      let buyingId = tokenChoiceToId(
        document.getElementById("buying-amount").nextElementSibling.children[0]
          .children[0].classList
      );
      let buyForId = tokenChoiceToId(
        document.getElementById("exchange-rate-buy").nextElementSibling
          .children[0].children[0].classList
      );
      let collateralId = tokenChoiceToId(
        document.getElementById("create-buy-collateral-id").children[0]
          .classList
      );
      let collateralAmount = getCollateral(
        exchangeRate * buyingAmount,
        buyForId,
        collateralId
      );
      let repayInSeconds;

      if (repayInTime == "" || repayInTime == 0) {
        repayInSeconds = "0";
      } else if (repayInTimeFormat == 1) {
        if (repayInTime < 1) {
          repayInSeconds = "1";
        } else {
          repayInSeconds = Math.round(repayInTime).toString();
        }
      } else {
        repayInSeconds = timeToSeconds(
          repayInTime,
          repayInTimeFormat
        ).toString();
      }

      if (buyingId == buyForId) {
        createResponsePrompt(
          "Buying and Buying For token can not be the same..."
        );
        return;
      }

      if (buyingId == collateralId) {
        createResponsePrompt(
          "Buying and Collateral token can not be the same..."
        );
        return;
      }

      let fee = getFee(collateralAmount);

      if ((await checkBalance(collateralId, collateralAmount + fee)) == false) {
        createResponsePrompt(
          `Insufficient balance for ${tokenIdToName(collateralId)}`
        );
        return;
      }

      if (
        (await checkAllowance(collateralId, collateralAmount + fee)) == false
      ) {
        await approveAllowance(
          collateralId,
          "",
          `Insufficient allowance for ${tokenIdToName(
            collateralId
          )}, please approve following transaction to continue...`
        );
        return;
      }

      let marketExchangeRate = getExchangeRate(buyingId, buyForId);
      let rateDiff = getRateDiff(exchangeRate, marketExchangeRate);

      let markup = `
			<p>Creating Buy Offer:</p>
			<p>---------------------------------</p>
	 		<p>Amount Buying: ${formatAmount(parseFloat(buyingAmount))} ${tokenIdToName(
        buyingId
      )}</p>
			<p>Amount to Repay: ${formatAmount(
        exchangeRate * buyingAmount
      )} ${tokenIdToName(buyForId)}</p>
		  <p>Repayment in: ${formatSeconds(repayInSeconds)}</p>
		  <p>Collateral To Pay: ${formatAmount(collateralAmount)} ${tokenIdToName(
        collateralId
      )}
		  </p>
			<p>---------------------------------</p>
		  <p>Exchange Rate: ${formatAmount(Number(exchangeRate))} ${tokenIdToName(
        buyForId
      )}/${tokenIdToName(buyingId)}</p>
		  <p>Market Rate: ${formatAmount(marketExchangeRate)} ${tokenIdToName(
        buyForId
      )}/${tokenIdToName(buyingId)}</p>
      <p>Rate: ${rateDiff[0]} ${rateDiff[1]} market</p>
			<p>---------------------------------</p>
		  <p>Fee: ${formatAmount(fee)} ${tokenIdToName(collateralId)}</p>
		`;

      if (
        (await createBuyOffer(
          buyingAmount,
          buyingId,
          exchangeRate,
          buyForId,
          collateralId,
          repayInSeconds,
          markup
        )) == true
      ) {
        document.getElementById("applet-create-buy").reset();
        document.getElementById("buying-token-id").innerText = "Buying Token";
        document.getElementById("buy-for-token-id").innerText =
          "Buying For Token";
        document.getElementById("create-buy-collateral-id").innerText =
          "Collateral Token";
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-create-buy")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-accept-sale")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-accept-sale")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("accept-sale-offer-id").value;
      let collateralId = tokenChoiceToId(
        document.getElementById("accept-sale-collateral-id").children[0]
          .classList
      );
      let sender = await getSenderAddr();
      let offer = await getSaleOfferInfo(offerId);
      let markup;

      if (offer) {
        if (offer.status != 0) {
          createResponsePrompt(
            `<p>Sale Offer #${offerId} is already ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        if (offer.seller == sender) {
          createResponsePrompt(
            `You are the seller of sale offer #${offerId}...`
          );
          return;
        }

        if (collateralId == offer.sellingId) {
          createResponsePrompt(
            "Collateral and Selling token can not be the same..."
          );
          return;
        }

        let collateralAmount = getCollateral(
          toEther(offer.sellFor),
          offer.sellForId,
          collateralId
        );

        let fee = getFee(collateralAmount);

        if (
          (await checkBalance(collateralId, collateralAmount + fee)) == false
        ) {
          createResponsePrompt(
            `Insufficient balance for ${tokenIdToName(collateralId)}`
          );
          return;
        }

        if (
          (await checkAllowance(collateralId, collateralAmount + fee)) == false
        ) {
          await approveAllowance(
            collateralId,
            "",
            `Insufficient allowance for ${tokenIdToName(
              collateralId
            )}, please approve following transaction to continue...`
          );
          return;
        }

        let exchangeRate = getOfferRate(
          toEther(offer.selling),
          toEther(offer.sellFor)
        );
        let marketExchangeRate = getExchangeRate(
          offer.sellingId,
          offer.sellForId
        );
        let rateDiff = getRateDiff(exchangeRate, marketExchangeRate);

        markup = `
		    <p>Accepting Sale Offer: #${offer.id}</p>
		    <p>---------------------------------</p>
		      <p>Amount Receiving: ${formatEther(offer.selling)} ${tokenIdToName(
          offer.sellingId
        )}</p>
		    <p>Amount to Repay: ${formatEther(offer.sellFor)} ${tokenIdToName(
          offer.sellForId
        )}</p>
		    <p>Repayment in: ${getOfferRepayDeadline(
          offer.timeAccepted,
          offer.repayInSec
        )}</p>
		    <p>Collateral To Pay: ${formatAmount(collateralAmount)} ${tokenIdToName(
          collateralId
        )}
		    </p>
				<p>---------------------------------</p>
		    <p>Exchange Rate: ${formatAmount(exchangeRate)} ${tokenIdToName(
          offer.sellForId
        )}/${tokenIdToName(offer.sellingId)}</p>
		    <p>Market Rate: ${formatAmount(marketExchangeRate)} ${tokenIdToName(
          offer.sellForId
        )}/${tokenIdToName(offer.sellingId)}</p>
        <p>Rate: ${rateDiff[0]} ${rateDiff[1]} market</p>        
		    <p>Seller: ${formatAddress(offer.seller)}</p>
			  <p>---------------------------------</p>
		    <p>Fee: ${formatAmount(fee)} ${tokenIdToName(collateralId)}</p>
		  `;
      } else if (offer == false) {
        createResponsePrompt(`<p>Sale Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `
		  <p>Accepting Sale Offer: #${offerId}</p>
		  <p>Collateral: ${tokenIdToName(collateralId)}</p>
		`;
      }

      if ((await acceptSaleOffer(markup, offerId, collateralId)) == true) {
        document.getElementById("applet-accept-sale").reset();
        document.getElementById("accept-sale-collateral-id").innerText =
          "Collateral Token";
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-accept-sale")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-accept-buy")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-accept-buy")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("accept-buy-offer-id").value;
      let sender = await getSenderAddr();
      let offer = await getBuyOfferInfo(offerId);
      let markup;

      if (offer) {
        if (offer.status != 0) {
          createResponsePrompt(
            `<p>Buy Offer #${offerId} is already ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        if (offer.buyer == sender) {
          createResponsePrompt(`You are the buyer of buy offer #${offerId}...`);
          return;
        }

        let fee = getFee(toEther(offer.buying));

        if (
          (await checkBalance(
            offer.buyingId,
            Number(toEther(offer.buying)) + fee
          )) == false
        ) {
          createResponsePrompt(
            `Insufficient balance for ${tokenIdToName(offer.buyingId)}`
          );
          return;
        }

        if (
          (await checkAllowance(
            offer.buyingId,
            Number(toEther(offer.buying)) + fee
          )) == false
        ) {
          await approveAllowance(
            offer.buyingId,
            "",
            `Insufficient allowance for ${tokenIdToName(
              offer.buyingId
            )}, please approve following transaction to continue...`
          );
          return;
        }

        let exchangeRate = getOfferRate(
          toEther(offer.buying),
          toEther(offer.buyFor)
        );
        let marketExchangeRate = getExchangeRate(
          offer.buyingId,
          offer.buyForId
        );
        let rateDiff = getRateDiff(exchangeRate, marketExchangeRate);

        markup = `
		    <p>Accepting Buy Offer: #${offer.id}</p>
		    <p>---------------------------------</p>
		    <p>Amount to Send: ${formatEther(offer.buying)} ${tokenIdToName(
          offer.buyingId
        )}</p>
		    <p>Amount Receiving: ${formatEther(offer.buyFor)} ${tokenIdToName(
          offer.buyForId
        )}</p>
		    <p>Repayment in: ${getOfferRepayDeadline(
          offer.timeAccepted,
          offer.repayInSec
        )}</p>
		    <p>Offer Collateral: ${formatEther(offer.collateral)} ${tokenIdToName(
          offer.collateralId
        )}</p>
		    <p>---------------------------------</p>
		    <p>Exchange Rate: ${formatAmount(exchangeRate)} ${tokenIdToName(
          offer.buyForId
        )}/${tokenIdToName(offer.buyingId)}</p>
		    <p>Market Rate: ${formatAmount(marketExchangeRate)} ${tokenIdToName(
          offer.buyForId
        )}/${tokenIdToName(offer.buyingId)}</p>
        <p>Rate: ${rateDiff[0]} ${rateDiff[1]} market</p>		    
		    <p>Buyer: ${formatAddress(offer.buyer)}</p>
				<p>---------------------------------</p>
		    <p>Fee: ${formatAmount(fee)} ${tokenIdToName(offer.buyingId)}</p>
		  `;
      } else if (offer == false) {
        createResponsePrompt(`<p>Buy Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `
		  		<p>Accepting Buy Offer: #${offerId}</p>
		  		<p>Collateral: ${tokenIdToName(collateralId)}</p>
		`;
      }

      if ((await acceptBuyOffer(markup, offerId)) == true) {
        document.getElementById("applet-accept-buy").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-accept-buy")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-approve-allowance")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-approve-allowance")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let amountApprove = document.getElementById("approve-token-amount").value;
      let tokenId = tokenChoiceToId(
        document.getElementById("approve-token-id").children[0].classList
      );

      if ((await approveAllowance(tokenId, amountApprove, "")) == true) {
        document.getElementById("applet-approve").reset();
        document.getElementById("approve-token-id").innerText =
          "Token to Approve";
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-approve-allowance")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-revoke-allowance")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-revoke-allowance")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let tokenId = tokenChoiceToId(
        document.getElementById("revoke-token-id").children[0].classList
      );

      if ((await revokeAllowance(tokenId)) == true) {
        document.getElementById("applet-revoke").reset();
        document.getElementById("revoke-token-id").innerText =
          "Token to Revoke";
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-revoke-allowance")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-cancel-sale-offer")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-cancel-sale-offer")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("cancel-sale-offer-id").value;
      let offer = await getSaleOfferInfo(offerId);
      let sender = await getSenderAddr();
      let markup;

      if (offer) {
        if (offer.status != "0") {
          createResponsePrompt(
            `<p>Sale Offer #${offer.id} is already ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        if (sender != offer.seller) {
          createResponsePrompt(
            `You are not the seller of sale offer #${offerId}`
          );
          return;
        }

        markup = `
					<p>Canceling Sale Offer: #${offer.id}</p>
					<p>---------------------------------</p>
				  <p>Amount Selling: ${formatEther(offer.selling)} ${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Amount Selling For: ${formatEther(offer.sellFor)} ${tokenIdToName(
          offer.sellForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(toEther(offer.selling), toEther(offer.sellFor))
        )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.sellingId, offer.sellForId)
          )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Seller: ${formatAddress(offer.seller)}</p>
				  <p>Repayment in: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
				`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Sale Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `<p>Canceling Sale Offer: #${offerId}</p>`;
      }

      if ((await cancelSaleOffer(markup, offerId)) == true) {
        document.getElementById("applet-cancel-sale").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-cancel-sale-offer")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-cancel-buy-offer")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-cancel-buy-offer")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("cancel-buy-offer-id").value;
      let sender = await getSenderAddr();
      let offer = await getBuyOfferInfo(offerId);
      let markup;

      if (offer) {
        if (offer.status != "0") {
          createResponsePrompt(
            `<p>Buy Offer #${offer.id} is already ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        if (sender != offer.buyer) {
          createResponsePrompt(
            `You are not the buyer of buy offer #${offerId}`
          );
          return;
        }

        markup = `
					<p>Canceling Buy Offer: #${offer.id}</p>
					<p>---------------------------------</p>
				  <p>Amount Buying: ${formatEther(offer.buying)} ${tokenIdToName(
          offer.buyingId
        )}</p>
				  <p>Amount Buying For: ${formatEther(offer.buyFor)} ${tokenIdToName(
          offer.buyForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(toEther(offer.buying), toEther(offer.buyFor))
        )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(offer.buyingId)}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.buyingId, offer.buyForId)
          )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(
          offer.buyingId
        )}</p>
				  <p>Buyer: ${formatAddress(offer.buyer)}</p>
				  <p>Repayment in: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
				`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Buy Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `<p>Canceling Buy Offer: #${offerId}</p>`;
      }

      if ((await cancelBuyOffer(markup, offerId)) == true) {
        document.getElementById("applet-cancel-buy").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-cancel-buy-offer")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-forfeit-sale-offer")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-forfeit-sale-offer")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("forfeit-sale-offer-id").value;
      let sender = await getSenderAddr();
      let offer = await getSaleOfferInfo(offerId);
      let markup;

      if (offer) {
        if (offer.status != "1") {
          createResponsePrompt(
            `<p>Sale Offer #${offerId} is ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        if (sender != offer.buyer) {
          createResponsePrompt(
            `You are not the buyer of sale offer #${offerId}`
          );
          return;
        }

        let ratio = Number(
          getRatio(
            toEther(offer.collateral),
            offer.collateralId,
            toEther(offer.sellFor),
            offer.sellForId
          )
        ).toPrecision(4);

        if (ratio < 1) {
          createResponsePrompt(
            "Collateral to debt ratio is below 1%, this transaction will incur a loss to the seller...aborting"
          );
          return;
        }

        markup = `
					<p>Forfeiting Sale Offer: #${offer.id}</p>
					<p>---------------------------------</p>
		      <p>Collateral Ratio: ${ratio}%</p>
		      <p>Repayment In: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
					<p>---------------------------------</p>
				  <p>Amount Selling: ${formatEther(offer.selling)} ${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Amount Selling For: ${formatEther(offer.sellFor)} ${tokenIdToName(
          offer.sellForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(toEther(offer.selling), toEther(offer.sellFor))
        )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.sellingId, offer.sellForId)
          )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Seller: ${formatAddress(offer.seller)}</p>
				  <p>Buyer: ${formatAddress(offer.buyer)}</p>
				`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Sale Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `<p>Forfeiting Sale Offer: #${offerId}</p>`;
      }

      if ((await forfeitSaleOffer(markup, offerId)) == true) {
        document.getElementById("applet-forfeit-sale").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-forfeit-sale-offer")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-forfeit-buy-offer")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-forfeit-buy-offer")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("forfeit-buy-offer-id").value;
      let sender = await getSenderAddr();
      let offer = await getBuyOfferInfo(offerId);
      let markup;

      if (offer) {
        if (offer.status != "1") {
          createResponsePrompt(
            `<p>Buy Offer #${offerId} is ${formatOfferStatus(offer.status)}</p>`
          );
          return;
        }

        if (sender != offer.buyer) {
          createResponsePrompt(
            `You are not the buyer of buy offer #${offerId}`
          );
          return;
        }

        let ratio = Number(
          getRatio(
            toEther(offer.collateral),
            offer.collateralId,
            toEther(offer.buyFor),
            offer.buyForId
          )
        ).toPrecision(4);

        if (ratio < 1) {
          createResponsePrompt(
            "Collateral to debt ratio is below 1%, this transaction will incur a loss to the seller...aborting"
          );
          return;
        }

        markup = `
					<p>Forfeiting Buy Offer: #${offer.id}</p>
					<p>---------------------------------</p>
		      <p>Collateral Ratio: ${ratio}%</p>
		      <p>Repayment In: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
					<p>---------------------------------</p>
				  <p>Amount Buying: ${formatEther(offer.buying)} ${tokenIdToName(
          offer.buyingId
        )}</p>
				  <p>Amount Buying For: ${formatEther(offer.buyFor)} ${tokenIdToName(
          offer.buyForId
        )}</p>
				  <p>Exchange Rate: ${formatAmount(
            getOfferRate(toEther(offer.buying), toEther(offer.buyFor))
          )} ${tokenIdToName(offer.buyingId)}/${tokenIdToName(
          offer.buyForId
        )}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.buyingId, offer.buyForId)
          )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(
          offer.buyingId
        )}</p>
				  <p>Buyer: ${formatAddress(offer.buyer)}</p>
				  <p>Seller: ${formatAddress(offer.seller)}</p>
				`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Buy Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `<p>Forfeiting Buy Offer: #${offerId}</p>`;
      }

      if ((await forfeitBuyOffer(markup, offerId)) == true) {
        document.getElementById("applet-forfeit-buy").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-forfeit-buy-offer")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-repay-sale")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-repay-sale")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("repay-sale-offer-id").value;
      let repayAmount = document.getElementById(
        "repay-sale-offer-amount"
      ).value;
      let sender = await getSenderAddr();
      let offer = await getSaleOfferInfo(offerId);
      let repayId;
      let markup;

      const getRepayData = (_repayAmount, offerSellFor) => {
        if (_repayAmount == "") {
          if (offerSellFor == "") {
            return [offerSellFor, "(Full Amount)"];
          } else {
            return [toEther(offerSellFor), "(Full Amount)"];
          }
        } else {
          return [_repayAmount, ""];
        }
      };

      if (offer) {
        if (offer.status != "1") {
          createResponsePrompt(
            `<p>Sale Offer #${offerId} is ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        if (sender != offer.buyer) {
          createResponsePrompt(
            `You are not the buyer of sale offer #${offerId}`
          );
          return;
        }

        let repayData = getRepayData(repayAmount, offer.sellFor);
        repayId = offer.sellForId;

        markup = `
		      <p>Repaying Sale Offer: #${offer.id}</p>
		      <p>---------------------------------</p>
		      <p>Repaying: ${repayData[0]} ${tokenIdToName(offer.sellForId)} ${
          repayData[1]
        }</p>
		      <p>Repaying In: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
		      <p>---------------------------------</p>
		      <p>Amount Selling: ${formatEther(offer.selling)} ${tokenIdToName(
          offer.sellingId
        )}</p>
		      <p>Amount Selling For: ${formatEther(offer.sellFor)} ${tokenIdToName(
          offer.sellForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(offer.selling, offer.sellFor)
        )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.sellingId, offer.sellForId)
          )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
		      <p>Collateral: ${formatEther(offer.collateral)} ${tokenIdToName(
          offer.collateralId
        )}</p>
		      <p>Seller: ${formatAddress(offer.seller)}</p>
		      <p>Buyer: ${formatAddress(offer.buyer)}</p>
        `;

        if ((await checkBalance(offer.sellForId, repayData[0])) == false) {
          createResponsePrompt(
            `Insufficient balance for ${tokenIdToName(offer.sellForId)}`
          );
          return;
        }

        if ((await checkAllowance(offer.sellForId, repayData[0])) == false) {
          await approveAllowance(
            offer.sellForId,
            "",
            `Insufficient allowance for ${tokenIdToName(
              offer.sellForId
            )}, please approve following transaction to continue...`
          );
          return;
        }
      } else if (offer == false) {
        createResponsePrompt(`<p>Sale Offer #${offerId} does not exist</p>`);
        return;
      }

      if (repayAmount == "") {
        if ((await repaySaleOffer(markup, offerId, "", "")) == true) {
          document.getElementById("applet-repay-sale").reset();
        }
      } else {
        if (
          (await repaySaleOffer(markup, offerId, repayAmount, repayId)) == true
        ) {
          document.getElementById("applet-repay-sale").reset();
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-repay-sale")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-repay-buy")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-repay-buy")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("repay-buy-offer-id").value;
      let repayAmount = document.getElementById("repay-buy-offer-amount").value;
      let sender = await getSenderAddr();
      let offer = await getBuyOfferInfo(offerId);
      let markup;
      let repayData;
      let repayId;

      const getRepayData = (_repayAmount, offerBuyFor) => {
        if (_repayAmount == "") {
          if (offerBuyFor == "") {
            return [offerBuyFor, "(Full Amount)"];
          } else {
            return [toEther(offerBuyFor), "(Full Amount)"];
          }
        } else {
          return [_repayAmount, ""];
        }
      };

      if (offer) {
        if (offer.status != "1") {
          createResponsePrompt(
            `<p>Buy Offer #${offerId} is ${formatOfferStatus(offer.status)}</p>`
          );
          return;
        }

        if (sender != offer.buyer) {
          createResponsePrompt(
            `You are not the buyer of buy offer #${offerId}`
          );
          return;
        }

        repayData = getRepayData(repayAmount, offer.buyFor);
        repayId = offer.buyingForId;

        markup = `
		      <p>Repaying Buy Offer: #${offer.id}</p>
		      <p>---------------------------------</p>
		      <p>Repaying: ${repayData[0]} ${tokenIdToName(offer.buyForId)} ${
          repayData[1]
        }</p>
		      <p>Repaying In: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
		      <p>---------------------------------</p>
		      <p>Buying: ${formatEther(offer.buying)} ${tokenIdToName(
          offer.buyingId
        )}</p>
		      <p>Buying For: ${formatEther(offer.buyFor)} ${tokenIdToName(
          offer.buyForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(offer.buying, offer.buyFor)
        )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(offer.buyingId)}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.buyingId, offer.buyForId)
          )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(
          offer.buyingId
        )}</p>
		      <p>Collateral: ${formatEther(offer.collateral)} ${tokenIdToName(
          offer.collateralId
        )}</p>
		      <p>Buyer: ${formatAddress(offer.buyer)}</p>
		      <p>Seller: ${formatAddress(offer.seller)}</p>
        `;
        if ((await checkBalance(offer.buyForId, repayData[0])) == false) {
          createResponsePrompt(
            `Insufficient balance for ${tokenIdToName(offer.buyForId)}`
          );
          return;
        }

        if ((await checkAllowance(offer.buyForId, repayData[0])) == false) {
          await approveAllowance(
            offer.buyForId,
            "",
            `Insufficient allowance for ${tokenIdToName(
              offer.buyForId
            )}, please approve following transaction to continue...`
          );
          return;
        }
      } else if (offer == false) {
        createResponsePrompt(`<p>Buy Offer #${offerId} does not exist</p>`);
        return;
      }

      if (repayAmount == "") {
        if ((await repayBuyOffer(markup, offerId, "", "")) == true) {
          document.getElementById("applet-repay-buy").reset();
        }
      } else {
        if (
          (await repayBuyOffer(markup, offerId, repayAmount, repayId)) == true
        ) {
          document.getElementById("applet-repay-buy").reset();
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-repay-buy")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-add-collateral-sale")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-add-collateral-sale")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("add-collateral-sale-id").value;
      let amountAdd = document.getElementById(
        "add-collateral-sale-amount"
      ).value;
      let sender = await getSenderAddr();
      let offer = await getSaleOfferInfo(offerId);
      let amountId;
      let markup;

      if (offer) {
        if (offer.status != "1") {
          createResponsePrompt(
            `<p>Sale Offer #${offerId} is ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        if (sender != offer.buyer) {
          createResponsePrompt(
            `You are not the buyer of sale offer #${offerId}`
          );
          return;
        }

        if ((await checkBalance(offer.collateralId, amountAdd)) == false) {
          createResponsePrompt(
            `Insufficient balance for ${tokenIdToName(offer.collateralId)}`
          );
          return;
        }

        if ((await checkAllowance(offer.collateralId, amountAdd)) == false) {
          await approveAllowance(
            offer.collateralId,
            "",
            `Insufficient allowance for ${tokenIdToName(
              offer.collateralId
            )}, please approve following transaction to continue...`
          );
          return;
        }

        amountId = offer.collateralId;

        markup = `
    			<p>Adding Collateral to Sale Offer: #${offerId}</p>
    			<p>---------------------------------</p>
    			<p>Amount Adding: ${amountAdd} ${tokenIdToName(offer.collateralId)}</p>
    			<p>New Collateral Ratio: ${Number(
            getRatio(
              Number(toEther(offer.collateral)) + Number(amountAdd),
              offer.collateralId,
              toEther(offer.sellFor),
              offer.sellForId
            )
          ).toPrecision(4)}%</p>
    			<p>Old Collateral Ratio: ${Number(
            getRatio(
              toEther(offer.collateral),
              offer.collateralId,
              toEther(offer.sellFor),
              offer.sellForId
            )
          ).toPrecision(4)}%</p>
    			<p>Repaying in: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
    			<p>---------------------------------</p>
		      <p>Amount Selling: ${formatEther(offer.selling)} ${tokenIdToName(
          offer.sellingId
        )}</p>
		      <p>Amount Selling For: ${formatEther(offer.sellFor)} ${tokenIdToName(
          offer.sellForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(toEther(offer.selling), toEther(offer.sellFor))
        )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.sellingId, offer.sellForId)
          )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
		      <p>Seller: ${formatAddress(offer.seller)}</p>
		      <p>Buyer: ${formatAddress(offer.buyer)}</p>
    		`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Sale Offer #${offerId} does not exist</p>`);
        return;
      }

      if (
        (await addCollateralSaleOffer(markup, offerId, amountAdd, amountId)) ==
        true
      ) {
        document.getElementById("applet-add-collateral-sale").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-add-collateral-sale")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-add-collateral-buy")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-add-collateral-buy")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("add-collateral-buy-id").value;
      let amountAdd = document.getElementById(
        "add-collateral-buy-amount"
      ).value;
      let offer = await getBuyOfferInfo(offerId);
      let amountId;
      let markup;

      if (offer) {
        if (offer.status != "1") {
          createResponsePrompt(
            `<p>Buy Offer #${offerId} is ${formatOfferStatus(offer.status)}</p>`
          );
          return;
        }

        if (sender != offer.buyer) {
          createResponsePrompt(
            `You are not the buyer of buy offer #${offerId}`
          );
          return;
        }

        if ((await checkBalance(offer.collateralId, amountAdd)) == false) {
          createResponsePrompt(
            `Insufficient balance for ${tokenIdToName(offer.collateralId)}`
          );
          return;
        }

        if ((await checkAllowance(offer.collateralId, amountAdd)) == false) {
          await approveAllowance(
            offer.collateralId,
            "",
            `Insufficient allowance for ${tokenIdToName(
              offer.collateralId
            )}, please approve following transaction to continue...`
          );
          return;
        }

        amountId = offer.collateralId;

        markup = `
    			<p>Adding Collateral to Buy Offer: #${offerId}</p>
    			<p>---------------------------------</p>
    			<p>Amount Adding: ${amountAdd} ${tokenIdToName(offer.collateralId)}</p>
    			<p>New Collateral Ratio: ${Number(
            getRatio(
              Number(toEther(offer.collateral)) + Number(amountAdd),
              offer.collateralId,
              toEther(offer.buyFor),
              offer.buyForId
            )
          ).toPrecision(4)}%</p>
    			<p>Old Collateral Ratio: ${Number(
            getRatio(
              toEther(offer.collateral),
              offer.collateralId,
              toEther(offer.buyFor),
              offer.buyForId
            )
          ).toPrecision(4)}%</p>
    			<p>Repaying in: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
    			<p>---------------------------------</p>
		      <p>Buying: ${formatEther(offer.buying)} ${tokenIdToName(
          offer.buyingId
        )}</p>
		      <p>Buying For: ${formatEther(offer.buyFor)} ${tokenIdToName(
          offer.buyForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(toEther(offer.buying), toEther(offer.buyFor))
        )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(offer.buyingId)}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.buyingId, offer.buyForId)
          )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(
          offer.buyingId
        )}</p>
		      <p>Seller: ${formatAddress(offer.seller)}</p>
		      <p>Buyer: ${formatAddress(offer.buyer)}</p>
    		`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Sale Offer #${offerId} does not exist</p>`);
        return;
      }

      if (
        (await addCollateralBuyOffer(markup, offerId, amountAdd, amountId)) ==
        true
      ) {
        document.getElementById("applet-add-collateral-buy").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-add-collateral-buy")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-change-addr-sale")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-change-addr-sale")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("change-addr-sale-id").value;
      let newAddr = document.getElementById("change-addr-new-addr-sale").value;
      let sender = await getSenderAddr();
      let offer = await getSaleOfferInfo(offerId);
      let addrType;
      let markup;

      if (offer) {
        if (offer.status == 2) {
          createResponsePrompt(
            `<p>Sale Offer #${offerId} is already ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        if (offer.seller == sender) {
          addrType = 0;
        } else if (offer.buyer == sender) {
          addrType = 1;
        } else {
          createResponsePrompt(
            `You are neither seller or buyer of offer #${offerId}`
          );
          return;
        }

        markup = `
    			<p>Changing ${formatTypeSender(addrType)} Address for Offer #${offerId}</p>
      		<p>---------------------------------</p>
    			<p>Current Address: ${getOfferAddressFromType(
            [offer.seller, offer.buyer],
            addrType
          )}</p>
    			<p>New Address: ${newAddr}</p>
      		<p>---------------------------------</p>
		      <p>Amount Selling: ${formatEther(offer.selling)} ${tokenIdToName(
          offer.sellingId
        )}</p>
		      <p>Amount Selling For: ${formatEther(offer.sellFor)} ${tokenIdToName(
          offer.sellForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(offer.selling, offer.sellFor)
        )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.sellingId, offer.sellForId)
          )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
    		`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Sale Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `
				  <p>Changing address for Offer #${offerId}:</p>
				  <p>New Address: ${newAddr}</p>
    		`;
      }

      if (await changeAddrSaleOffer(markup, offerId, newAddr, addrType)) {
        document.getElementById("applet-change-addr-sale").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-change-addr-sale")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-change-addr-buy")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-change-addr-buy")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("change-addr-buy-id").value;
      let newAddr = document.getElementById("change-addr-new-addr-buy").value;
      let sender = await getSenderAddr();
      let offer = await getBuyOfferInfo(offerId);
      let addrType;
      let markup;

      if (offer) {
        if (offer.status == 2) {
          createResponsePrompt(
            `<p>Sale Offer #${offerId} is already ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        if (offer.seller == sender) {
          addrType = 0;
        } else if (offer.buyer == sender) {
          addrType = 1;
        } else {
          createResponsePrompt(
            `You are neither seller or buyer of offer #${offerId}`
          );
          return;
        }

        markup = `
    			<p>Changing ${formatTypeSender(addrType)} Address for Offer #${offerId}</p>
      		<p>---------------------------------</p>
    			<p>Current Address: ${getOfferAddressFromType(
            [offer.buyer, offer.buyer],
            addrType
          )}</p>
    			<p>New Address: ${newAddr}</p>
      		<p>---------------------------------</p>
		      <p>Buying: ${formatEther(offer.buying)} ${tokenIdToName(
          offer.buyingId
        )}</p>
		      <p>Buying For: ${formatEther(offer.buyFor)} ${tokenIdToName(
          offer.buyForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(offer.buying, offer.buyFor)
        )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(offer.buyingId)}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.buyingId, offer.buyForId)
          )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(
          offer.buyingId
        )}</p>
    		`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Sale Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `
				  <p>Changing address for Offer #${offerId}</p>
				  <p>New Address: ${newAddr}</p>
    		`;
      }

      if (await changeAddrSaleOffer(markup, offerId, newAddr, addrType)) {
        document.getElementById("applet-change-addr-buy").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-change-addr-buy")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-liquidate-sale-offer")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-liquidate-sale-offer")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("liquidate-sale-offer-id").value;
      let sender = await getSenderAddr();
      let offer = await getSaleOfferInfo(offerId);
      let markup;

      if (offer) {
        if (offer.status != "1") {
          createResponsePrompt(
            `<p>Sale Offer #${offerId} is ${formatOfferStatus(
              offer.status
            )}</p>`
          );
          return;
        }

        let ratio = Number(
          getRatio(
            toEther(offer.collateral),
            offer.collateralId,
            toEther(offer.sellFor),
            offer.sellForId
          )
        ).toPrecision(4);

        if (
          ratio > LIQUIDATION_LIMIT &&
          getOfferRepayDeadline(offer.timeAccepted, offer.repayInSec) !=
            "Expired"
        ) {
          createResponsePrompt(
            `<p>Sale Offer #${offerId} can not be liquidated...yet</p>`
          );
          return;
        }

        if (((await getSenderAddr()) == offer.seller) == false) {
          if (
            (await checkBalance(offer.sellForId, toEther(offer.sellFor))) ==
            false
          ) {
            createResponsePrompt(
              `Insufficient balance for ${tokenIdToName(offer.sellForId)}`
            );
            return;
          }

          if (
            (await checkAllowance(offer.sellForId, toEther(offer.sellFor))) ==
            false
          ) {
            await approveAllowance(
              offer.sellForId,
              "",
              `Insufficient allowance for ${tokenIdToName(
                offer.sellForId
              )}, please approve following transaction to continue...`
            );
            return;
          }
        }

        let amountRepaying =
          offer.seller == sender ? `0` : `${formatEther(offer.sellFor)}`;

        let amountReceiving = getAmountReceivingFromLiquidation(
          ratio,
          toEther(offer.collateral),
          offer.collateralId,
          toEther(offer.sellFor),
          offer.sellForId
        );

        markup = `
					<p>Liquidating Sale Offer: #${offer.id}</p>
					<p>---------------------------------</p>
					<p>Amount repaying: ${amountRepaying} ${tokenIdToName(offer.sellForId)}</p>
					<p>Amount receiving: ${formatAmount(amountReceiving[0])} ${tokenIdToName(
          offer.collateralId
        )} ${amountReceiving[1]}</p>
		      <p>Collateral Ratio: ${ratio}%</p>
					<p>---------------------------------</p>
				  <p>Amount Selling: ${formatEther(offer.selling)} ${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Amount Selling For: ${formatEther(offer.sellFor)} ${tokenIdToName(
          offer.sellForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(toEther(offer.selling), toEther(offer.sellFor))
        )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.sellingId, offer.sellForId)
          )} ${tokenIdToName(offer.sellForId)}/${tokenIdToName(
          offer.sellingId
        )}</p>
		      <p>Repayment In: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
				  <p>Seller: ${formatAddress(offer.seller)}</p>
				  <p>Buyer: ${formatAddress(offer.buyer)}</p>
				`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Sale Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `<p>Liquidating Sale Offer: #${offerId}</p>`;
      }

      if ((await liquidateSaleOffer(markup, offerId)) == true) {
        document.getElementById("applet-liquidate-sale").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-liquidate-sale-offer")
        .setAttribute("aria-busy", "false");
    }
  });

document
  .getElementById("confirm-liquidate-buy-offer")
  .addEventListener("click", async (evt) => {
    document
      .getElementById("confirm-liquidate-buy-offer")
      .setAttribute("aria-busy", "true");

    evt.preventDefault();

    try {
      let offerId = document.getElementById("liquidate-buy-offer-id").value;
      let sender = await getSenderAddr();
      let offer = await getBuyOfferInfo(offerId);
      let markup;

      if (offer) {
        if (offer.status != "1") {
          createResponsePrompt(
            `<p>BuyOffer #${offerId} is ${formatOfferStatus(offer.status)}</p>`
          );
          return;
        }

        let ratio = Number(
          getRatio(
            toEther(offer.collateral),
            offer.collateralId,
            toEther(offer.buyFor),
            offer.buyForId
          )
        ).toPrecision(4);

        if (
          ratio > LIQUIDATION_LIMIT &&
          getOfferRepayDeadline(offer.timeAccepted, offer.repayInSec) !=
            "Expired"
        ) {
          createResponsePrompt(
            `<p>Buy Offer #${offerId} can not be liquidated...yet</p>`
          );
          return;
        }

        if (((await getSenderAddr()) == offer.seller) == false) {
          if (
            (await checkBalance(offer.buyForId, toEther(offer.buyFor))) == false
          ) {
            createResponsePrompt(
              `Insufficient balance for ${tokenIdToName(offer.buyForId)}`
            );
            return;
          }

          if (
            (await checkAllowance(offer.buyForId, toEther(offer.buyFor))) ==
            false
          ) {
            await approveAllowance(
              offer.buyForId,
              "",
              `Insufficient allowance for ${tokenIdToName(
                offer.buyForId
              )}, please approve following transaction to continue...`
            );
            return;
          }
        }

        let amountRepaying =
          offer.seller == sender ? `0` : `${formatEther(offer.buyFor)}`;

        let amountReceiving = getAmountReceivingFromLiquidation(
          ratio,
          toEther(offer.collateral),
          offer.collateralId,
          toEther(offer.buyFor),
          offer.buyForId
        );

        markup = `
					<p>Liquidating Buy Offer: #${offer.id}</p>
					<p>---------------------------------</p>
					<p>Amount repaying: ${amountRepaying} ${tokenIdToName(offer.buyForId)}</p>
					<p>Amount receiving: ${formatAmount(amountReceiving[0])} ${
          amountReceiving[1]
        } ${tokenIdToName(offer.collateralId)}</p>
		      <p>Collateral Ratio: ${ratio}%</p>
					<p>---------------------------------</p>
				  <p>Amount Selling: ${formatEther(offer.buying)} ${tokenIdToName(
          offer.buyingId
        )}</p>
				  <p>Amount Selling For: ${formatEther(offer.buyFor)} ${tokenIdToName(
          offer.buyForId
        )}</p>
		    <p>Exchange Rate: ${formatAmount(
          getOfferRate(toEther(offer.buying), toEther(offer.buyFor))
        )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(offer.buyingId)}</p>
				  <p>Market Rate: ${formatAmount(
            getExchangeRate(offer.buyingId, offer.buyForId)
          )} ${tokenIdToName(offer.buyForId)}/${tokenIdToName(
          offer.buyingId
        )}</p>
		      <p>Repayment In: ${getOfferRepayDeadline(
            offer.timeAccepted,
            offer.repayInSec
          )}</p>
				  <p>Seller: ${formatAddress(offer.seller)}</p>
				  <p>Buyer: ${formatAddress(offer.buyer)}</p>
				`;
      } else if (offer == false) {
        createResponsePrompt(`<p>Buy Offer #${offerId} does not exist</p>`);
        return;
      } else {
        markup = `<p>Liquidating Buy Offer: #${offerId}</p>`;
      }

      if ((await liquidateBuyOffer(markup, offerId)) == true) {
        document.getElementById("applet-liquidate-buy").reset();
      }
    } catch (err) {
      console.log(err);
    } finally {
      document
        .getElementById("confirm-liquidate-buy-offer")
        .setAttribute("aria-busy", "false");
    }
  });
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
// Utils functions
async function initPageFromChain() {
  if ((await getChainId()) == dataFtmTestnet.CHAIN_ID) {
    data = dataFtmTestnet;
    prices.pop();
    document.querySelectorAll(".bnb").forEach((item) => {
      item.parentElement.style.display = "none";
    });
    document.getElementById("prices").lastElementChild.remove();
  } else {
    data = dataFtm;
  }
}

// Wallet functions
async function connectWallet() {
  if (typeof window.ethereum == "undefined") {
    createResponsePrompt("Please Install a Web3 Wallet");
    return;
  }

  const accounts = await ethereum.request({
    method: "eth_accounts",
  });

  if (accounts.length == 0) {
    ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .catch((err) => {
        if (err.code === 4001) {
          createResponsePrompt(err.message);
        } else if (err.code === -32002) {
          createResponsePrompt(
            "Please Open Your Wallet to Confirm the Connection Request."
          );
        } else {
          // To Change
          createResponsePrompt("Failed To Connect Wallet");
        }
      });
  } else {
    createResponsePrompt("Wallet Already Connected!");
  }
}

async function connectNetwork(
  _chainId,
  _chainNameLong,
  _chainName,
  _chainScanUrl,
  _chainRpcUrl
) {
  if (typeof window.ethereum == "undefined") {
    createResponsePrompt("Please Install a Web3 Wallet");
    return;
  }

  if ((await getWallet()) == false) {
    createResponsePrompt("Your Wallet is Locked or Not Connected.");
    return;
  }

  if ((await getChainId()) == _chainId) {
    createResponsePrompt(`Already Connected to ${_chainNameLong} Network!`);
  } else {
    createResponsePrompt(`Connecting to ${_chainNameLong} Network...`);

    try {
      await provider.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: _chainId }],
      });

      createResponsePrompt(`Switched to ${_chainNameLong} Network.`);
      window.location.reload();
    } catch (err) {
      if (err.code == 4902) {
        await addNetwork(
          _chainId,
          _chainNameLong,
          _chainName,
          _chainScanUrl,
          _chainRpcUrl
        );
      } else if (err.code == 4001) {
        createResponsePrompt(err.message);
      } else {
        createResponsePrompt(`Failed to switch to ${_chainNameLong} Network.`);
      }
    }
  }
}

async function addNetwork(
  _chainId,
  _chainNameLong,
  _chainName,
  _chainScanUrl,
  _chainRpcUrl
) {
  if (typeof window.ethereum == "undefined" || (await getWallet()) == false) {
    createResponsePrompt("Your Wallet is Locked or Not Connected.");
    return;
  }

  if ((await getChainId()) == _chainId) {
    createResponsePrompt(`Already added ${_chainNameLong} Network!`);
  } else {
    createResponsePrompt(`Adding ${_chainNameLong} Network...`);
    try {
      await provider.provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: _chainId,
            chainName: _chainNameLong,
            rpcUrls: [_chainRpcUrl],
            blockExplorerUrls: [_chainScanUrl],
            nativeCurrency: {
              symbol: _chainName,
              decimals: 18,
            },
          },
        ],
      });
      createResponsePrompt(`Added ${_chainNameLong} Network!`);
    } catch (err) {
      if (err.code == 4001) {
        createResponsePrompt(err.message);
      } else {
        createResponsePrompt("Adding Network failed.");
      }
    }
  }
}

// Get offers and fill tables for home page
async function getOffersHome() {
  if (home.style.display == "") {
    await getOffers(
      0,
      `first: ${OFFERS_TBL_SML}, where: { status: 0 }, orderDirection: desc, orderBy: timeCreated`,
      actionsMarkupHomeSale,
      homeSaleOffersTblBody.id,
      ".accept-offer-sale",
      1
    );

    listenAcceptOffer(0);

    await getOffers(
      1,
      `first: ${OFFERS_TBL_SML}, where: { status: 0 }, orderDirection: desc, orderBy: timeCreated`,
      actionsMarkupHomeBuy,
      homeBuyOffersTblBody.id,
      ".accept-offer-buy",
      1
    );

    listenAcceptOffer(1);
  }
}

// Update data
async function updateChainStatus() {
  if ((await getWallet()) == false) {
    infoNetworkStatus.innerText = "None";
    infoNetworkStatus.style.color = "#f27575";
    return;
  }

  infoNetworkStatus.innerText = chainIdToName(await getChainId());
  infoNetworkStatus.style.color = "rgb(128, 172, 128)";
}

async function updateWalletStatus() {
  if ((await getWallet()) == true) {
    infoWallet.innerText = formatAddress(
      (await ethereum.request({ method: "eth_accounts" }))[0]
    );
    infoWallet.style.color = "rgb(128, 172, 128)";
    connectWalletBtn.innerText = "Connected";
    connectWalletBtn.className = "contrast";
  } else {
    infoWallet.style.color = "#f27575";
    connectWalletBtn.className = "";

    if (typeof window.ethereum == "undefined") {
      infoWallet.innerText = "No Wallet";
    } else {
      infoWallet.innerText = "Locked";
    }
  }
}

async function updateRpcStatus() {
  if (
    typeof window.ethereum !== "undefined" &&
    (await ethereum.isConnected()) == true
  ) {
    infoRpcStatus.innerText = "OK";
    infoRpcStatus.style.color = "rgb(128, 172, 128)";
  } else {
    infoRpcStatus.innerText = "Disconnected";
    infoRpcStatus.style.color = "#f27575";
  }
}

async function updateBlockTimestamp() {
  if ((await getWallet()) == false) {
    return;
  }

  blockTimestamp = (await spectrr.getBlockTimestamp()).toString();
  // console.log("Block Timestamp (UNIX): " + blockTimestamp);
  console.log("Block Timestamp (UTC): " + unixToUtc(blockTimestamp));
}

function updatePricesOnHTML() {
  prices.forEach((item, index) => {
    document.getElementById("prices").children[index].children[0].innerText =
      formatAmount(Number(round(item, 100000, 3)));
  });
}

async function getWallet() {
  if (typeof window.ethereum == "undefined") {
    return false;
  }

  if ((await ethereum.request({ method: "eth_accounts" })).length == 0) {
    return false;
  } else {
    return true;
  }
}

// Get data
async function getChainId() {
  if (typeof window.ethereum == "undefined") {
    createResponsePrompt("Please Install a Web3 Wallet");
    return;
  }

  return await ethereum.request({ method: "eth_chainId" });
}

async function getSenderAddr() {
  if ((await checkEthereumAndWallet()) == false) {
    return;
  }

  return await signer.getAddress();
}

async function getPrices() {
  if ((await getWallet()) == false) {
    return;
  }

  try {
    for (var i = 0; i < prices.length; i++) {
      prices[i] = toEther(
        (await spectrr.tokenIdToPrice(`${i + 1}`)).toString()
      );
    }

    updatePricesOnHTML();
  } catch (err) {
    console.log(err);
  }
}

function getOfferRepayDeadline(offerTimeAccepted, offerRepayInSec) {
  if (offerRepayInSec == 0) {
    return "No limit";
  } else if (offerTimeAccepted == 0) {
    return formatSeconds(offerRepayInSec);
  } else {
    return getTimeLeft(offerTimeAccepted, offerRepayInSec);
  }
}

function getTimeLeft(timeAccepted, repayInSec) {
  let timeLeft = Number(timeAccepted) + Number(repayInSec) - blockTimestamp;

  if (timeLeft > 0) {
    return formatSeconds(timeLeft);
  } else {
    return "Expired";
  }
}

function getRatio(offerCollateral, offerCollateralId, amount, amountId) {
  return (
    (offerCollateral * tokenIdToPrice(offerCollateralId)) /
    (amount * tokenIdToPrice(amountId))
  );
}

function getCollateral(amount, amountId, collateralId) {
  return (
    (amount * tokenIdToPrice(amountId) * COLLATERAL_RATIO) /
    tokenIdToPrice(collateralId)
  );
}

function getOfferRate(base, quote) {
  return quote / base;
}

function getExchangeRate(baseId, quoteId) {
  return tokenIdToPrice(baseId) / tokenIdToPrice(quoteId);
}

function getRateDiff(rate1, rate2) {
  let diff = ((rate1 - rate2) / rate1) * 100;

  if (diff > 0) {
    return [`+${formatAmount(diff.toPrecision(3))}%`, "above"];
  } else {
    return [`${formatAmount(diff.toPrecision(3))}%`, "below"];
  }
}

function getFee(amount) {
  return (amount / 100) * FEE_PERCENT;
}

// Format data
function formatOfferStatus(offerStatus) {
  if (offerStatus == 0) {
    return "open";
  } else if (offerStatus == 1) {
    return "accepted";
  } else if (offerStatus == 2) {
    return "closed";
  } else {
    throw "Invalid offer status";
  }
}

function formatAddress(addr) {
  return addr.slice(0, 8) + "..." + addr.slice(-5);
}

function formatEther(amount) {
  return formatAmount(Number(round(toEther(amount), 100000, 3)));
}

function formatAmount(amount) {
  if (amount < 1) {
    return Number(amount).toPrecision(3);
  } else {
    return amount.toLocaleString("en-US");
  }
}

function formatSeconds(seconds) {
  // Could add more presison by using modulus to get exact time from seconds
  if (seconds >= 31536000) {
    return round(seconds / 31536000, 100, 2) + " year(s)";
  } else if (seconds >= 2592000) {
    return round(seconds / 2592000, 100, 2) + " month(s)";
  } else if (seconds >= 604800) {
    return round(seconds / 604800, 100, 2) + " week(s)";
  } else if (seconds >= 86400) {
    return round(seconds / 86400, 100, 2) + " day(s)";
  } else if (seconds >= 3600) {
    return round(seconds / 3600, 100, 2) + " hour(s)";
  } else if (seconds >= 60) {
    return round(seconds / 60, 100, 2) + " minutes(s)";
  } else if (seconds > 0) {
    return seconds + " second(s)";
  } else {
    return "No limit";
  }
}

function formatSenderType(type) {
  if (type == 2) {
    return "1";
  } else {
    return "0";
  }
}

function formatTypeSender(type) {
  if (type == 1) {
    return "Buyer";
  } else {
    return "Seller";
  }
}

function getOfferAddressFromType(addresses, type) {
  if (type == 1) {
    return addresses[1];
  } else {
    return addresses[0];
  }
}

function round(val, precision, fixedAt) {
  if (val < 0.001) {
    return val;
  } else {
    let valRounded = Math.round(val * precision) / precision;
    return valRounded.toFixed(fixedAt);
  }
}

function getAmountReceivingFromLiquidation(
  ratio,
  collateral,
  collateralId,
  amount,
  amountId
) {
  if (ratio >= 1) {
    return [
      collateral -
        (collateral -
          (amount * tokenIdToPrice(amountId)) / tokenIdToPrice(collateralId)),
      "",
    ];
  } else {
    return [
      collateral,
      "<p style='color:red;'>(Value of amount receiving is below value of amount sending!)</p>",
    ];
  }
}

// Convert data
function toEther(wei) {
  return utils.formatEther(wei);
}

function toWei(_ether) {
  return utils.parseEther(_ether);
}

function unixToUtc(unixSeconds) {
  return new Date(unixSeconds * 1000).toUTCString();
}

/*
function getExactTime(time) {
	return `${padZero(time.getDate())}/${padZero(time.getDay())}/${time.getFullYear()} at ${time.toLocaleTimeString()}`
}

function padZero(num) {
	if (num <= 9) {
		return `0${num}`;
	} else {
		return num;
	} 
}
*/

function chainIdToName(_chainId) {
  if (_chainId == "0xfa") {
    return "Fantom Opera";
  } else if (_chainId == "0xfa2") {
    return "Fantom Testnet";
  } else if (_chainId == "0x1") {
    return "Ethereum Mainnet";
  } else if (_chainId == "0x89") {
    return "Polygon Mainnet";
  } else if (_chainId == "0x13881") {
    return "Polygon Mumbai";
  } else {
    return `Unknown Chain (${_chainId})`;
  }
}

function tokenIdToContract(tokenId) {
  if (tokenId == 1) {
    return ether;
  } else if (tokenId == 2) {
    return btc;
  } else if (tokenId == 3) {
    return eth;
  } else if (tokenId == 4) {
    return usdc;
  } else if (tokenId == 5) {
    return link;
  } else if (tokenId == 6) {
    return bnb;
  } else {
    throw "Invalid Id";
  }
}

function tokenIdToName(tokenId) {
  if (tokenId == 1) {
    return `wFTM`;
  } else if (tokenId == 2) {
    return "wBTC";
  } else if (tokenId == 3) {
    return "wETH";
  } else if (tokenId == 4) {
    return "wUSDC";
  } else if (tokenId == 5) {
    return "wLINK";
  } else if (tokenId == 6) {
    return "wBNB";
  } else {
    throw "Invalid Id";
  }
}

function tokenIdToNameLong(tokenId) {
  if (tokenId == 1) {
    return chainNameLong;
  } else if (tokenId == 2) {
    return "wBitcoin";
  } else if (tokenId == 3) {
    return "wEthereum";
  } else if (tokenId == 4) {
    return "wUSDC";
  } else if (tokenId == 5) {
    return "wChainlink";
  } else if (tokenId == 6) {
    return "wBnb";
  } else {
    throw "Invalid Id";
  }
}

function tokenIdToPrice(tokenId) {
  if (tokenId == 1) {
    return prices[0];
  } else if (tokenId == 2) {
    return prices[1];
  } else if (tokenId == 3) {
    return prices[2];
  } else if (tokenId == 4) {
    return prices[3];
  } else if (tokenId == 5) {
    return prices[4];
  } else if (tokenId == 6) {
    return prices[5];
  } else {
    throw "Invalid token Id";
  }
}

function tokenIdToLogo(tokenId) {
  if (tokenId == 1) {
    return chainLogo;
  } else if (tokenId == 2) {
    return btcLogo;
  } else if (tokenId == 3) {
    return ethLogo;
  } else if (tokenId == 4) {
    return usdcLogo;
  } else if (tokenId == 5) {
    return linkLogo;
  } else if (tokenId == 6) {
    return bnbLogo;
  } else {
    throw "Invalid token Id";
  }
}

function getTokenDecimals(tokenId) {
  if (chainId == "0xfa") {
    if (tokenId == 1) {
      return 18;
    } else if (tokenId == 2) {
      return 8;
    } else if (tokenId == 3) {
      return 18;
    } else if (tokenId == 4) {
      return 6;
    } else if (tokenId == 5) {
      return 18;
    } else if (tokenId == 6) {
      return 18;
    } else {
      throw "Invalid token Id";
    }
  } else {
    if (tokenId >= 1 && tokenId <= 6) {
      return 18;
    } else {
      throw "Invalid token Id";
    }
  }
}

function isLiquidable(offerDeadline, offerRatio) {
  if (
    (offerRatio <= LIQUIDATION_LIMIT && offerRatio !== 0) ||
    offerDeadline == "Expired"
  ) {
    return "Yes";
  } else {
    return "No";
  }
}

function timeToSeconds(time, format) {
  if (format == 1 || format == 0) {
    // seconds
    return time;
  } else if (format == 2) {
    // minutes
    return time * 60;
  } else if (format == 3) {
    // hours
    return time * 3600;
  } else if (format == 4) {
    // days
    return time * 86400;
  } else if (format == 5) {
    // weeks
    return time * 604800;
  } else if (format == 6) {
    // months (30 days)
    return time * 2592000;
  } else if (format == 7) {
    // years (365 days)
    return time * 31536000;
  } else {
    throw "Invalid time format";
  }
}

// Recurring functions
setInterval(getPrices, 20000);
setInterval(updateBlockTimestamp, 30000);
setInterval(updateChainStatus, 30000);
setInterval(updateWalletStatus, 20000);
setInterval(updateRpcStatus, 20000);
setInterval(getOffersHome, 30000);

// Ethereum events
if (typeof window.ethereum !== "undefined") {
  ethereum.on("chainChanged", () => {
    window.location.reload();
  });

  ethereum.on("accountsChanged", () => {
    window.location.reload();
  });

  ethereum.on("disconnect", () => {
    // createResponsePrompt("<p>Wallet Disconnected</p>");
  });

  ethereum.on("connect", () => {
    // window.location.reload();
  });

  ethereum.on("message", (message) => {
    console.log(message);
  });
}
// Prompt box relaying info to user, or asking for confirmation

const promptBox = document.getElementById("prompt-box-confirm");
const promptBoxConfirm = document.getElementById("prompt-box-confirm-btn");
const promptBoxCancel = document.getElementById("prompt-box-cancel-btn");
const promptBoxContent = document.getElementById("prompt-box-confirm-content");
const promptBoxResponse = document.getElementById("prompt-box-response");
const promptBoxResponseClose = document.getElementById(
  "prompt-box-response-close-btn"
);
const promptBoxResponseContent = document.getElementById(
  "prompt-box-response-content"
);
const overlay = document.getElementById("overlay");
const timeout = async (ms) => new Promise((res) => setTimeout(res, ms));

var ans = undefined;

async function waitUserInput() {
  while (ans === undefined) await timeout(50);
}

async function createOfferPrompt(markup) {
  ans = undefined;

  promptBox.style.display = "grid";
  overlay.style.display = "flex";

  promptBoxContent.innerHTML = markup;

  await waitUserInput();

  overlay.style.display = "none";

  return ans;
}

function createResponsePrompt(markup) {
  promptBoxResponse.style.display = "grid";
  overlay.style.display = "flex";
  promptBoxResponseContent.innerHTML = markup;
}

promptBoxConfirm.addEventListener("click", () => {
  promptBox.style.display = "none";
  ans = true;
});

promptBoxCancel.addEventListener("click", () => {
  promptBox.style.display = "none";
  ans = false;
});

promptBoxResponseClose.addEventListener("click", () => {
  promptBoxResponse.style.display = "none";
  overlay.style.display = "none";
});
