
const domElements={
    searchPanel: document.querySelector("#search-input"),
    searchButton: document.querySelector("#search-btn"),
    mealsListContainer: document.querySelector(".meal-list"),
    mealDetailsContainer: document.querySelector(".meal-details"),
}
const NAME_URL="https://www.themealdb.com/api/json/v1/1/search.php?s=";
const ID_URL="www.themealdb.com/api/json/v1/1/lookup.php?i=";


class UserInterface{
    constructor(domElements){
        this.domElements=domElements;
    }
    searchMealOnClick(meal){
        
    }
    displayMeal(meal){

    }
    displayDetails(mealName){

    }
    createMealCard(mealObject){
        const ctn=document.createElement("div");
        ctn.classList.add("meal-container");
        const thumbNail=document.createElement("img");
        const url=mealObject.href;
        thumbNail.setAttribute("href",url);
        thumbNail.classList.add("thumbnail");
        const mealTitle=document.createElement("h3");
        mealTitle.classList.add("title");
        const mealsContainer=document.querySelector(".meal-list");
        ctn.appendChild(thumbNail);
        ctn.appendChild(mealTitle);
        mealsContainer.appendChild(ctn);
    }
    generateMealsGrid(mealsArray){

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
            if(!data.meals){
                console.log(`No meal found for id: ${id}`);
                return null; // Return null if no results
            }
            console.log(data);
            return data;
        }catch(error){
            console.error(error.message);

        }

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