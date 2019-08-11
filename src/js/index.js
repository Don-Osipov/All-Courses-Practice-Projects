// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';

/*
 ! GLOBAL STATE
 * - Search Object
 * - Current recipe object
 * - Shooping list objst
 * - Liked Recipes
 */
const state = {};

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
    console.log(uri);

    if (uri) {
        // Prepare UI for changes

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
            console.log(state.recipe);
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
