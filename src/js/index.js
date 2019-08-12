// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

/*
 ! GLOBAL STATE
 * - Search Object
 * - Current recipe object
 * - Shooping list objst
 * - Liked Recipes
 */
const state = {};
window.state = state;

/*
 ! Search Controller
*/
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add it state
        state.search = new Search(query);

        // 3. Prepare UI for results (search spinner);
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('something went wrong with the search.');
        }
        clearLoader();
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // ? Stops the reloading
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // ? The data is stored in the data attribute of the button
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/*
 ! Recipe Controller
*/

// const r = new Recipe(
//     'http://www.edamam.com/ontologies/edamam.owl#recipe_1b6dfeaf0988f96b187c7c9bb69a14fa'
// );
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
    // Get uri from url
    const uri = window.location.hash.replace('#', '');

    if (uri) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(uri);

        // Create a new recipe object
        state.recipe = new Recipe(uri);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);

            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(error);

            alert('Error processing recipe!');
        }
    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event =>
    window.addEventListener(event, controlRecipe)
);

const controlList = () => {
    // Create a new list if there is none yet
    console.log(state.list);

    if (!state.list) state.list = new List();

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(elem => {
        const item = state.list.addItem(elem.count, elem.unit, elem.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update lsit item events
elements.shopping.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle count update
    } else if (event.target.matches('.shopping__count-value')) {
        const val = parseFloat(event.target.value);
        if (val < 0) {
            listView.deleteItem(id);
        } else {
            state.list.updateCount(id, val);
        }
    }
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    }
    // console.log(state.recipe);
});

window.l = new List();
