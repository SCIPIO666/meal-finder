const domElements = {
    searchPanel: document.querySelector("#search-input"),
    searchButton: document.querySelector("#search-btn"),
    mealsListContainer: document.querySelector(".meal-list"),
    mealDetailsContainer: document.querySelector(".meal-details"),
    // small: document.querySelector("small"),
    mealCards: document.querySelectorAll(".meal-card"),
    closeButton: document.querySelector(".close-btn"), // CORRECTION: Use class selector for consistency
}
const NAME_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const ID_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

class UserInterface {
    constructor(domElements) {
        this.domElements = domElements;
    }

    createElement(element, attribute = "", value = "") {
        const elem = document.createElement(element);
        if (attribute) {
            if (attribute === "class") {
                elem.classList.add(value);
            } else if (attribute === "textContent") {
                elem.textContent = value;
            } else {
                elem.setAttribute(attribute, value);
            }
        }
        return elem;
    }

    displayMeal(mealsArray) { // New method to handle result rendering
        this.domElements.mealsListContainer.innerHTML = ''; // Clear previous results
        this.domElements.mealDetailsContainer.classList.add("hide"); // Hide details view

        if (!mealsArray || mealsArray.length === 0) {
            // no results case
            this.domElements.mealsListContainer.textContent = "No meals found. Try searching for something else!";
            return;
        }

        this.generateMealsGrid(mealsArray);
    }

