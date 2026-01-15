// Elements (querySelector requirement)
const app = document.querySelector("#app");
const imageCard = document.querySelector("#imageCard");
const storyImage = document.querySelector("#storyImage");
const stepLabel = document.querySelector("#stepLabel");
const sceneTitle = document.querySelector("#sceneTitle");
const storyText = document.querySelector("#storyText");
const secretBox = document.querySelector("#secretBox");
const secretText = document.querySelector("#secretText");
const actions = document.querySelector("#actions");
const confetti = document.querySelector("#confetti");
const heartsLayer = document.querySelector("#heartsLayer");
const tapHint = document.querySelector("#tapHint");

const moodValue = document.querySelector("#moodValue");
const moodFill = document.querySelector("#moodFill");
const saveStatus = document.querySelector("#saveStatus");

const nameInput = document.querySelector("#nameInput");
const saveNameBtn = document.querySelector("#saveNameBtn");
const resetBtn = document.querySelector("#resetBtn");

const clickSound = document.querySelector("#clickSound");

// localStorage keys
const LS_STEP = "cryptid_val_step";
const LS_NAME = "cryptid_val_name";
const LS_MOOD = "cryptid_val_mood";
const LS_POEM = "cryptid_val_poemLine";

let step = Number(localStorage.getItem(LS_STEP)) || 0;
let mood = Number(localStorage.getItem(LS_MOOD)) || 50;
let poemLine = Number(localStorage.getItem(LS_POEM)) || 0;

const poemLines = [
  "Roses are red, the lake is deep.",
  "Your splash is loud, my wings go *eep*.",
  "If humans stare, we do not care.",
  "Be my Valentine, cryptid flair."
];

// 5 scenes, with different interactions
const scenes = [
  {
    title: "Scene 1: Roses + Red Eyes",
    img: "https://placehold.co/900x520/png?text=Scene+1%3A+Mothman+arrives+with+roses",
    text: (name) => `Mothman arrives with roses. ${name || "Someone"} watches from a safe distance because that feels correct.`,
    hint: "Click to toss heart confetti",
    secret: "Secret: The roses might be haunted. Romantic-ish.",
    renderActions: () => {
      addButton("Throw hearts (+5 mood)", "good", () => {
        spawnHearts(10);
        setMood(mood + 5);
        showSecret("Secret: Mothman is trying. Give him that.");
      });
      addButton("Too intense (-5 mood)", "bad", () => {
        setMood(mood - 5);
        showSecret("Secret: Nessie thinks the red eyes are cute. Humans are weak.");
      });
    },
    imageClick: () => {
      spawnHearts(6);
      imageCard.classList.toggle("glow");
      setMood(mood + 2);
    }
  },
  {
    title: "Scene 2: Nessie Surfaces",
    img: "https://placehold.co/900x520/png?text=Scene+2%3A+Nessie+appears+with+heart+bubbles",
    text: () => "Nessie surfaces and makes heart bubbles. It is aggressive wholesomeness.",
    hint: "Click to reveal a cringe poem line",
    secret: () => `Poem line ${poemLine + 1}: ${poemLines[poemLine]}`,
    renderActions: () => {
      addButton("Next poem line (+3 mood)", "good", () => {
        poemLine = (poemLine + 1) % poemLines.length;
        localStorage.setItem(LS_POEM, String(poemLine));
        showSecret(`Poem line ${poemLine + 1}: ${poemLines[poemLine]}`);
        setMood(mood + 3);
      });
      addButton("Hide note", "", () => hideSecret());
    },
    imageClick: () => {
      poemLine = (poemLine + 1) % poemLines.length;
      localStorage.setItem(LS_POEM, String(poemLine));
      showSecret(`Poem line ${poemLine + 1}: ${poemLines[poemLine]}`);
      setMood(mood + 1);
    }
  },
  {
    title: "Scene 3: Dinner Choices",
    img: "https://placehold.co/900x520/png?text=Scene+3%3A+Dinner+on+the+pier",
    text: () => "Dinner time. The menu is mostly seafood. This is awkward for everyone involved.",
    hint: "Click to advance, or pick a dinner option",
    secret: "Secret: The waiter is Bigfoot in a fake mustache.",
    renderActions: () => {
      addButton("Order 'Lake Lasagna' (+8 mood)", "good", () => {
        showSecret("Secret: Somehow it works. Nobody asks what’s in it.");
        setMood(mood + 8);
      });
      addButton("Order 'Fish Tower' (-8 mood)", "bad", () => {
        showSecret("Secret: Mothman pretends to faint so he doesn't have to eat it.");
        setMood(mood - 8);
      });
      addButton("Reveal secret", "", () => showSecret("Secret: The waiter is Bigfoot in a fake mustache."));
    },
    imageClick: () => {
      imageCard.classList.toggle("glow");
      setMood(mood + 1);
    }
  },
  {
    title: "Scene 4: Splash Dance",
    img: "https://placehold.co/900x520/png?text=Scene+4%3A+Dancing+and+splashing",
    text: () => "They dance. Nessie splashes on beat. Mothman tries not to look like a moth at a porch light.",
    hint: "Click for splash shake + confetti",
    secret: "Secret: Someone yelled “KISS” and the fog got thicker out of embarrassment.",
    renderActions: () => {
      addButton("Splash harder (+6 mood)", "good", () => {
        doShakeConfetti();
        setMood(mood + 6);
        showSecret("Secret: The lake is now technically a dance floor.");
      });
      addButton("Stop the chaos (-3 mood)", "bad", () => {
        confetti.classList.remove("on");
        setMood(mood - 3);
        showSecret("Secret: The fish are grateful.");
      });
    },
    imageClick: () => doShakeConfetti()
  },
  {
    title: "Scene 5: Valentine Photo",
    img: "https://placehold.co/900x520/png?text=Scene+5%3A+Valentine+photo+under+stars",
    text: (name) => `They take a Valentine photo under the stars. ${name || "The universe"} approves. Probably.`,
    hint: "Click for glow photo. Then restart.",
    secret: "Secret: This is the healthiest relationship in cryptid history.",
    renderActions: () => {
      addButton("Glow photo (+4 mood)", "good", () => {
        imageCard.classList.add("glow");
        spawnHearts(12);
        setMood(mood + 4);
        showSecret("Secret: Cupid files a complaint because he got outdone by swamp monsters.");
      });
      addButton("Restart story", "", () => restart());
    },
    imageClick: () => {
      imageCard.classList.toggle("glow");
      spawnHearts(8);
      setMood(mood + 2);
      tapHint.textContent = "Click again to restart";
      // next click restarts
      storyImage.dataset.restart = "true";
    }
  }
];

