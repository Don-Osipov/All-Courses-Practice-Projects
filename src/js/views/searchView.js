import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = uri => {
    const resultsList = document.querySelectorAll('.results__link');
    resultsList.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document
        .querySelector(`.results__link[href="#${uri}"]`)
        .classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if (current.length + accumulator < limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipeobj => {
    // prettier-ignore
    const markup = `
    <li>
        <a class="results__link" href="#${recipeobj.recipe.uri}">
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

// prettier-ignore
// type: prev or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}> 
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resultsPerPage) => {
    const pages = Math.ceil(numResults / resultsPerPage); // Math.ceil rounds it up
    let button;
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, recipesPerPage = 10) => {
    // Render results of current page
    const start = (page - 1) * recipesPerPage;
    const end = page * recipesPerPage;
    // console.log(recipes);

    recipes.slice(start, end).forEach(renderRecipe);

    // Render pagination buttons
    renderButtons(page, recipes.length, recipesPerPage);
};
