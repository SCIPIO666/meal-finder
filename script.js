
const domElements={
    searchPanel: document.querySelector("#search-input"),
    searchButton: document.querySelector("#search-btn"),
    mealsListContainer: document.querySelector(".meal-list"),
    mealDetailsContainer: document.querySelector(".meal-details"),
    small: document.querySelector("small"),
}
const NAME_URL="https://www.themealdb.com/api/json/v1/1/search.php?s=";
const ID_URL="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

class UserInterface{
    constructor(domElements){
        this.domElements=domElements;
    }
    displayMeal(meal){

    }
    createElement(element,attribute="",value=""){
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

    displayDetails(mealObject){
      const detailsContainer = this.domElements.mealDetailsContainer;
        const title = this.createElement("h2", "class", "details-title");
        title.textContent = mealObject.strMeal;
        detailsContainer.appendChild(title);

        const image = this.createElement("img", "src", mealObject.strMealThumb); 
        image.classList.add("details-image");
        detailsContainer.appendChild(image);
        
        const instructions = this.createElement("p", "class", "instructions");
       // to extract instructions and add content;
        detailsContainer.appendChild(instructions);

        // 3. Ingredients Title
        const ingredientTitle = this.createElement("h3", "textContent", "Ingredients");
        detailsContainer.appendChild(ingredientTitle);

        // 4. Ingredients List (Iterating through the data)
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
        //reference / url source
        const source=this.createElement("p","textContent",`Source:${mealObject.strSource}`);
        const sourceVideo=this.createElement("p","textContent",`Url:${mealObject.strYoutube}`);
        
        detailsContainer.appendChild(source);  
        detailsContainer.appendChild(sourceVideo);

    }
    createMealCard(mealObject){
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
    searchMealOnClick(){
        const searchButton=this.domElements.searchButton;
        const meal=this.domElements.searchPanel.textContent;
        searchButton.addEventListener("click",e=>{
             if(meal===""){
                this.domElements.small.textContent="enter meal to search";
            }else{
                this.domElements.small.textContent="";
  
            }
        });

       
    }

}
class Data{
    constructor(nameFetchUrl,idFetchUrl){
        this.idFetchUrl=idFetchUrl;
        this.nameFetchUrl=nameFetchUrl;
    }
   async fetchMealByName(name){
        try{
            const url=this.nameFetchUrl+ name;
            const response=await fetch(url);
            console.log(`Fetching from URL: ${url}`);
            if(!response.ok){
                throw new Error(`error fetching meal by name: ${response.status}`);
            }
            const data= await response.json();
            if(!data.meals){
                console.log(`No meal found for name: ${name}`);
                return null; // Return null if no results
            }
            console.log(data);
            return data.meals;
        }catch(error){
            console.error(error.message);

        }

    }
    async fetchMealById(id){
  try{
            const url=this.idFetchUrl+ id;
            const response=await fetch(url);
            console.log(`Fetching from URL: ${url}`);
            if(!response.ok){
                throw new Error(`error fetching meal by id: ${response.status}`);
            }
            const data= await response.json();
            if(!data){
                console.log(`No meal found for id: ${id}`);
                return null; // Return null if no results
            }
            console.log(data.meals);
            return data.meals;
        }catch(error){
            console.error(error.message);

        }

    }
    matchMealsWithIds(){

    }
    generateSingleMealDataFromId(id){

    }
    generateSingleMealDataFromName(name){

    }
    generateMultipleMealsData(){

    }
}
class UiDataBridge{//to stay small
    constructor(uiClass,DataClass){
        this.DataClass=DataClass;
        this.uiClass=uiClass;
    }
}

const ui=new UserInterface(domElements);
const mealsData= new Data(NAME_URL,ID_URL);
const coordinator= new UiDataBridge(ui,mealsData);

//mealsData.fetchMealByName("meat");
mealsData.fetchMealById(52845);
ui.searchMealOnClick();