let ingredSect =$('#ingredient-section')
let ingredList = $('#ingredient-list')
let ingredSearch =$('#ingredient-search-text').val()
let searchIngreds = []

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
    console.log(searchIngreds)
    console.log($('#meal-search-text').val())
    $('#meal-section').html("")
    let searchIngredsEl = $('<p>').text(`Search for recipes with: ${searchIngreds.join(", ")}`)
    $('#meal-section').append(searchIngredsEl)
})

$('#meal-search-button').on("click", function(){
    findMeals()
})


$(document).on("click", ".modal-close", function(){
    console.log("button clicked = confirmed")
    $('.modal-container').html("")
})

function findIngredients(){
    let mealQuery = ingredSearch
    let queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s="+mealQuery
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){
        if (response.meals === null){
            searchError()
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

function searchError(){
    console.log("yeah that's null")
    console.log(ingredSearch)
    let modalBg = $('<div>').attr("class", "error-modal-bg")
    let modal = $('<div>').attr("class", "error-modal")
    let modalText =$('<h4>').text(`Oops! Unable to find any meals with search term "${ingredSearch}"`)
    let modalClose = $('<span>').text("X").attr("class", "modal-close")
    console.log(modalClose)
    modal.append(modalClose)
    modal.append(modalText)
    modalBg.append(modal)
    $('.modal-container').append(modalBg)
}




function findMeals(){
    let spoonacularAPIKey = "26ca80bd388e4d61aafdcb35b171b6bc"
    let searchRange = 5
    let queryURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients="+searchIngreds+"&number="+searchRange+"&apiKey="+spoonacularAPIKey
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){
        console.log(response)
        for (let i = 0; i < response.length; i++) {
            let mealSugEl = $('<h4>').text(response[i].title);
            $('#meal-section').append(mealSugEl)
            
        }
    })

}

