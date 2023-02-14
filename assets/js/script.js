let ingredSect =$('#ingredient-section')
let ingredList = $('#ingredient-list')
let ingredSearch =$('#ingredient-search-text').val()
let searchIngreds = [];


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

$('#add-ingredient-button').on("click", function(){
    searchIngreds.push($('#meal-search-text').val())
    $('#meal-section').html("")
    let searchIngredsEl = $('<p>').text(`Search for recipes with: ${searchIngreds.join(", ")}`)
    $('#meal-section').append(searchIngredsEl)
})

$('#meal-search-button').on("click", function(){
    
    findMeals()
})

$(document).on("click", "#add-to-mealplan", function(){
    $('.mealplan-selector-bg').addClass("bg-active")
    // addToMealPlan()
    // let addToMealPlanBg = $('<div>').attr("class", "mealplan-selector-bg")
    // let addToMealPlanmodal = $('<div>').attr("class", "mealplan-selector")
    // let addToMealPlanModalImageEl = $('<img>').attr("src", $(this).parent().children()[1].currentSrc, "class", "card-img-top")
    // let addToMealPlanModalText =$('<h4>').text($(this).parent().children().children()[0].innerHTML)
    // let addToMealPlanModalClose = $('<span>').text("X").attr("class", "mealplan-selector-close")
    // let addToMealPlanFormBoxDay = $('<div>').attr("class", "mealplan-formbox")
    // let addToMealPlanDayLabel = $('<label>').attr("for", "mealplan-date")
    // let addToMealPlanDaySelect =$('<select>').attr("id", "mealplan-date")
    // let addToMealPlanOptionMon =$('<option>').attr("value", "monday").text("Monday")
    // let addToMealPlanOptionTue =$('<option>').attr("value", "tuesday").text("Tuesday")
    // let addToMealPlanOptionWed =$('<option>').attr("value", "wednesday").text("Wednesday")
    // let addToMealPlanOptionThur =$('<option>').attr("value", "thursday").text("Thursday")
    // let addToMealPlanOptionFri =$('<option>').attr("value", "friday").text("Friday")
    // let addToMealPlanOptionSat =$('<option>').attr("value", "saturday").text("Saturday")
    // let addToMealPlanOptionSun =$('<option>').attr("value", "sunday").text("Sunday")
    // let addToMealPlanBtnDiv =$('<div>').attr("class", "mealplan-formbox buttons")
    // let addToMealPlanBtn =$('<div>').attr("id", "btnSend").text("Add to Meal-Plan")
    // let addToMealPlanFormBoxMeal = $('<div>').attr("class", "mealplan-formbox")
    // let addToMealPlanMealLabel = $('<label>').attr("for", "mealplan-plan")
    // let addToMealPlanMealSelect =$('<select>').attr("id", "mealplan-plan")
    // let addToMealPlanOptionBreakfast =$('<option>').attr("value", "breakfast").text("Breakfast")
    // let addToMealPlanOptionLunch =$('<option>').attr("value", "lunch").text("Lunch")
    // let addToMealPlanOptionEvening =$('<option>').attr("value", "dinner").text("Dinner")
    // addToMealPlanMealSelect.append(addToMealPlanOptionBreakfast)
    // addToMealPlanMealSelect.append(addToMealPlanOptionLunch)
    // addToMealPlanMealSelect.append(addToMealPlanOptionEvening)    
    // addToMealPlanFormBoxMeal.append()
    // addToMealPlanDaySelect.append(addToMealPlanOptionMon)
    // addToMealPlanDaySelect.append(addToMealPlanOptionTue)
    // addToMealPlanDaySelect.append(addToMealPlanOptionWed)
    // addToMealPlanDaySelect.append(addToMealPlanOptionThur)
    // addToMealPlanDaySelect.append(addToMealPlanOptionFri)
    // addToMealPlanDaySelect.append(addToMealPlanOptionSat)
    // addToMealPlanDaySelect.append(addToMealPlanOptionSun)
    // addToMealPlanFormBoxDay.append(addToMealPlanDayLabel)
    // addToMealPlanFormBoxDay.append(addToMealPlanDaySelect)
    // addToMealPlanBtnDiv.append(addToMealPlanBtn)
    // addToMealPlanmodal.append(addToMealPlanDaySelect)
    // addToMealPlanmodal.append(addToMealPlanModalImageEl)
    // addToMealPlanmodal.append(addToMealPlanModalClose)
    // addToMealPlanmodal.append(addToMealPlanModalText)
    // addToMealPlanBg.append(addToMealPlanmodal)
    // $('.modal-container').append(addToMealPlanBg)
})
    
$(document).on("click", ".modal-close, .mealplan-selector-close", function(){
    $('.mealplan-selector-bg').removeClass("bg-active")
    $('.error-modal-bg').removeClass("bg-active")
})

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

function searchError(search){
    if (search.length === 0 || search === ""){
        // let modalBg = $('<div>').attr("class", "error-modal-bg")
        // let modal = $('<div>').attr("class", "error-modal")
        // let modalText =$('<h4>').text(`Oops! Your search term is empty!`)
        // let modalClose = $('<span>').text("X").attr("class", "modal-close")
        // modal.append(modalClose)
        // modal.append(modalText)
        // modalBg.append(modal)
        // $('.modal-container').append(modalBg)
        $('.error-modal-text').text(`Oops! Your search term is empty!`)
        $('.error-modal-bg').addClass("bg-active")
    }
    else {
        // let modalBg = $('<div>').attr("class", "error-modal-bg")
        // let modal = $('<div>').attr("class", "error-modal")
        // let modalText =$('<h4>').text(`Oops! Unable to find any meals with search term "${search}"`)
        // let modalClose = $('<span>').text("X").attr("class", "modal-close")
        // modal.append(modalClose)
        // modal.append(modalText)
        // modalBg.append(modal)
        // $('.modal-container').append(modalBg)
        $('.error-modal-text').text(`Oops! Unable to find any meals with search term "${search}"`)
        $('.error-modal-bg').addClass("bg-active")
    } 
}


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

function addToMealPlan(meal){

}