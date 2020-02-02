const baseUrl = 'https://www.thijsjung.nl/omnomnom/';
var urlParams = new URLSearchParams(window.location.search);
var recipeId = urlParams.get('recipe_id');
var recipeData = null;

var default_hungry_people_count = 4;
const default_portion_size = 4;

document.addEventListener('DOMContentLoaded', function () {
    get_recipe_data(recipeId);
});

function load_recipe(recipe_data){
    recipeData = recipe_data;
    fill_recipe_description(recipe_data.title, recipe_data.description)
    fill_ingredients(recipe_data.ingredients, recipe_data.portion_size, default_hungry_people_count);
    fill_preparation(recipe_data.preparation);
    if('pro_tips' in recipe_data){
        fill_pro_tips(recipe_data.pro_tips);
    }
    add_image(recipe_data.image_url);
}

function fill_recipe_description(title, description){
    let recipe_description = document.getElementById("recipe_description");

    let recipe_title = document.createElement("h2");
    recipe_title.innerText = title;  //TODO: Escape input
    recipe_title.id = "recipe_title";
    recipe_description.appendChild(recipe_title);

    let recipe_description_el = document.createTextNode(description);
    recipe_description.appendChild(recipe_description_el);
}

function get_and_fill_ingredients(recipeId, hungry_people_count){
    var url = baseUrl + 'recipes/' + recipeId + ".json";
    callAPI(url, fill_ingredients);
}

function recalculate_ingredients(hungry_people_count){
    fill_ingredients(recipeData.ingredients, recipeData.portion_size, hungry_people_count);
}

function fill_ingredients(ingredients, portion_size, hungry_people_count){
    if (!portion_size){
        portion_size = default_portion_size;
    }
    let ratio = hungry_people_count / portion_size;
    document.getElementById("ingredients_list").innerHTML = "";
    for (let i = 0; i < ingredients.length; i++) {
        let ingredient = ingredients[i];
        let unit = ingredient.unit;
        let normalized_quantity = ratio * ingredient.quantity;
        let text = normalized_quantity + " " + ingredient.name;
        if (ingredient.unit){
            text = ingredient.name + ", " + normalized_quantity + " " + unit;
        }
        let li = document.createElement("li");
        li.className = "ingredient";
        let t = document.createTextNode(text);
        li.appendChild(t);
        document.getElementById("ingredients_list").appendChild(li);
    }
}

function fill_preparation(preparation){
    for (var i = 0; i < preparation.length; i++) {
        var li = document.createElement("li");
        var t = document.createTextNode(preparation[i]);
        li.appendChild(t);
        document.getElementById("preparation").appendChild(li);
    }
}

function fill_pro_tips(pro_tips){
    for (var i = 0; i < pro_tips.length; i++) {
        var li = document.createElement("li");
        var t = document.createTextNode(pro_tips[i]);
        li.appendChild(t);
        document.getElementById("pro_tips").appendChild(li);
    }
}

function add_image(imageUrl){
    let image_el = document.createElement("img");
    image_el.src = imageUrl;
    image_el.alt = "Recipe picture";
    image_el.width = 500;
    document.getElementById("recipe_image_container").appendChild(image_el);
}

// Callback function
function callAPI(url, cFunction) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var responseJSON = JSON.parse(xhttp.responseText);
            cFunction(responseJSON);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function get_recipe_data(recipe_id){
    var url = baseUrl + 'recipes/' + recipe_id + ".json";
    callAPI(url, load_recipe);
}

function copyToClipboard(){
    // Copy invisible text by creating a temporary textArea.
    let ingredients = document.getElementsByClassName("ingredient");
    let textArea = document.createElement("textarea");
    let ingredient_count = ingredients.length;
    for (let i = 0; i < ingredient_count; i++) {
        let ingredient = ingredients[i];
        textArea.value += ingredient.innerHTML
        // Add newlines to all ingredients except the last one
        if(i < ingredient_count - 1){
            textArea.value += "\n";
        }
    }
    document.body.appendChild(textArea);
    
    /* Select the text field */
    textArea.focus();
    textArea.select();
    // textArea.setSelectionRange(0, 99999); /*For mobile devices, but do we need it?*/
    
    /* Copy the text inside the text field */
    document.execCommand("copy");
    document.body.removeChild(textArea);
}