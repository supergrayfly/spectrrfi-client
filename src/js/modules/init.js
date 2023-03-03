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
