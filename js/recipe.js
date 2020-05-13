const baseApiUrl = 'https://hdw3xwldw0.execute-api.eu-west-1.amazonaws.com/omnomnom-API-prod';

const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('recipe_id');
const apiKey = urlParams.get('key');

const portionSizeSelector = document.getElementById("portion_size");
const copyIngredientsButton = document.getElementById("copy_ingredients_button");

// Initialise recipeData so it can be stored locally and used to recalculate the ratio of ingredients.
let localRecipeData = null;
const defaultHungryPeopleCount = 4;
const defaultPortionSize = 4;

function getRecipeData(recipe_id){
    let url = baseApiUrl + '/recipes/' + recipe_id;
    callAPI(url, load_recipe);
}

function load_recipe(recipeData){
    console.log(recipeData);
    fillRecipeDescription(recipeData.title, recipeData.description)
    fillIngredients(recipeData.ingredients, recipeData.portion_size, defaultHungryPeopleCount);
    fillInstructions(recipeData.instructions);
    if('pro_tips' in recipeData){
        fillProTips(recipeData.pro_tips);
    }
    if ('image_url' in recipeData) {
        addImage(recipeData.image_url);
    }
}

function fillRecipeDescription(title, description){
    const recipeDescriptionDiv = document.getElementById("recipe_description");

    const recipeTitle = document.createElement("h2");
    recipeTitle.innerText = title;  //TODO: Escape input
    recipeDescriptionDiv.appendChild(recipeTitle);

    let recipeDescription = document.createElement("p");
    recipeDescription.innerText = description;
    recipeDescriptionDiv.appendChild(recipeDescription);
}

function recalculateIngredients(event){
    const hungryPeopleCount = event.target.value;
    fillIngredients(localRecipeData.ingredients, localRecipeData.portion_size, hungryPeopleCount);
}

function fillIngredients(ingredients, portionSize = defaultPortionSize, hungryPeopleCount = defaultHungryPeopleCount){
    let ratio = hungryPeopleCount / portionSize;
    document.getElementById("ingredients_list").innerHTML = "";  // TODO: Replace by removing elements?
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

function fillInstructions(instructions){
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
    const image = document.createElement("img");
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

function copyToClipboard(event){
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
    getRecipeData(recipeId);
    portionSizeSelector.addEventListener("change", recalculateIngredients, false)
    copyIngredientsButton.addEventListener("click", copyToClipboard, false)
});
