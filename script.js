const image = document.querySelector('#storyImage');
const caption = document.querySelector('#story-caption');
const dots = document.querySelectorAll('.dot');
const clickContinue = document.querySelector('#clickContinue');
const hearts = document.querySelector('#hearts');
const resetButton = document.querySelector('#resetButton');
const storyImageContainer = document.querySelector('.story-image');
const nameIntro = document.querySelector('#nameIntro');
const nameInput = document.querySelector('#nameInput');
const startButton = document.querySelector('#startButton');

let currentStep = 0;
let userName = "Friend";
let isTyping = false;

const images = [
  "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=400&fit=crop"
];

const captions = [
  "Click to begin the story...",
  "It was Valentine's Day, and Mothman nervously fluttered above Loch Ness. His crimson eyes glowed in the moonlight as he clutched a bouquet of night-blooming flowers.",
  "Nessie emerged from the dark waters, her elegant neck rising gracefully. 'You came,' she whispered, her eyes sparkling like the stars reflected on the loch.",
  "They shared a romantic dinner on a tiny island. Mothman had brought moonlight cookies, while Nessie prepared fresh Scottish salmon. The night air was filled with magic.",
  "As they talked, they realized how much they had in common—both were misunderstood, both loved the night, and both had been searching for someone who understood them.",
  "Under a sky full of stars, Mothman and Nessie promised to meet every Valentine's Day. True love knows no bounds—not even between a cryptid moth and a legendary lake monster. 💕"
];

// Load saved progress from localStorage
function loadProgress() {
  const savedStep = localStorage.getItem('storyStep');
  const savedName = localStorage.getItem('userName');
  
  if (savedStep !== null) {
    currentStep = parseInt(savedStep);
  }
  
  if (savedName !== null) {
    userName = savedName;
    nameInput.value = savedName;
  }
  
  // If there's saved progress, hide the name intro and display the saved state
  if (savedStep !== null && savedName !== null) {
    nameIntro.classList.add('hidden');
    displayCurrentState();
  }
}

// Display current state without auto-advancing
function displayCurrentState() {
  // Update image
  image.src = images[currentStep];
  
  // Update progress dots
  updateProgressDots(currentStep);
  
  // Display caption without typewriter effect for saved state
  if (currentStep === captions.length - 1) {
    caption.innerHTML = `<span class="final-message">Happy Valentine's Day!<br>${userName}</span>`;
    caption.classList.add('typing');
    clickHint.classList.add('hidden');
    hearts.classList.add('show');
    resetButton.classList.add('show');
  } else {
    caption.textContent = captions[currentStep];
    caption.classList.add('typing');
  }
}

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem('storyStep', currentStep.toString());
  localStorage.setItem('userName', userName);
}

// Clear progress from localStorage
function clearProgress() {
  localStorage.removeItem('storyStep');
  localStorage.removeItem('userName');
}

function typeWriter(text, element, speed = 33) {
  return new Promise((resolve) => {
    element.textContent = '';
    element.classList.add('typing');
    let i = 0;
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    
    type();
  });
}

async function updateStory() {
  if (isTyping) return;
  
  if (currentStep >= captions.length) {
    currentStep = captions.length - 1;
    resetButton.classList.add('show');
    return;
  }

  isTyping = true;
  caption.classList.remove('typing');
  
  await new Promise(resolve => setTimeout(resolve, 100));

  // Type out the caption
  if (currentStep === captions.length - 1) {
    caption.innerHTML = `<span class="final-message">Happy Valentine's Day!<br>${userName}</span>`;
    caption.classList.add('typing');
  } else {
    await typeWriter(captions[currentStep], caption);
  }

  // Show special effects for final slide
  if (currentStep === captions.length - 1) {
    clickHint.classList.add('hidden');
    hearts.classList.add('show');
    resetButton.classList.add('show');
  }

  storyImageContainer.classList.add('clicked');
  setTimeout(() => {
    storyImageContainer.classList.remove('clicked');
  }, 300);

  // Save progress after updating
  saveProgress();
  
  isTyping = false;
}

function updateProgressDots(step) {
  dots.forEach((dot, index) => {
    if (index <= step) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

storyImageContainer.addEventListener('click', function() {
  if (nameIntro.classList.contains('hidden') && !isTyping && currentStep < captions.length - 1) {
    currentStep++;
    
    // Update image and progress BEFORE typing starts
    image.src = images[currentStep];
    updateProgressDots(currentStep);
    
    updateStory();
  }
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', function() {
    if (!nameIntro.classList.contains('hidden') || isTyping) return;
    if (index <= currentStep) {
      currentStep = index;
      
      // Update image and progress BEFORE typing starts
      image.src = images[currentStep];
      updateProgressDots(currentStep);
      
      updateStory();
    }
  });
});

startButton.addEventListener('click', function() {
  const inputName = nameInput.value.trim();
  if (inputName) {
    userName = inputName;
  }
  
  nameIntro.classList.add('hidden');
  currentStep = 0;
  
  // Set initial image and progress
  image.src = images[currentStep];
  updateProgressDots(currentStep);
  
  saveProgress();
  updateStory();
});

nameInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    startButton.click();
  }
});

resetButton.addEventListener('click', function() {
  // Clear localStorage and reset everything
  clearProgress();
  
  currentStep = 0;
  hearts.classList.remove('show');
  clickHint.classList.remove('hidden');
  resetButton.classList.remove('show');
  
  // Show name input again
  nameIntro.classList.remove('hidden');
  nameInput.value = '';
  userName = "Friend";
  
  // Reset the display
  caption.classList.remove('typing');
  caption.textContent = '';
  image.src = images[0];
  updateProgressDots(0);
});

// Load progress when page loads
window.addEventListener('DOMContentLoaded', function() {
  loadProgress();
});