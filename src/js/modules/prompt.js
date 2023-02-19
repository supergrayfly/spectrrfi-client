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
