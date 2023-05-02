let ingredSect =$('#ingredient-section')
let ingredList = $('#ingredient-list')
let ingredSearch =$('#ingredient-search-text').val()
let searchIngreds = [];
let spoonacularAPIKey = "ec9c98c648e344fcb8def4b57bd6aede"
let savedMeals = JSON.parse(localStorage.getItem('savedMeals')) ?? [];
let mealPreference = [];
let dietPreference =[];
let intolerancePreference = [];

setMeals()

// search for ingredients via meals
$('#ingredient-search-button').on("click", function(event){
    ingredSect.empty()
    $('#meal-name').empty()
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
    console.log(searchIngreds)
    $('#meal-section').empty()
    let searchIngredsEl = $('<p>').text(`Search for recipes with: ${searchIngreds.join(", ")}`)
    $('#meal-section').append(searchIngredsEl)
})

$('#meal-search-filters').on("click", function(){
    $('.search-preferences-bg').addClass("bg-active")
    mealPreference = [];
    dietPreference =[];
    intolerancePreference = [];
})


$('#meal-search-button').on("click", function(){    
    if(searchIngreds.length == 0){
        searchError(searchIngreds)
    }
    else{
        $('#meal-card-row').empty()
        findMeals()
    }
})

// eventlistener to make add to mealplan form when the user clicks

$(document).on("click", ".add-to-mealplan", function(event){
    event.stopPropagation()
    $('.mealplan-confirm').empty()
    $('.mealplan-selector-bg').addClass("bg-active")
    $('#mealplan-selector-text').text($(this).parent().children()[0].innerHTML)
    $('#mealplan-selector-img').attr("src", $(this).parent().children()[1].currentSrc)
})
 
// eventlistener to close modals

$(document).on("click", ".modal-close, .mealplan-selector-close, .search-close", function(){
    $('.mealplan-selector-bg').removeClass("bg-active")
    $('.error-modal-bg').removeClass("bg-active")
    $('.search-preferences-bg').removeClass("bg-active")
})

$('.blue-clear-search').on("click", function(){
    $('#ingredient-section').empty()
})

$('.clear-search').on("click", function(){
    $('#meal-card-row').empty()
    $('#meal-section').empty()
    searchIngreds=[]
    searchIngredsEl = $('<p>').text(`Search for recipes with: ${searchIngreds.join(",")}`)
    $('#meal-section').append(searchIngredsEl)
})

// function to search for ingredients by searching for a meal

function findIngredients(){
    let mealQuery = ingredSearch
    let queryURL = "https://api.spoonacular.com/recipes/complexSearch?query="+mealQuery+"&apiKey="+spoonacularAPIKey
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){
        if (response.results.length == 0){
            searchError(ingredSearch)
        }
        else{
            let returnedMealRow = $('<div>').addClass("returned-meal-row row")
            for (let i = 0; i < response.results.length; i++) {
                let returnedMealDiv =$('<div>').addClass("returned-meal col").attr("data-id", response.results[i].id)
                let mealName =$('<h4>').text(response.results[i].title)
                let mealImg =$('<img>').attr("src", response.results[i].image)
                returnedMealDiv.append(mealName, mealImg)
                returnedMealRow.append(returnedMealDiv)
                ingredSect.append(returnedMealRow)
            } 
        }
    })
}

// click on a meal to display it in the "what do i need" section
$(document).on("click", ".returned-meal", function(){
    ingredSect.empty()
    let mealId = ($(this)[0].dataset.id)
    let queryURL = "https://api.spoonacular.com/recipes/"+mealId+"/information"+"?apiKey="+spoonacularAPIKey
    $.ajax({
        url: queryURL,
        method:"GET"
    }).then(function(response){
        let returnedMealDiv = $('<div>').addClass("big-returned-meal")
        let returnedMealName = $('<h4>').text(response.title)
        let returnedMealImg =$('<img>').attr("src", response.image)
        let ingredientUl = $('<ul>').addClass("ingredient-list")
        let mealPlanButton = $('<button>').text("Add To Meal-Plan?").attr("class", "add-to-mealplan")
        for (let i = 0; i < response.extendedIngredients.length; i++) {
            let ingredientText= $('<li>').text(`${response.extendedIngredients[i].name}: ${response.extendedIngredients[i].measures.metric.amount} ${response.extendedIngredients[i].measures.metric.unitShort}`)
            ingredientUl.append(ingredientText)
        }
        returnedMealDiv.append(returnedMealName, returnedMealImg, mealPlanButton, ingredientUl)
        ingredSect.append(returnedMealDiv)
    })
})

// function to run an error message when the search comes empty

function searchError(search){
    if (search === "" || search == undefined || search.length == 0){
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
    let queryURL = "https://api.spoonacular.com/recipes/complexSearch"+"?includeIngredients="+searchIngreds+"&diet="+dietPreference+"&intolerances="+intolerancePreference+"&type="+mealPreference+"&apiKey="+spoonacularAPIKey
    console.log(queryURL)
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){
        console.log(response)
        if (response.results.length == 0){
            searchError(searchIngreds)
        }
        else{
            for (let i = 0; i < response.results.length; i++) {
                let returnedMealRow = $('<div>').addClass("returned-meal-row row")
                let cardCol = $('<div>').addClass("col returned-meal blue-returned-meal").attr("data-id", response.results[i].id)
                let mealTitleEl = $('<h5>').text(response.results[i].title);
                let mealImageEl = $('<img>').attr("src", response.results[i].image)
                let mealPlanButton = $('<button>').text("Add To Meal-Plan?").addClass("add-to-mealplan")
                cardCol.append(mealTitleEl, mealImageEl, mealPlanButton)
                returnedMealRow.append(cardCol)
                $('#meal-card-row').append(cardCol)
                
            }
        }
    })

}
 
