let ingredSect =$('#ingredient-section')
let ingredList = $('#ingredient-list')
let ingredSearch =$('#ingredient-search-text').val()
let searchIngreds = [];
let savedMeals = JSON.parse(localStorage.getItem('savedMeals')) ?? [];

setMeals()

// search for meals via ingredients
$('#ingredient-search-button').on("click", function(event){
    ingredList.html("")
    $('#meal-name').html("")
    event.preventDefault();
    ingredSearch=$('#ingredient-search-text').val()
    if(ingredSearch === ""){
        searchError()
    }
    else {
        findIngredients()
    }
 
})


// makes a list of ingredients that the user would like to search by for meals
$('#add-ingredient-button').on("click", function(){
    searchIngreds.push($('#meal-search-text').val())
    $('#meal-section').html("")
    let searchIngredsEl = $('<p>').text(`Search for recipes with: ${searchIngreds.join(", ")}`)
    $('#meal-section').append(searchIngredsEl)
})



$('#meal-search-button').on("click", function(){    
    findMeals()
})

// eventlistener to make add to mealplan form when the user clicks

$(document).on("click", "#add-to-mealplan", function(){
    $('.mealplan-selector-bg').addClass("bg-active")
    $('#mealplan-selector-text').text($(this).parent().children().children()[0].innerHTML)
    $('#mealplan-selector-img').attr("src", $(this).parent().children()[1].currentSrc)
})
 
// eventlistener to close modals

$(document).on("click", ".modal-close, .mealplan-selector-close", function(){
    $('.mealplan-selector-bg').removeClass("bg-active")
    $('.error-modal-bg').removeClass("bg-active")
})

// function to search for ingredients by searching for a meal

function findIngredients(){
    let mealQuery = ingredSearch
    let queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s="+mealQuery
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){
        if (response.meals === null){
            searchError(ingredSearch)
        }
        else{
            console.log(response)
            let mealName = $('<h4>').text(response.meals[0].strMeal).attr("id", "meal-name")
            ingredSect.prepend(mealName)
            let ingredientKeysToIterate = ["strIngredient1", "strIngredient2", "strIngredient3", "strIngredient4", "strIngredient5", "strIngredient6", "strIngredient7", "strIngredient8", "strIngredient9", "strIngredient10", "strIngredient11", "strIngredient12", "strIngredient13", "strIngredient14", "strIngredient15", "strIngredient16", "strIngredient17", "strIngredient18", "strIngredient19", "strIngredient20"]
            let measurementKeysToIterate = ["strMeasure1","strMeasure2","strMeasure3","strMeasure4","strMeasure5","strMeasure6","strMeasure7","strMeasure8","strMeasure9","strMeasure10","strMeasure11","strMeasure12","strMeasure13","strMeasure14","strMeasure15","strMeasure16","strMeasure17","strMeasure18","strMeasure19","strMeasure20",]
            let ingredients=Object.keys(response.meals[0])
                                .filter(a=>ingredientKeysToIterate.includes(a))
                                .map(a=> response.meals[0][a]);
            let measurements=Object.keys(response.meals[0])
                                .filter(a=>measurementKeysToIterate.includes(a))
                                .map(a=> response.meals[0][a]);
            for (let i = 0; i < ingredients.length; i++) {
                if (ingredients[i]===""){
                    return;
                }
                else{
                    let ingredientEl= $('<li>').text(ingredients[i]+" "+measurements[i])
                    ingredList.append(ingredientEl)
                }
            }   
        }
    })
}

// function to run an error message when the search comes empty

function searchError(search){
    if (search.length === 0 || search === ""){
        $('.error-modal-text').text(`Oops! Your search term is empty!`)
        $('.error-modal-bg').addClass("bg-active")
    }
    else {
        $('.error-modal-text').text(`Oops! Unable to find any meals with search term "${search}"`)
        $('.error-modal-bg').addClass("bg-active")
    } 
}



// function to search for meals by ingredients

function findMeals(){
    let searchRange = 5
    let spoonacularAPIKey = "26ca80bd388e4d61aafdcb35b171b6bc"
    let queryURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients="+searchIngreds+"&number="+searchRange+"&apiKey="+spoonacularAPIKey
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){
        if (response.length == 0){
            searchError(searchIngreds)
        }
        else{
            console.log(response)
            for (let i = 0; i < response.length; i++) {
                let cardCol = $('<div>').attr("class", "col-4")
                let mealCard = $('<div>').attr("class", "card")
                let mealCardBody = $('<div>').attr("class", "card-body")
                let mealTitleEl = $('<h5>').text(response[i].title).attr("class", "card-title");
                let mealImageEl = $('<img>').attr("src", response[i].image, "class", "card-img-top")
                let mealPlanButton = $('<button>').text("Add To Meal-Plan?").attr("id", "add-to-mealplan")
                mealCardBody.append(mealTitleEl)
                mealCard.append(mealCardBody)
                mealCard.append(mealImageEl)
                mealCard.append(mealPlanButton)
                cardCol.append(mealCard)
                $('#meal-card-row').append(cardCol)
            }
        }
        
    })

}
 
// append content in mealplanner from add to mealplan submit button


$('#mealPlanSubmit').on("click", function(){
    $('.mealplan-confirm').html("")
    let savedMeals = JSON.parse(localStorage.getItem('savedMeals')) ?? [];
    let dateSelect = $('#mealplan-date')
    let mealSelect = $('#mealplan-meal')
    let selectedDate = dateSelect.val()
    let selectedMeal = mealSelect.val()
    let savedMeal = {
        text: $(this).parent().parent()[0].children[0].innerHTML,
        img: $(this).parent().parent()[0].children[1].currentSrc,
        mealSlot: "#"+selectedDate+"-"+selectedMeal
    }
    
    if(savedMeals.map(input => input.text).indexOf(savedMeal.text) && savedMeals.map(input => input.mealSlot).indexOf(savedMeal.mealSlot) == -1){
        savedMeals.push(savedMeal)
        localStorage.setItem("savedMeals", JSON.stringify(savedMeals))
        setMeals()
        let confirmDiv = $('<div>').attr("class", "mealplan-confirm")
        let confirmMessage = $('<h4>').text(`Saved, meal stored in for ${$("#mealplan-date :selected").text()} ${$("#mealplan-meal :selected").text()}!`)
        confirmMessage.attr("class", 'confirm');
        $(confirmDiv).append(confirmMessage);
        $('.mealplan-selector').append(confirmDiv)
    }
    else {
        let confirmDiv = $('<div>').attr("class", "mealplan-confirm")
        let confirmMessage = $('<h4>').text(`Oops, you're already having ${savedMeal.text} for ${$("#mealplan-meal :selected").text()} on ${$("#mealplan-date :selected").text()} !`)
        confirmMessage.attr("class", 'confirm');
        $(confirmDiv).append(confirmMessage);
        $('.mealplan-selector').append(confirmDiv)
    }
    
})

function setMeals() {
    let savedMeals = JSON.parse(localStorage.getItem('savedMeals')) ?? [];
    console.log(savedMeals)
    console.log(JSON.parse(localStorage.getItem('savedMeals')))
    for (let i = 0; i < savedMeals.length; i++) {
        $(`${savedMeals[i].mealSlot}-text`).text(savedMeals[i].text)
        $(`${savedMeals[i].mealSlot}-img`).attr("src", savedMeals[i].img)
        let clearButton = $('<button>').attr("id", "clear-btn").text("Remove")
        $(savedMeals[i].mealSlot).append(clearButton)
    }
}

$('#clear-btn').on("click", function(){
    console.log($(this))
})