const image = document.querySelector('#story-image');
const caption = document.querySelector('#story-caption');
const dots = document.querySelectorAll('.dot');
const resetBtn = document.querySelector('#reset-btn');

const modal = document.querySelector('#name-modal');
const nameInput = document.querySelector('#name-input');
const submitName = document.querySelector('#submit-name');

const captions = [
  "Click the image to start the date.",
  "Mothman was nervous. Valentine’s Day always made his wings shake.",
  "At Loch Ness, Nessie waved. She planned the whole thing.",
  "They talked, laughed, and shared snacks by the water.",
  "Some connections feel strange but safe at the same time."
];

let currentStep = 0;

image.addEventListener('click', function () {
  currentStep++;

  if (currentStep < captions.length) {
    caption.textContent = captions[currentStep];
    image.src = `assets/images/image-${currentStep + 1}.jpg`;

    image.classList.toggle('glow');
    updateProgress(currentStep);
    localStorage.setItem('storyStep', currentStep);
  } else {
    modal.classList.remove('hidden');
  }
});

submitName.addEventListener('click', function () {
  const name = nameInput.value.trim();

  if (name !== "") {
    caption.textContent = `Happy Valentine’s Day, ${name}! 💕`;
    modal.classList.add('hidden');
    localStorage.setItem('valentineName', name);
  }
});

resetBtn.addEventListener('click', function () {
  currentStep = 0;

  caption.textContent = captions[0];
  image.src = "assets/images/image-1.jpg";

  dots.forEach(dot => dot.classList.remove('active'));
  dots[0].classList.add('active');

  localStorage.clear();
  nameInput.value = "";
});

function updateProgress(step) {
  dots.forEach((dot, index) => {
    if (index <= step) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

/* Restore state */
const savedStep = localStorage.getItem('storyStep');
const savedName = localStorage.getItem('valentineName');

if (savedStep !== null) {
  currentStep = Number(savedStep);
  caption.textContent = captions[currentStep];
  image.src = `assets/images/image-${currentStep + 1}.jpg`;
  updateProgress(currentStep);
}

if (savedName) {
  caption.textContent = `Happy Valentine’s Day, ${savedName}! 💕`;
}
