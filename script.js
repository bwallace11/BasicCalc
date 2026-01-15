// Select elements
const image = document.querySelector("#storyImage");
const caption = document.querySelector("#story-caption");
const hiddenText = document.querySelector("#hidden-text");
const dots = document.querySelectorAll(".dot");

const nameInput = document.querySelector("#name");
const saveNameBtn = document.querySelector("#saveName");

// Story text
const captions = [
  "Mothman waits nervously near the bridge on Valentine’s night.",
  "Nessie rises from the lake, right on time.",
  "They talk about being misunderstood.",
  "The night feels calm and warm for once.",
  "They promise to meet again next Valentine’s Day."
];

// Track step (state)
let currentStep = localStorage.getItem("storyStep")
  ? Number(localStorage.getItem("storyStep"))
  : 0;

// Load saved name
const savedName = localStorage.getItem("userName");
if (savedName) {
  nameInput.value = savedName;
}

// Initial render
updateStory();

// CLICK = MAIN EVENT FLOW
image.addEventListener("click", function () {

  // advance state
  currentStep++;

  if (currentStep > 4) {
    currentStep = 0;
  }

  localStorage.setItem("storyStep", currentStep);

  // update UI
  updateStory();
});

// Save name
saveNameBtn.addEventListener("click", function () {
  localStorage.setItem("userName", nameInput.value);
  updateStory();
});

// Update everything
function updateStory() {
  const name = nameInput.value || "Someone";

  caption.textContent = captions[currentStep] + " — " + name;

  image.src = `assets/images/image-${currentStep + 1}.jpg`;

  // reset effects
  image.classList.remove("zoom", "glow");
  hiddenText.classList.add("hidden");

  // step-specific interactions
  if (currentStep === 1) {
    hiddenText.classList.remove("hidden");
  }

  if (currentStep === 2) {
    image.classList.add("zoom");
  }

  if (currentStep === 3) {
    image.classList.add("glow");
  }

  updateProgress();
}

// Progress dots
function updateProgress() {
  dots.forEach((dot, index) => {
    if (index <= currentStep) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}
