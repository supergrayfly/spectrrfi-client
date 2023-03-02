// Utils functions
async function initPageFromChain() {
  let _chainId = await getChainId();

  if (_chainId == dataMumbai.CHAIN_ID) {
    data = dataMumbai;
    chainLogo = new URL(
      "./../assets/pics/polygon-matic-logo.svg",
      import.meta.url
    );
    document.getElementById(
      "prices"
    ).children[0].childNodes[0].data = `${data.CHAIN_NAME}: `;
    document.querySelectorAll(".chain-logo").forEach((item) => {
      item.parentElement.innerHTML = `<img src='${chainLogo}' class="matic"/>w${data.CHAIN_NAME}`;
    });
document.querySelectorAll('.bnb').forEach((item) => {
    item.parentElement.style.display = 'none'
})
document.getElementById('prices').lastElementChild.remove();
prices.pop()
  } else {
    data = dataFtm;
    chainLogo = new URL(
      "./../assets/pics/fantom-ftm-logo.svg",
      import.meta.url
    );
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
  		prices[i] = toEther((await spectrr.tokenIdToPrice(`${i + 1}`)).toString());
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
  }  else if (tokenId == 5) {
		return bnb;
	} else {
    throw "Invalid Id";
  }
}

function tokenIdToName(tokenId) {
  if (tokenId == 1) {
    return `w${chainName}`;
  } else if (tokenId == 2) {
    return "wBTC";
  } else if (tokenId == 3) {
    return "wETH";
  } else if (tokenId == 4) {
    return "USDC";
  }  else if (tokenId == 5) {
		return "fBNB"
	} else {
    throw "Invalid Id";
  }
}

function tokenIdToNameLong(tokenId) {
  if (tokenId == 1) {
    return chainNameLong;
  } else if (tokenId == 2) {
    return "Bitcoin";
  } else if (tokenId == 3) {
    return "Ethereum";
  } else if (tokenId == 4) {
    return "USDC";
	} else if (tokenId == 5) {
		return "Bnb"
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
		return priceBnb
	} else {
    throw "Invalid token Id";
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
setInterval(getPrices, 30000);
setInterval(updateBlockTimestamp, 60000);
setInterval(updateChainStatus, 30000);
setInterval(updateWalletStatus, 30000);
setInterval(updateRpcStatus, 30000);
// setInteval(getOffersHome, 30000)

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
