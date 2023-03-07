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
            "Collateral to debt ratio is below 1%, this trnsaction will incur a loss to the seller...aborting"
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
            "Collateral to debt ratio is below 1%, this trnsaction will incur a loss to the seller...aborting"
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
				  <p>Amount Selling: ${formatEther(offer.buying)} ${tokenIdToName(
          offer.buyingId
        )}</p>
				  <p>Amount Selling For: ${formatEther(offer.buyFor)} ${tokenIdToName(
          offer.buyForId
        )}</p>
				  <p>Exchange Rate: ${formatEther(offer.exchangeRate)} ${tokenIdToName(
          offer.buyingId
        )}/${tokenIdToName(offer.buyForId)}</p>
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
