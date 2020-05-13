const baseApiUrl = 'https://hdw3xwldw0.execute-api.eu-west-1.amazonaws.com/omnomnom-API-prod';

const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('recipe_id');
const apiKey = urlParams.get('key');

const portionSizeSelector = document.getElementById("portion_size");

// Initialise recipeData so it can be stored locally and used to recalculate the ratio of ingredients.
let localRecipeData = null;
const default_hungry_people_count = 4;
const default_portion_size = 4;

function get_recipe_data(recipe_id){
    var url = baseApiUrl + '/recipes/' + recipe_id;
    callAPI(url, load_recipe);
}

function load_recipe(recipeData){
    console.log(recipeData);
    fill_recipe_description(recipeData.title, recipeData.description)
    fill_ingredients(recipeData.ingredients, recipeData.portion_size, default_hungry_people_count);
    fill_instructions(recipeData.instructions);
    if('pro_tips' in recipeData){
        fillProTips(recipeData.pro_tips);
    }
    if ('image_url' in recipeData) {
        addImage(recipeData.image_url);
    }
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

function recalculateIngredients(event){
    const hungryPeopleCount = event.target.value;
    fill_ingredients(localRecipeData.ingredients, localRecipeData.portion_size, hungryPeopleCount);
}

function fill_ingredients(ingredients, portion_size = default_portion_size, hungry_people_count = default_hungry_people_count){
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

function fill_instructions(instructions){
    for (let i = 0; i < instructions.length; i++) {
        const li = document.createElement("li");
        const t = document.createTextNode(instructions[i]);
        li.appendChild(t);
        document.getElementById("instructions").appendChild(li);
    }
}

function fillProTips(pro_tips){
    const proTipsDiv = document.getElementById("pro_tips");
    const proTipsHeader = document.createElement("h3")
    proTipsHeader.innerText = "Pro Tips";
    proTipsDiv.appendChild(proTipsHeader);

    const proTips = document.createElement("ul");
    for (let i = 0; i < pro_tips.length; i++) {
        const li = document.createElement("li");
        const t = document.createTextNode(pro_tips[i]);
        proTips.appendChild(li).appendChild(t);
    }
    proTipsDiv.appendChild(proTips);
}

function addImage(imageUrl){
    let image = document.createElement("img");
    image.src = imageUrl;
    image.alt = "Recipe picture";
    image.width = 500;
    document.getElementById("recipe_image_container").appendChild(image);
}

// Callback function
function callAPI(url, cFunction) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('x-api-key', apiKey);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            localRecipeData = JSON.parse(xhttp.responseText);
            cFunction(localRecipeData);
        }
    };
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

document.addEventListener('DOMContentLoaded', function () {
    get_recipe_data(recipeId);
    portionSizeSelector.addEventListener("change", recalculateIngredients, false)
});
