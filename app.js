let allCards = [];
let cards = [];
let currentIndex = 0;
let answerShown = false;

const counterEl = document.getElementById("counter");
const progressBar = document.getElementById("progressBar");
const wordEl = document.getElementById("word");
const translationEl = document.getElementById("translation");
const groupDescriptionEl = document.getElementById("groupDescription");
const groupBadgeEl = document.getElementById("groupBadge");
const answerBlock = document.getElementById("answerBlock");
const cardEl = document.getElementById("card");
const groupFilter = document.getElementById("groupFilter");

const showBtn = document.getElementById("showBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

async function loadCards() {
  try {
    const response = await fetch("cards.json");
    allCards = await response.json();
    cards = [...allCards];
    fillGroups();
    renderCard();
  } catch (error) {
    wordEl.textContent = "Не удалось загрузить cards.json";
    translationEl.textContent = "Проверь, что файл лежит рядом с index.html";
    showAnswer();
  }
}

function fillGroups() {
  const groups = [...new Map(allCards.map(card => [card.group, card.groupDescription])).entries()];

  groups.forEach(([group, description]) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = `${group} — ${description}`;
    groupFilter.appendChild(option);
  });
}

function renderCard() {
  if (!cards.length) {
    counterEl.textContent = "0 / 0";
    progressBar.style.width = "0%";
    wordEl.textContent = "Нет карточек";
    groupBadgeEl.textContent = "Empty";
    hideAnswer();
    return;
  }

  const card = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  counterEl.textContent = `${currentIndex + 1} / ${cards.length}`;
  progressBar.style.width = `${progress}%`;
  groupBadgeEl.textContent = `Group ${card.group}`;
  wordEl.textContent = card.word;
  translationEl.textContent = card.translation;
  groupDescriptionEl.textContent = card.groupDescription;

  answerShown = false;
  hideAnswer();
}

function showAnswer() {
  answerShown = true;
  answerBlock.classList.remove("hidden");
  showBtn.textContent = "Ответ открыт";
}

function hideAnswer() {
  answerBlock.classList.add("hidden");
  showBtn.textContent = "Показать ответ";
}

function toggleAnswer() {
  answerShown ? hideAnswer() : showAnswer();
  answerShown = !answerShown;
}

function nextCard() {
  currentIndex = (currentIndex + 1) % cards.length;
  renderCard();
}

function prevCard() {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  renderCard();
}

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  currentIndex = 0;
  renderCard();
}

function applyFilter() {
  const selectedGroup = groupFilter.value;
  cards = selectedGroup === "all"
    ? [...allCards]
    : allCards.filter(card => card.group === selectedGroup);

  currentIndex = 0;
  renderCard();
}

showBtn.addEventListener("click", showAnswer);
cardEl.addEventListener("click", toggleAnswer);
nextBtn.addEventListener("click", nextCard);
prevBtn.addEventListener("click", prevCard);
shuffleBtn.addEventListener("click", shuffleCards);
groupFilter.addEventListener("change", applyFilter);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    showAnswer();
  }

  if (event.code === "ArrowRight") nextCard();
  if (event.code === "ArrowLeft") prevCard();
});

loadCards();
