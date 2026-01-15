const image = document.querySelector('#story-image');
const caption = document.querySelector('#story-caption');
const dots = document.querySelectorAll('.dot');

const captions = [
  "Click the image to begin the story.",
  "Mothman hated Valentine’s Day. Too many feelings. Too many cards.",
  "At Loch Ness, he finally met Nessie. She brought snacks.",
  "They shared stories, laughs, and fears by the water.",
  "Love doesn’t have to be perfect to be real."
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
  }
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

const savedStep = localStorage.getItem('storyStep');

if (savedStep !== null) {
  currentStep = Number(savedStep);
  caption.textContent = captions[currentStep];
  image.src = `assets/images/image-${currentStep + 1}.jpg`;
  updateProgress(currentStep);
}
