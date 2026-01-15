// Select elements
const image = document.querySelector("#storyImage");
const caption = document.querySelector("#story-caption");
const hiddenText = document.querySelector("#hidden-text");
const dots = document.querySelectorAll(".dot");

const nameInput = document.querySelector("#name");
const saveNameBtn = document.querySelector("#saveName");

// Story captions
const captions = [
  "Mothman waits near the bridge on Valentine’s night.",
  "Nessie surfaces from the lake, right on time.",
  "They share stories about being misunderstood.",
  "The night feels calm and safe for once.",
  "They promise to meet again next Valentine’s Day."
];

// Track story step
let currentStep = localStorage.getItem("storyStep")
  ? Number(localStorage.getItem("storyStep"))
  : 0;

// Load saved name
const savedName = localStorage.getItem("userName");
if (savedName) {
  nameInput.value = savedName;
}

// Initial display
updateStory();

// Image click
image.addEventListener("click", function () {
  currentStep++;

  if (currentStep > 4) {
    currentStep = 0;
  }

  localStorage.setItem("storyStep", currentStep);
  updateStory();
});

// Save name
saveNameBtn.addEventListener("click", function () {
  localStorage.setItem("userName", nameInput.value);
  updateStory();
});

// Update UI
function updateStory() {
  const name = nameInput.value || "Someone";

  caption.textContent = captions[currentStep] + " — " + name;

  image.src = `assets/images/image-${currentStep + 1}.jpg`;

  // Reveal hidden text on step 3
  if (currentStep === 2) {
    hiddenText.classList.remove("hidden");
  } else {
    hiddenText.classList.add("hidden");
  }

  // Visual effect on step 4
  if (currentStep === 3) {
    image.classList.add("glow");
  } else {
    image.classList.remove("glow");
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
