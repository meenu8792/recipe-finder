const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");
const favBtn = document.getElementById("favBtn");

const recipeResults = document.getElementById("recipeResults");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const noResults = document.getElementById("noResults");

// 🔑 ADD YOUR API KEY HERE
const API_KEY = "0056b5757e114df38540aaf70993782d";
const BASE_URL = "https://api.spoonacular.com";

function clearUI() {
  recipeResults.innerHTML = "";
  errorDiv.classList.add("hidden");
  noResults.classList.add("hidden");
  loading.classList.remove("hidden");
}

async function searchRecipes(query) {
  if (!query) return;
  clearUI();

  try {
    const res = await fetch(
      `${BASE_URL}/recipes/complexSearch?query=${query}&number=9&apiKey=${API_KEY}`
    );
    const data = await res.json();

    if (data.results.length === 0) {
      noResults.classList.remove("hidden");
    } else {
      displayRecipes(data.results);
    }
  } catch {
    errorDiv.textContent = "Error fetching recipes.";
    errorDiv.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

async function getRandomRecipes() {
  clearUI();
  try {
    const res = await fetch(
      `${BASE_URL}/recipes/random?number=9&apiKey=${API_KEY}`
    );
    const data = await res.json();
    displayRecipes(data.recipes);
  } catch {
    errorDiv.textContent = "Failed to load random recipes.";
    errorDiv.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function displayRecipes(recipes) {
  recipeResults.innerHTML = "";

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card bg-white p-4 rounded-xl shadow text-center";

    card.innerHTML = `
      <img src="${recipe.image || 'https://placehold.co/300x200'}"
           class="w-full h-40 object-cover rounded mb-3">
      <h3 class="font-semibold mb-2">${recipe.title}</h3>
      <button class="bg-red-500 text-white px-3 py-1 rounded text-sm">
        ❤️ Add to Favorites
      </button>
    `;

    card.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      addToFavorites(recipe);
    });

    card.addEventListener("click", () => openRecipe(recipe.id));
    recipeResults.appendChild(card);
  });
}

async function openRecipe(id) {
  const res = await fetch(
    `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`
  );
  const data = await res.json();
  window.open(data.sourceUrl, "_blank");
}

// ⭐ FAVORITES FEATURE
function addToFavorites(recipe) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favs.find(r => r.id === recipe.id)) {
    favs.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(favs));
    alert("Added to favorites ❤️");
  }
}

favBtn.addEventListener("click", () => {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favs.length === 0) {
    alert("No favorites yet!");
    return;
  }
  let list = favs.map(f => `• ${f.title}`).join("\n");
  alert("Your Favorites:\n\n" + list);
});

searchBtn.addEventListener("click", () =>
  searchRecipes(searchInput.value.trim())
);

randomBtn.addEventListener("click", getRandomRecipes);

getRandomRecipes();