    displayDetails(mealObject) {
        const detailsContainer = this.domElements.mealDetailsContainer;
        detailsContainer.innerHTML = ""; // Clear previous content

        const title = this.createElement("h2", "class", "details-title");
        title.textContent = mealObject.strMeal;
        detailsContainer.appendChild(title);

        const image = this.createElement("img", "src", mealObject.strMealThumb);
        image.classList.add("details-image");
        //detailsContainer.appendChild(image);
        detailsContainer.style.backgroundImage = `url("${mealObject.strMealThumb}")`;
        const ingredientList = this.createElement("ul", "class", "ingredient-list");

        // Iterate through all 20 possible ingredients/measures
        for (let i = 1; i <= 20; i++) {
            const ingredient = mealObject[`strIngredient${i}`];
            const measure = mealObject[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {
                const item = this.createElement("li", "textContent", `${measure} ${ingredient}`);
                ingredientList.appendChild(item);
            }
        }
        detailsContainer.appendChild(ingredientList);

        const instructions = this.createElement("div", "class", "instructions-container");
        if(mealObject.strInstructions){
            const heading = this.createElement("h3", "textContent", "RECIPE");
            instructions.appendChild(heading);
            const steps=mealObject.strInstructions.split(".");
            let stepNumber=0;
            steps.forEach(step=>{
                const stepElem=this.createElement("p", "class", "instruction");
                stepNumber++
                if(step!==""){
                    stepElem.textContent=stepNumber+"."+step+".";
                    instructions.appendChild(stepElem);
                }

            })
        }

        detailsContainer.appendChild(instructions);

        //  Ingredients Title
        const ingredientTitle = this.createElement("h3", "textContent", "Ingredients");
        detailsContainer.appendChild(ingredientTitle);

        // reference / url source
        const source = this.createElement("p", "textContent", `Source: ${mealObject.strSource || 'Not available'}`);
        const sourceVideo = this.createElement("p", "textContent", `Url: ${mealObject.strYoutube || 'Not available'}`);
        source.classList.add("source");
        sourceVideo.classList.add("source");
        detailsContainer.appendChild(source);
        detailsContainer.appendChild(sourceVideo);

        detailsContainer.classList.remove("hide");
        detailsContainer.classList.add("show");
        
    }
    createMealCard(mealObject) {
        const ctn = this.createElement("div", "class", "meal-card");
        ctn.dataset.mealId = mealObject.idMeal;

        // Image
        const thumbNail = this.createElement("img", "src", mealObject.strMealThumb);
        thumbNail.classList.add("thumbnail");

        // Title
        const mealTitle = this.createElement("h3", "textContent", mealObject.strMeal);
        mealTitle.classList.add("title");

        // Append to card
        ctn.appendChild(thumbNail);
        ctn.appendChild(mealTitle);
        return ctn;
    }
    generateMealsGrid(mealsArray) {
        const mealsContainer = this.domElements.mealsListContainer;
        mealsArray.forEach(meal => {
            const card = this.createMealCard(meal);
            mealsContainer.appendChild(card);
        });
    }


}
class Data {
    constructor(nameFetchUrl, idFetchUrl) {
        this.idFetchUrl = idFetchUrl;
        this.nameFetchUrl = nameFetchUrl;
    }
    async fetchMealByName(name) {
        try {
            const url = this.nameFetchUrl + name;
            const response = await fetch(url);
            console.log(`Fetching from URL: ${url}`);
            if (!response.ok) {
                throw new Error(`error fetching meal by name: ${response.status}`);
            }
            const data = await response.json();
            if (!data.meals) {
                console.log(`No meal found for name: ${name}`);
                return null; // Return null if no results
            }
            console.log(data.meals);
            return data.meals;
        } catch (error) {
            console.error(error.message);

        }

    }
    async fetchMealById(id) {
        try {
            const url = this.idFetchUrl + id;
            const response = await fetch(url);
            console.log(`Fetching from URL: ${url}`);
            if (!response.ok) {
                throw new Error(`error fetching meal by id: ${response.status}`);
            }
            const data = await response.json();
            if (!data.meals || data.meals.length === 0) {
                console.log(`No meal found for id: ${id}`);
                return null; // Return null if no results
            }
            console.log(data.meals[0]);
            return data.meals[0]; // CORRECTION: Return the single meal object
        } catch (error) {
            console.error(error.message);

        }

    }
}
class UiDataBridge {
    constructor(uiClass, dataClass) {
        this.dataClass = dataClass;
        this.uiClass = uiClass;
        this.initEventListeners(); // CORRECTION: Call initEventListeners in the constructor
    }
    initEventListeners() {
        this.searchMealOnClick();
        this.delegateMealCardClicks();
        this.closeDetailsModalOnClick();
    }
    determineTypeOfSearch(meal) {
        const digitsOnlyPattern = /^\s*\d+\s*$/;
        const mealNamePattern = /^[a-zA-Z\s'-]+$/;
        if (!meal) {
            return "invalid";
        }

        if (digitsOnlyPattern.test(meal)) {
            return "id";
        }

        if (mealNamePattern.test(meal)) {
            return "meal name";
        }

        return "invalid";
    }
    async displayMeal(meal) {

        try {
            const typeOfSearch = this.determineTypeOfSearch(meal);
            let meals = null;
            if (typeOfSearch === "id") {
                console.log("search by id")
                const singleMeal = await this.dataClass.fetchMealById(meal); // single object or null
                meals = singleMeal ? [singleMeal] : null; 
            }
            if (typeOfSearch === "meal name") {
                console.log("search by name")
                meals = await this.dataClass.fetchMealByName(meal);
                console.log(meals);

            }

            this.uiClass.domElements.mealsListContainer.innerHTML = "";
            if (this.uiClass.domElements.mealDetailsContainer.classList.contains("show")) {
                this.uiClass.domElements.mealDetailsContainer.classList.add("hide");
                this.uiClass.domElements.mealDetailsContainer.classList.remove("show");
            } // hide details


            if (!meals || meals.length === 0) {
                // no results case
                this.uiClass.domElements.mealsListContainer.textContent = "No meals found. Try searching for something else!"; 
                return;
            }

            this.uiClass.generateMealsGrid(meals);

        } catch (error) {
            console.error(error.message);
        }
    }
    delegateMealCardClicks() {
        this.uiClass.domElements.mealsListContainer.addEventListener("click", async (e) => {
            const mealCard = e.target.closest(".meal-card");

            if (mealCard) {
                const mealObject = await this.generateMealObject(mealCard);
                if (mealObject) {
                    this.uiClass.displayDetails(mealObject);
                }
            }
        });
    }
    searchMealOnClick() {
        const searchButton = this.uiClass.domElements.searchButton;
        searchButton.addEventListener("click", e => {
            e.preventDefault();
            
            const meal = this.uiClass.domElements.searchPanel.value.trim(); 

            const typeOfSearch = this.determineTypeOfSearch(meal);
            if (typeOfSearch === "invalid") {
                console.log("empty / invalid input")
            }
            if (typeOfSearch === "id" || typeOfSearch === "meal name") {
                console.log("search by id/name")
                this.displayMeal(meal);
            }
        });
    }
    async generateMealObject(elem) {
        try {
            const id = elem.dataset.mealId;
            const mealObject = await this.dataClass.fetchMealById(id); // Returns single meal object or null
            return mealObject;
        } catch (error) {
            console.error(error.message);
            return null; // Return null on error
        }
    }
    closeDetailsModalOnClick() {
        const closeButton = this.uiClass.domElements.closeButton;
        const details=this.uiClass.domElements.detailsContainer;
        closeButton.addEventListener("click", e => {
                details.classList.add("hide");
                details.classList.remove("show");
        });
    }
}

const ui = new UserInterface(domElements);
const mealsData = new Data(NAME_URL, ID_URL);
const coordinator = new UiDataBridge(ui, mealsData);


coordinator.initEventListeners();


