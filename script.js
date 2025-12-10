
const domElements={
    searchPanel: document.querySelector("#search-input"),
    searchButton: document.querySelector("#search-btn"),
    mealsListContainer: document.querySelector(".meal-list"),
    mealDetailsContainer: document.querySelector(".meal-details"),


}
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
    constructor(fetchUrl){
        this.fetchUrl=fetchUrl;
    }
    fetchMealByName(){

    }
    fetchMealById(){

    }
    generateSingleMealDataFromId(){

    }
    generateSingleMealDataFromName(){

    }
    generateMultipleMealsData(){

    }
}