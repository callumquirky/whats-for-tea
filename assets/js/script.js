let ingredSect =$('#ingredient-section')
let ingredList = $('#ingredient-list')
let ingredSearch =$('#ingredient-search-text').val()

$('#ingredient-search-button').on("click", function(event){
    ingredList.html("")
    $('#meal-name').html("")
    event.preventDefault();
    ingredSearch=$('#ingredient-search-text').val()
    if(ingredSearch === ""){
        let modal = $('<div>')
        modal.add("class", "modal")
        let child = $('<div>')
        child.text = `Oops! Unable to find anything with search term ${ingredSearch}`
        modal.append(child)
        $('#ingredient-section').append(modal)
    }
    else {
        findIngredients()
    }
 
})

function findIngredients(){
    let mealQuery = ingredSearch
    let queryURL = "https://www.themealdb.com/api/json/v1/1/search.php?s="+mealQuery
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){
        console.log(response)
        let mealName = $('<h4>').text(response.meals[0].strMeal).attr("id", "meal-name")
        ingredSect.prepend(mealName)
        let ingredientKeysToIterate = ["strIngredient1", "strIngredient2", "strIngredient3", "strIngredient4", "strIngredient5", "strIngredient6", "strIngredient7", "strIngredient8", "strIngredient9", "strIngredient10", "strIngredient11", "strIngredient12", "strIngredient13", "strIngredient14", "strIngredient15", "strIngredient16", "strIngredient17", "strIngredient18", "strIngredient19", "strIngredient20"]
        let ingredients=Object.keys(response.meals[0])
                            .filter(a=>ingredientKeysToIterate.includes(a))
                            .map(a=> response.meals[0][a]);
        for (let i = 0; i < ingredients.length; i++) {
            if (ingredients[i]===""){
                return;
            }
            else{
                let ingredientEl= $('<li>').text(ingredients[i])
                ingredList.append(ingredientEl)
            }
        }
    })
}
