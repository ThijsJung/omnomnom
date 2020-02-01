document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("recipeForm");

    const ingredientList = document.getElementById("ingredient_list");
    const ingredientTemplate = document.querySelector('#ingredient');
    const addIngredientButton = document.getElementById("add_ingredient_button");

    const preparations = document.getElementById("preparation");
    const preparationTemplate = document.querySelector('#preparation_step');
    const addPreparationButton = document.getElementById("add_preparation_button");

    const proTips = document.getElementById("pro_tips");
    const proTipTemplate = document.querySelector('#pro_tip');
    const addProTipButton = document.getElementById("add_pro_tip_button");

    function saveRecipe(event){
        event.preventDefault();
        let recipe = {};
        // Get recipe details
        recipeDetails = document.getElementsByClassName("recipeDetails");
        for (let recipeDetail of recipeDetails){
            recipe[recipeDetail.dataset.attribute_name] = recipeDetail.value;
        }
        // Get ingredients
        let ingredients = [];
        let ingredientsListItems = document.getElementById("ingredient_list").getElementsByTagName("li");
        for (let ingredientLi of ingredientsListItems) {
            let ingredientInputs = ingredientLi.getElementsByTagName("input");
            let ingredient = {};
            for (let ingredientInput of ingredientInputs) {
                if (ingredientInput.value !== "") {
                    ingredient[ingredientInput.name] = ingredientInput.value;
                }
            }
            ingredients.push(ingredient);
        }
        recipe["ingredients"] = ingredients;

        let resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "Saving your recipe is not yet supported. Here's the JSON" + "<br>" + JSON.stringify(recipe);
    };

    function addIngredient(){
        let clone = ingredientTemplate.content.cloneNode(true);
        // Add id to list item so it can be deleted.
        let ingredientId = "ingredient_" + ingredientList.getElementsByTagName("li").length;
        clone.querySelector("li").id = ingredientId;
        clone.querySelector("button").addEventListener("click", () => { deleteIngredient(ingredientId); }, false);
        ingredientList.appendChild(clone);
    }

    function deleteIngredient(ingredient_id){
        let ingredientListItem = document.getElementById(ingredient_id);
        ingredientListItem.remove();
    }

    function addPreparationStep(){
        let clone = preparationTemplate.content.cloneNode(true);
        // Add id to list item so it can be deleted.
        let preparationId = "preparation_" + preparations.getElementsByTagName("li").length;
        clone.querySelector("li").id = preparationId;
        clone.querySelector("button").addEventListener("click", () => { deletePreparationStep(preparationId); }, false);
        preparations.appendChild(clone);
    }

    function deletePreparationStep(preparationId){
        let preparationListItem = document.getElementById(preparationId);
        preparationListItem.remove();
    }

    function addProTip(){
        let clone = proTipTemplate.content.cloneNode(true);
        // Add id to list item so it can be deleted.
        let proTipId = "pro_tip_" + preparations.getElementsByTagName("li").length;
        clone.querySelector("li").id = proTipId;
        clone.querySelector("button").addEventListener("click", () => { deleteProTip(proTipId); }, false);
        proTips.appendChild(clone);
    }

    function deleteProTip(proTipId){
        let proTipListItem = document.getElementById(proTipId);
        proTipListItem.remove();
    }

    addIngredient();
    addPreparationStep();
    addProTip();
    addIngredientButton.addEventListener("click", addIngredient, false);
    addPreparationButton.addEventListener("click", addPreparationStep, false);
    addProTipButton.addEventListener("click", addProTip, false);
    form.addEventListener("submit", saveRecipe, false);
});