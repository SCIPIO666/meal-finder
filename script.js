
const domElements={
    searchPanel: document.querySelector("#search-input"),
    searchButton: document.querySelector("#search-btn"),
    mealsListContainer: document.querySelector(".meal-list"),
    mealDetailsContainer: document.querySelector(".meal-details"),


}

const NAME_URL="www.themealdb.com/api/json/v1/1/search.php?s=";
const ID_URL=

class UserInterface{
    constructor(domElements){
        this.domElements=domElements;
    }
    searchMealOnClick(meal){
        
    }
    displayMeal(meal){

    }
    displayDetails(details){

    }
    createMealCard(mealData){

    }
    generateMealsGrid(){

    }

}
class Data{
    constructor(idFetchUrl,nameFetchUrl){
        this.idFetchUrl=idFetchUrl;
        this.nameFetchUrl=nameFetchUrl;
    }
    fetchMealByName(name){

    }
    fetchMealById(id){

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