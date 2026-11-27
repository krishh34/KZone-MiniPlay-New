
const searchInput = document.getElementById("gameSearch");
const gameCards = document.querySelectorAll(".game-card");
const categoryButtons = document.querySelectorAll(".category");
const noResults = document.getElementById("noResults");

let selectedCategory = "all";

function filterGames() {
    const searchText = searchInput.value.toLowerCase();
    let visibleCount = 0;

    gameCards.forEach(function(card) {
        const gameName = card.querySelector("h3").textContent.toLowerCase();
        const gameCategory = card.dataset.category;

        const matchesSearch = gameName.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            gameCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    noResults.hidden = visibleCount !== 0;
}


// SEARCH EVENT
searchInput.addEventListener("input", filterGames);


// CATEGORY BUTTON EVENTS
categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        categoryButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterGames();
    });

});

console.log("MiniPlay home screen loaded successfully!");
