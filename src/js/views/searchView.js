import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#23456">
            <figure class="results__fig">
                <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.recipe.label}</h4>
                <p class="results__author">John Doe</p>
            </div>
        </a>
    </li> 
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

export const renderResults = recipes => {
    console.log(recipes);

    recipes.forEach(renderRecipe);
};
