console.log("Welcome to Spectrr Finance");

// Library & data files Imports
const contracts = require("@ethersproject/contracts");
const utils = require("@ethersproject/units");
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
const bnbLogo = new URL(
  "./../assets/pics/bnb-bnb-logo.svg",
  import.meta.url
);
const usdcLogo = new URL(
  "./../assets/pics/usd-coin-usdc-logo.svg",
  import.meta.url
);
const ethLogo = new URL(
  "./../assets/pics/ethereum-eth-logo.svg",
  import.meta.url
);

// Constants used for calculations and table generation
const LIQUIDATION_LIMIT = 1.3;
const COLLATERAL_RATIO = 1.6;
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
const connectToFantomTestnet = document.getElementById(
  "connect-ftm-testnet"
);
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
var chainId, chainName, chainNameLong
var spectrr, ether, btc, eth, usdc, bnb, link;
var prices = [0, 0, 0, 0, 0, 0]