// Helpers
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function playClick(){
  if (!clickSound) return;
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

function setMood(newMood){
  mood = clamp(newMood, 0, 100);
  localStorage.setItem(LS_MOOD, String(mood));
  moodValue.textContent = String(mood);        // textContent requirement
  moodFill.style.width = mood + "%";
}

function showSecret(text){
  secretBox.style.display = "block";
  secretText.textContent = text;
}

function hideSecret(){
  secretBox.style.display = "none";
}

function addButton(label, kind, fn){
  const btn = document.createElement("button");
  btn.className = "pill" + (kind ? " " + kind : "");
  btn.textContent = label;
  btn.addEventListener("click", fn);           // addEventListener requirement
  actions.appendChild(btn);
}

function clearActions(){
  actions.innerHTML = "";                      // innerHTML requirement
}

function spawnHearts(count){
  const hearts = ["💖","💘","💕","💗","💓","💞"];
  for(let i=0;i<count;i++){
    const el = document.createElement("div");
    el.className = "heart";
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = Math.random() * 90 + "%";
    el.style.top = (60 + Math.random() * 30) + "%";
    heartsLayer.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }
}

function doShakeConfetti(){
  imageCard.classList.remove("shake");
  void imageCard.offsetWidth; // force reflow so shake replays
  imageCard.classList.add("shake");
  confetti.classList.toggle("on");             // classList.toggle requirement
  setMood(mood + 2);
  showSecret("Secret: The lake is having a main character moment.");
  playClick();
}

function saveProgress(){
  localStorage.setItem(LS_STEP, String(step));
  saveStatus.textContent = `Saved: step ${step + 1}, mood ${mood}`;
}

function render(){
  const name = localStorage.getItem(LS_NAME) || "";
  nameInput.value = name;

  const scene = scenes[step];

  stepLabel.textContent = `Step ${step + 1} of 5`;
  sceneTitle.textContent = scene.title;
  storyText.textContent = scene.text(name);

  storyImage.src = scene.img;
  tapHint.textContent = scene.hint;

  // reset UI bits
  imageCard.classList.remove("glow", "shake");
  confetti.classList.remove("on");
  storyImage.dataset.restart = "";

  hideSecret();
  clearActions();
  scene.renderActions();

  setMood(mood);
  saveProgress();
}

function nextStep(){
  step = (step + 1) % scenes.length;
  render();
  playClick();
}

function restart(){
  step = 0;
  mood = 50;
  poemLine = 0;
  localStorage.setItem(LS_POEM, "0");
  setMood(50);
  render();
}

// Buttons
saveNameBtn.addEventListener("click", () => {
  localStorage.setItem(LS_NAME, nameInput.value.trim());
  render();
  playClick();
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem(LS_STEP);
  localStorage.removeItem(LS_NAME);
  localStorage.removeItem(LS_MOOD);
  localStorage.removeItem(LS_POEM);
  step = 0;
  mood = 50;
  poemLine = 0;
  render();
});

// Image click logic per scene
storyImage.addEventListener("click", () => {
  const scene = scenes[step];

  // final scene special restart behavior
  if (step === 4 && storyImage.dataset.restart === "true") {
    restart();
    return;
  }

  scene.imageClick();

  // Most scenes: click also advances after a tiny delay so you see the effect
  // Scene 2 and 4 feel better staying in place unless you choose to move on
  if (step === 1 || step === 3) return;

  setTimeout(nextStep, 280);
});

// Init
render();

        