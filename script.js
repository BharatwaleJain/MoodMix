const moods = [
  {
    id: "happy",
    name: "Happy",
    emoji: "☀️",
    color: "#ffd166",
    description: "Feel-good Bollywood hits to brighten your day.",
    songs: [
      { title: "Ilahi", artist: "Arijit Singh" },
      { title: "Gallan Goodiyaan", artist: "Yashita Sharma, Manish Kumar Tipu, Farhan Akhtar, Shankar Mahadevan, Sukhwinder Singh" },
      { title: "Badtameez Dil", artist: "Benny Dayal, Shefali Alvares" },
      { title: "London Thumakda", artist: "Labh Janjua, Sonu Kakkar, Neha Kakkar" },
      { title: "Aaj Ki Party", artist: "Mika Singh" },
    ],
  },
  {
    id: "chill",
    name: "Chill",
    emoji: "🌊",
    color: "#7dd3c7",
    description: "Soulful Hindi melodies for slow, peaceful moments.",
    songs: [
      { title: "Iktara", artist: "Kavita Seth" },
      { title: "Shaam", artist: "Amit Trivedi, Nikhil D'Souza, Neuman Pinto" },
      { title: "Kho Gaye Hum Kahan", artist: "Jasleen Royal, Prateek Kuhad" },
      { title: "Kasoor", artist: "Prateek Kuhad" },
      { title: "Phir Se Ud Chala", artist: "Mohit Chauhan" },
    ],
  },
  {
    id: "focused",
    name: "Focused",
    emoji: "🎯",
    color: "#7c9cff",
    description: "Calm instrumentals and gentle melodies for deep focus.",
    songs: [
      { title: "Agar Tum Saath Ho (Instrumental)", artist: "Tamasha" },
      { title: "Kabira (Encore)", artist: "Arijit Singh, Harshdeep Kaur" },
      { title: "Bombay Theme", artist: "A. R. Rahman" },
      { title: "Jashn-E-Bahaaraa", artist: "A. R. Rahman, Javed Ali" },
      { title: "Maa (Instrumental)", artist: "Taare Zameen Par" },
    ],
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "🌧️",
    color: "#b8c1ec",
    description: "Heart-touching Bollywood songs for emotional moments.",
    songs: [
      { title: "Channa Mereya", artist: "Arijit Singh" },
      { title: "Agar Tum Saath Ho", artist: "Alka Yagnik, Arijit Singh" },
      { title: "Phir Le Aya Dil (Reprise)", artist: "Arijit Singh" },
      { title: "Tune Jo Na Kaha", artist: "Mohit Chauhan" },
      { title: "Hamari Adhuri Kahani", artist: "Arijit Singh" },
    ],
  },
  {
    id: "energetic",
    name: "Energetic",
    emoji: "⚡",
    color: "#ff6b6b",
    description: "Bollywood bangers for dancing, workouts, and full power.",
    songs: [
      { title: "Malhari", artist: "Vishal Dadlani" },
      { title: "Zinda", artist: "Siddharth Mahadevan" },
      { title: "Jai Jai Shivshankar", artist: "Vishal Dadlani, Benny Dayal" },
      { title: "Kar Gayi Chull", artist: "Badshah, Amaal Mallik, Fazilpuria, Sukriti Kakar, Neha Kakkar" },
      { title: "Nashe Si Chadh Gayi", artist: "Arijit Singh" },
    ],
  },
];

const STORAGE_KEYS = {
  favorites: "moodmix-favorites",
  theme: "moodmix-theme",
};

const moodGrid = document.querySelector(".mood-grid");
const songGrid = document.querySelector(".song-grid");
const moodDescription = document.querySelector(".mood-description");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.querySelector(".theme-label");

let selectedMoodId = null;
let currentFilter = "all";
let favorites = loadFavorites();

function getSongId(song) {
  return `${song.title}::${song.artist}`;
}

function loadFavorites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.favorites);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
}

function isFavorite(song) {
  const id = getSongId(song);
  return favorites.some((saved) => getSongId(saved) === id);
}