// append content in mealplanner from add to mealplan submit button


$('#mealPlanSubmit').on("click", function(){
    $('.mealplan-confirm').empty()
    let dateSelect = $('#mealplan-date')
    let mealSelect = $('#mealplan-meal')
    let selectedDate = dateSelect.val()
    let selectedMeal = mealSelect.val()
    let savedMeal = {
        text: $(this).parent().parent()[0].children[0].innerHTML,
        img: $(this).parent().parent()[0].children[1].currentSrc,
        mealSlot: "#"+selectedDate+"-"+selectedMeal
    }
    if (savedMeals.map(input => input.mealSlot).indexOf(savedMeal.mealSlot) == -1){
        savedMeals.push(savedMeal)
        localStorage.setItem("savedMeals", JSON.stringify(savedMeals))
        setMeals(savedMeal)
        let confirmDiv = $('<div>').attr("class", "mealplan-confirm")
        let confirmMessage = $('<h4>').text(`Saved, meal stored in for ${$("#mealplan-date :selected").text()} ${$("#mealplan-meal :selected").text()}!`)
        confirmMessage.addClass('confirm');
        confirmDiv.append(confirmMessage);
        $('.mealplan-selector').append(confirmDiv)
    }
    else if (savedMeals.map(input => input.mealSlot).indexOf(savedMeal.mealSlot) > -1){
        const duplicateMealSlotIndex = savedMeals.map(input => input.mealSlot).indexOf(savedMeal.mealSlot)
        if (savedMeals[duplicateMealSlotIndex].text == savedMeal.text){
            let confirmDiv = $('<div>').attr("class", "mealplan-confirm")
            let confirmMessage = $('<h4>').text(`Oops, you're already having ${savedMeal.text} for ${$("#mealplan-meal :selected").text()} on ${$("#mealplan-date :selected").text()}!`)
            confirmMessage.attr("class", 'confirm');
            $(confirmDiv).append(confirmMessage);
            $('.mealplan-selector').append(confirmDiv)    
        }
        else{
            savedMeals.splice(duplicateMealSlotIndex, 1)
            savedMeals.push(savedMeal)
            localStorage.setItem("savedMeals", JSON.stringify(savedMeals))
            setMeals(savedMeal)
            let confirmDiv = $('<div>').attr("class", "mealplan-confirm")
            let confirmMessage = $('<h4>').text(`Saved, meal stored in for ${$("#mealplan-date :selected").text()} ${$("#mealplan-meal :selected").text()}!`)
            confirmMessage.addClass('confirm');
            confirmDiv.append(confirmMessage);
            $('.mealplan-selector').append(confirmDiv)
        }
        }
    }
)

function setMeals(meal) {
    if (meal == undefined){
        for (let i = 0; i < savedMeals.length; i++) {
            $(`${savedMeals[i].mealSlot}-text`).text(savedMeals[i].text)
            $(`${savedMeals[i].mealSlot}-img`).attr("src", savedMeals[i].img)
            let clearButton = $('<button>').addClass("clear-btn").text("Remove")
            $(savedMeals[i].mealSlot).append(clearButton)
        }
    }
    else{
        $(`${meal.mealSlot}-text`).text(meal.text)
        $(`${meal.mealSlot}-img`).attr("src", meal.img)
        if ($(meal.mealSlot).find(".clear-btn").length > 0){
            return;
        }
        else {
            let clearButton = $('<button>').addClass("clear-btn").text("Remove")
            $(meal.mealSlot).append(clearButton)
        }
    }
   
}

$(document).on("click", ".clear-btn", function(event){
    for (let i = 0; i < savedMeals.length; i++) {
        if("#"+$(this).parent([0]).attr("id") == savedMeals[i].mealSlot){
            let indexRemove = savedMeals.map(input => input.mealSlot).indexOf(savedMeals[i].mealSlot)
            savedMeals.splice(indexRemove, 1)
            localStorage.setItem("savedMeals", JSON.stringify(savedMeals))
            $(`#${$(this).parent([0]).attr("id")}-text`).empty()
            $(`#${$(this).parent([0]).attr("id")}-img`).attr("src", "")
            event.target.remove()
        }
    }
})

let preferenceForm = $("form");

preferenceForm.on("submit", function(event){
    event.preventDefault();
    for (let i = 0; i < 20; i++) {
        if(i<3){
            if($('input[type="checkbox"]')[i].checked){
                mealPreference.push($('input[type="checkbox"]')[i].value)
            }
        }
        else if(i>=3 && i<8){
            if ($('input[type="checkbox"]')[i].checked){
                dietPreference.push($('input[type="checkbox"]')[i].value)
            }
        }
        else if(i>=8){
            if ($('input[type="checkbox"]')[i].checked){
            intolerancePreference.push($('input[type="checkbox"]')[i].value)
            }
        }    
        }
    $('.search-preferences-bg').removeClass("bg-active")
    }
)
