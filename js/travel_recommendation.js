/* ==========================================
   TRAVEL RECOMMENDATION
   PART 1
========================================== */

let travelData = {};

// ================= ELEMENTS =================

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const results = document.getElementById("results");
const resultTitle = document.getElementById("resultTitle");

// ================= FETCH JSON =================

async function loadData() {

    try {

        const response = await fetch("data/travel_recommendation_api.json");

        if (!response.ok) {
            throw new Error("Unable to load JSON.");
        }

        travelData = await response.json();

        console.log("Travel data loaded:");
        console.log(travelData);

    } catch (error) {

        console.error(error);

        results.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-circle-exclamation"></i>

                <h3>Error</h3>

                <p>
                    Could not load travel recommendations.
                </p>
            </div>
        `;
    }

}

loadData();

// ================= EVENTS =================

searchBtn.addEventListener("click", searchRecommendation);

searchInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        searchRecommendation();

    }

});

clearBtn.addEventListener("click", clearResults);

// ================= SEARCH =================

function searchRecommendation(){

    if(!travelData) return;

    let keyword = searchInput.value.trim().toLowerCase();

    if(keyword === ""){

        results.innerHTML = `
            <div class="no-results">

                <i class="fa-solid fa-magnifying-glass"></i>

                <h3>Empty Search</h3>

                <p>Please enter a keyword.</p>

            </div>
        `;

        return;

    }

    // Remove plural
    if(keyword.endsWith("es")){

        keyword = keyword.slice(0,-2);

    }

    else if(keyword.endsWith("s")){

        keyword = keyword.slice(0,-1);

    }

    let recommendations = [];

    // Beach
    if(keyword === "beach"){

        recommendations = travelData.beaches;

    }

    // Temple
    else if(keyword === "temple"){

        recommendations = travelData.temples;

    }

    // Country
    else if(keyword === "country"){

        recommendations = travelData.countries;

    }

    // Country Name
    else{

        recommendations = travelData.countries.filter(country =>

            country.name.toLowerCase() === keyword

        );

    }

    displayResults(recommendations);

}

/* ==========================================
   DISPLAY RESULTS
========================================== */

function displayResults(recommendations){

    results.innerHTML = "";

    if(recommendations.length === 0){

        results.innerHTML = `
            <div class="no-results">

                <i class="fa-solid fa-face-frown"></i>

                <h3>No Results Found</h3>

                <p>
                    Try searching for:
                    beach,
                    temple,
                    country,
                    Brazil,
                    Japan...
                </p>

            </div>
        `;

        return;

    }

    recommendations.forEach(place => {

        const card = document.createElement("div");

        card.classList.add("card");

        let currentTime = "";

        if(place.timeZone){

            const options = {

                timeZone: place.timeZone,

                hour12: true,

                hour: "numeric",

                minute: "numeric",

                second: "numeric"

            };

            currentTime = new Date().toLocaleTimeString("en-US", options);

        }

        card.innerHTML = `

            <img
                src="${place.imageUrl}"
                alt="${place.name}"
            >

            <div class="card-content">

                <h3>

                    ${place.name}

                </h3>

                <p>

                    ${place.description}

                </p>

                ${
                    place.category
                    ? `<span>${place.category}</span>`
                    : ""
                }

                ${
                    currentTime
                    ? `<p class="country-time">
                        🕒 Local Time: ${currentTime}
                       </p>`
                    : ""
                }

            </div>

        `;

        results.appendChild(card);

    });

}

/* ==========================================
   COUNTRY SEARCH
========================================== */

function searchCountryByName(keyword){

    return travelData.countries.filter(country =>

        country.name
            .toLowerCase()
            .includes(keyword)

    );

}

/* ==========================================
   CATEGORY SEARCH
========================================== */

function searchCategory(category){

    switch(category){

        case "beach":

            return travelData.beaches;

        case "temple":

            return travelData.temples;

        case "country":

            return travelData.countries;

        default:

            return [];

    }

}

/* ==========================================
   CLEAR RESULTS
========================================== */

function clearResults() {

    // Limpa o campo de pesquisa
    searchInput.value = "";

    // Remove todos os cards
    results.innerHTML = "";

    // Restaura o título
    resultTitle.textContent = "Travel Recommendations";

}

/* ==========================================
   SHOW DEFAULT RECOMMENDATIONS
========================================== */

function showDefaultRecommendations() {

    if (!travelData.beaches || !travelData.temples) return;

    const defaultPlaces = [

        travelData.beaches[0],
        travelData.beaches[1],
        travelData.temples[0],
        travelData.temples[1]

    ];

    displayResults(defaultPlaces);

}

/* ==========================================
   UPDATE TITLE
========================================== */

function updateTitle(keyword) {

    resultTitle.textContent =
        `Results for "${keyword}"`;

}

/* ==========================================
   OVERRIDE SEARCH
========================================== */

const originalSearch = searchRecommendation;

searchRecommendation = function () {

    let keyword = searchInput.value.trim().toLowerCase();

    if (keyword === "") {

        results.innerHTML = `
            <div class="no-results">

                <i class="fa-solid fa-magnifying-glass"></i>

                <h3>Empty Search</h3>

                <p>Please enter a search keyword.</p>

            </div>
        `;

        return;

    }

    // Singular/plural
    if (keyword.endsWith("es")) {

        keyword = keyword.slice(0, -2);

    } else if (keyword.endsWith("s")) {

        keyword = keyword.slice(0, -1);

    }

    updateTitle(keyword);

    let recommendations = [];

    // Beach
    if (keyword === "beach") {

        recommendations = searchCategory("beach");

    }

    // Temple
    else if (keyword === "temple") {

        recommendations = searchCategory("temple");

    }

    // Country
    else if (keyword === "country") {

        recommendations = searchCategory("country");

    }

    // Search by country name
    else {

        recommendations = searchCountryByName(keyword);

    }

    displayResults(recommendations);

};

/* ==========================================
   INITIALIZATION
========================================== */

window.addEventListener("load", () => {

    // Aguarda o JSON ser carregado
    const interval = setInterval(() => {

        if (travelData.beaches) {

            showDefaultRecommendations();

            clearInterval(interval);

        }

    }, 100);

});

/* ==========================================
   END
========================================== */

console.log("Travel Recommendation loaded successfully.");



