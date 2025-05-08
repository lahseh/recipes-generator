// Sample ingredient suggestions
const sampleSuggestions = [
  "chicken, garlic, olive oil",
  "pasta, tomatoes, basil",
  "rice, beans, avocado",
  "beef, onions, mushrooms",
  "tofu, bell peppers, soy sauce",
  "salmon, lemon, dill",
  "eggs, spinach, feta",
  "potatoes, cheddar, broccoli",
  "mushrooms, cream, thyme",
];

// Suggest Ingredients Button Logic
document.addEventListener("DOMContentLoaded", () => {
  const suggestBtn = document.getElementById("suggestBtn");
  const ingredientsInput = document.getElementById("ingredients");
  const generateBtn = document.getElementById("generateBtn");

  if (suggestBtn) {
    suggestBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const randomIndex = Math.floor(Math.random() * sampleSuggestions.length);
      const suggestion = sampleSuggestions[randomIndex];
      ingredientsInput.value = suggestion;
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", generateRecipe);
  }
});

// Recipe Generator Function
async function generateRecipe() {
  const ingredientsInput = document.getElementById("ingredients").value.trim();
  const resultDiv = document.getElementById("result");

  // Clear previous results
  resultDiv.innerHTML = "";

  if (!ingredientsInput) {
    resultDiv.innerHTML = "<p>Please enter at least one ingredient.</p>";
    return;
  }

  try {
    // First API call: Search for recipe by ingredients
    const searchResponse = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
        ingredientsInput
      )}&number=1&apiKey=12f8d15f82c24b3d815aff4b3ab42986`
    );
    const searchData = await searchResponse.json();

    if (!searchData.length) {
      resultDiv.innerHTML =
        "<p>No recipes found. Try different ingredients.</p>";
      return;
    }

    const recipe = searchData[0];

    // Second API call: Get detailed recipe info
    const detailResponse = await fetch(
      `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=12f8d15f82c24b3d815aff4b3ab42986`
    );
    const detailData = await detailResponse.json();

    // Show the results
    resultDiv.innerHTML = `
      <h2>${detailData.title}</h2>
      <img src="${detailData.image}" alt="${detailData.title}" width="300" />
      <p><strong>Summary:</strong> ${detailData.summary}</p>
      <p><strong>Instructions:</strong> ${
        detailData.instructions || "No instructions available."
      }</p>
    `;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    resultDiv.innerHTML =
      "<p>Something went wrong. Please try again later.</p>";
  }
}
