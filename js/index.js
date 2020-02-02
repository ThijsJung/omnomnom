const baseUrl = 'https://www.thijsjung.nl/omnomnom/';

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

function load_recipe_list(){
    var url = baseUrl + 'recipes/recipes.json';
    callAPI(url, function(response){
        var recipes = response;
        for (var i = 0; i < recipes.length; i++) {
            var recipe = recipes[i];
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = baseUrl + 'recipe.html?recipe_id=' + recipe.id;
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