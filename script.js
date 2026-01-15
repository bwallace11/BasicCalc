// Find elements
const image = document.querySelector("#storyImage");
const caption = document.querySelector("#story-caption");
const hiddenText = document.querySelector("#hidden-text");
const dots = document.querySelectorAll(".dot");

const nameInput = document.querySelector("#name");
const saveNameBtn = document.querySelector("#saveName");

// Story text
const captions = [
  "Click the image to begin the story.",
  "A quiet morning. A message sent just to check in.",
  "A shared laugh over something small.",
  "Being there when the day gets heavy.",
  "A reminder that connection matters."
];

// Track step
let currentStep = localStorage.getItem("step")
  ? Number(localStorage.getItem("step"))
  : 0;

// Load saved name
const savedName = localStorage.getItem("name");
if (savedName) {
  nameInput.value = savedName;
}

// Initial render
updateStory();

// Click interaction
image.addEventListener("click", function () {
  currentStep++;

  if (currentStep > 4) {
    currentStep = 0;
  }

  localStorage.setItem("step", currentStep);

  updateStory();
});

// Save name
saveNameBtn.addEventListener("click", function () {
  localStorage.setItem("name", nameInput.value);
  updateStory();
});

function updateStory() {
  const name = nameInput.value || "Someone";

  caption.textContent = captions[currentStep] + ` — ${name}`;

  image.src = `assets/images/image-${currentStep + 1}.jpg`;

  // Reveal hidden text on step 3
  if (currentStep === 2) {
    hiddenText.classList.remove("hidden");
  } else {
    hiddenText.classList.add("hidden");
  }

  // Add visual effect on step 4
  if (currentStep === 3) {
    image.classList.add("zoom");
  } else {
    image.classList.remove("zoom");
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
