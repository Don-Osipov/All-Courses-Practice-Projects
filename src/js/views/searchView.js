import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
};


const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if (current.length + accumulator < limit) {
                newTitle.push(current);
            }
            return accumulator + current.length
        }, 0)

        return `${newTitle.join(' ')} ...`
    }
    return title;
};

const renderRecipe = recipeobj => {
    const markup = `
    <li>
        <a class="results__link" href="#23456">
            <figure class="results__fig">
                <img src="${recipeobj.recipe.image}" alt="${recipeobj.recipe.label}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipeobj.recipe.label)}</h4>
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
