const storyImage = document.querySelector("#storyImage");
const storyText = document.querySelector("#storyText");
const stepLabel = document.querySelector("#stepLabel");
const secretText = document.querySelector("#secretText");
const app = document.querySelector("#app");
const imageCard = document.querySelector("#imageCard");
const confetti = document.querySelector("#confetti");
const saveStatus = document.querySelector("#saveStatus");

const nameInput = document.querySelector("#nameInput");
const saveNameBtn = document.querySelector("#saveNameBtn");
const resetBtn = document.querySelector("#resetBtn");

const revealBtn = document.querySelector("#revealBtn");
const sparkleBtn = document.querySelector("#toggleSparkleBtn");

const LS_STEP = "cryptid_step";
const LS_NAME = "cryptid_name";

let currentStep = Number(localStorage.getItem(LS_STEP)) || 0;

const steps = [
  {
    img: "https://placehold.co/900x500?text=Mothman+arrives+with+roses",
    text: name => `Mothman arrives holding roses. ${name || "Someone"} is already uncomfortable.`
  },
  {
    img: "https://placehold.co/900x500?text=Nessie+appears+with+heart+bubbles",
    text: () => "Nessie surfaces. Heart bubbles. Zero shame."
  },
  {
    img: "https://placehold.co/900x500?text=Dinner+on+the+pier",
    text: () => "Dinner on the pier. Candles. Fog. Bad decisions."
  },
  {
    img: "https://placehold.co/900x500?text=Dancing+by+the+lake",
    text: () => "They dance. The lake splashes on beat."
  },
  {
    img: "https://placehold.co/900x500?text=Valentine’s+promise",
    text: name => `A Valentine’s promise is made. ${name || "The universe"} approves.`
  }
];

function render() {
  const name = localStorage.getItem(LS_NAME);
  const step = steps[currentStep];

  storyImage.src = step.img;
  storyText.textContent = step.text(name);
  stepLabel.textContent = `Step ${currentStep + 1} of 5`;

  saveStatus.textContent = `Saved at step ${currentStep + 1}`;
}

storyImage.addEventListener("click", () => {
  imageCard.classList.toggle("glow");

  currentStep = (currentStep + 1) % steps.length;
  localStorage.setItem(LS_STEP, currentStep);
  render();
});

revealBtn.addEventListener("click", () => {
  app.classList.toggle("show-secret");
  secretText.textContent = "Hidden note: This date breaks several laws of nature.";
});

sparkleBtn.addEventListener("click", () => {
  confetti.classList.toggle("on");
});

saveNameBtn.addEventListener("click", () => {
  localStorage.setItem(LS_NAME, nameInput.value.trim());
  render();
});

resetBtn.addEventListener("click", () => {
  localStorage.clear();
  currentStep = 0;
  nameInput.value = "";
  render();
});

render();

        