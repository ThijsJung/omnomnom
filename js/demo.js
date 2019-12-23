function load_recipe(recipe_data){
    set_title(recipe_data.title);
    set_description(recipe_data.description);
    fill_ingredients(recipe_data.ingredients, 1);
    fill_preparation(recipe_data.preparation);
    if('pro_tips' in recipe_data){
        fill_pro_tips(recipe_data.pro_tips);
    }
    add_image(recipe_data.image_url);
}

function set_title(recipe_title){
    var title = document.createTextNode(recipe_title);
    document.getElementById("recipe_title").appendChild(title);
}

function set_description(recipe_description){
    var description = document.createTextNode(recipe_description);
    document.getElementById("recipe_description").appendChild(description);
}

function get_and_fill_ingredients(recipeId, hungry_people_count){
    var url = 'https://www.thijsjung.nl/omnomnom/recipes/' + recipeId + ".json";
    callAPI(url, fill_ingredients);
}

function fill_ingredients(ingredients, hungry_people_count){
    document.getElementById("ingredients_list").innerHTML = "";
    for (var i = 0; i < ingredients.length; i++) {
        var ingredient = ingredients[i];
        var unit = ingredient.unit;
        var normalized_quantity = hungry_people_count * ingredient.quantity;
        var text = normalized_quantity + " " + ingredient.name;
        if (ingredient.unit){
            text = ingredient.name + ", " + normalized_quantity + " " + unit;
        }
        var li = document.createElement("li");
        li.className = "ingredient";
        var t = document.createTextNode(text);
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
    document.getElementById("recipe_image").src=imageUrl;
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
    var url = 'https://www.thijsjung.nl/omnomnom/recipes/' + recipe_id + ".json";
    callAPI(url, load_recipe);
}

function load_recipe_list(){
    var url = 'https://www.thijsjung.nl/omnomnom/recipes/recipes.json';
    callAPI(url, function(response){
        var recipes = response;
        for (var i = 0; i < recipes.length; i++) {
            var recipe = recipes[i];
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = 'https://www.thijsjung.nl/omnomnom/recipe.html?recipe_id=' + recipe.id;
            a.textContent = recipe.name;
            li.appendChild(a);
            document.getElementById("recipe_list").appendChild(li);
        }
    });
}

function fill_period_name(){
    var today = new Date();
    var hour = today.getHours();
    var period_name = "snack";
    if( hour > 8 && hour < 13 ){
        period_name = "brunch";
    }else if( hour >= 13 && hour < 17){
        period_name = "lunch";
    }else if( hour >= 17 && hour < 22){
        period_name = "dinner";
    }else if( 22>= hour || hour < 5){
        period_name = "midnight snack";
    }
    var elements = document.getElementsByClassName("period_name");
    Array.prototype.forEach.call(elements, function(el) {
        el.textContent = period_name;
    });
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