function toggleFavorite(song) {
  if (isFavorite(song)) {
    favorites = favorites.filter((saved) => getSongId(saved) !== getSongId(song));
  } else {
    favorites.push(song);
  }

  saveFavorites();
  renderSongs();
}

function youtubeSearchUrl(song) {
  const query = encodeURIComponent(`${song.title} ${song.artist}`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

function renderMoods() {
  moodGrid.innerHTML = moods
    .map(
      (mood) => `
      <button
        class="mood-card${mood.id === selectedMoodId ? " is-selected" : ""}"
        type="button"
        data-mood="${mood.id}"
        style="--mood-color: ${mood.color}"
        aria-pressed="${mood.id === selectedMoodId}"
      >
        <span class="mood-emoji" aria-hidden="true">${mood.emoji}</span>
        <span class="mood-name">${mood.name}</span>
        <span class="mood-blurb">${mood.description}</span>
      </button>
    `
    )
    .join("");
}

function getSongsToShow() {
  if (currentFilter === "favorites") {
    return favorites;
  }

  if (!selectedMoodId) {
    return [];
  }

  return moods.find((mood) => mood.id === selectedMoodId).songs;
}

function renderEmptyState(message, emoji) {
  songGrid.innerHTML = `
    <div class="empty-state">
      <span aria-hidden="true">${emoji}</span>
      <h3>${message.title}</h3>
      <p>${message.body}</p>
    </div>
  `;
}

function renderSongs() {
  const songs = getSongsToShow();
  const selectedMood = moods.find((mood) => mood.id === selectedMoodId);

  if (selectedMood) {
    moodDescription.hidden = false;
    moodDescription.textContent = selectedMood.description;
    document.documentElement.style.setProperty("--accent", selectedMood.color);
    document.documentElement.style.setProperty(
      "--accent-soft",
      `color-mix(in srgb, ${selectedMood.color} 22%, transparent)`
    );
  } else {
    moodDescription.hidden = true;
    moodDescription.textContent = "";
  }

  if (!songs.length) {
    if (currentFilter === "favorites") {
      renderEmptyState(
        {
          title: "No favorites yet",
          body: "Tap Save on any song to keep it in your mix.",
        },
        "💫"
      );
      return;
    }

    renderEmptyState(
      {
        title: "Choose a mood to start the mix",
        body: "Happy, Chill, Focused, Sad, or Energetic — pick whatever fits right now.",
      },
      "🎧"
    );
    return;
  }

  const moodColor = selectedMood ? selectedMood.color : "var(--accent)";

  songGrid.innerHTML = songs
    .map((song, index) => {
      const saved = isFavorite(song);
      return `
        <article class="song-card" style="--mood-color: ${moodColor}">
          <div class="song-index" aria-hidden="true">${index + 1}</div>
          <div>
            <h3 class="song-title">${song.title}</h3>
            <p class="song-artist">${song.artist}</p>
          </div>
          <div class="card-actions">
            <a
              class="action-btn primary"
              href="${youtubeSearchUrl(song)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find on YouTube
            </a>
            <button
              class="action-btn${saved ? " is-saved" : ""}"
              type="button"
              data-song-id="${getSongId(song)}"
              aria-pressed="${saved}"
              aria-label="${saved ? "Remove" : "Save"} ${song.title} by ${song.artist}"
            >
              ${saved ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function setFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderSongs();
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  themeIcon.textContent = isLight ? "☀️" : "🌙";
  themeLabel.textContent = isLight ? "Light" : "Dark";
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  applyTheme(savedTheme === "light" ? "light" : "dark");
}

moodGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mood]");
  if (!button) {
    return;
  }

  selectedMoodId = button.dataset.mood;
  renderMoods();
  renderSongs();
});

songGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-song-id]");
  if (!button) {
    return;
  }

  const songId = button.dataset.songId;
  const allSongs = [
    ...moods.flatMap((mood) => mood.songs),
    ...favorites,
  ];
  const song = allSongs.find((item) => getSongId(item) === songId);

  if (song) {
    toggleFavorite(song);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(nextTheme);
});

loadTheme();
renderMoods();
renderSongs();
