import axios from 'axios';
import { key, ID, proxy } from '../config';

export default class Recipe {
    constructor(uri) {
        this.uri = uri;
    }

    async getRecipe() {
        try {
            const res = await axios(
                `${proxy}https://api.edamam.com/search?r=${encodeURIComponent(
                    this.uri
                )}&app_id=${ID}&app_key=${key}`
            );
            console.log(res);

            this.title = res.data[0].label;
            this.author = 'John Doe';
            this.img = res.data[0].image;
            this.uri = res.data[0].uri;
            this.url = res.data[0].url;
            this.ingredients = res.data[0].ingredients;
        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
        console.log(this);
    }

    parseIngredients() {
        try {
            const unitsLong = [
                'tablespoons',
                'tablespoon',
                'ounces',
                'ounce',
                'teaspoons',
                'teaspoon',
                'cups',
                'pounds'
            ];
            const unitsShort = [
                'tbsp',
                'tbsp',
                'oz',
                'oz',
                'tsp',
                'tsp',
                'cup',
                'pound'
            ];
            const units = [...unitsShort, 'kg', 'g'];

            const newIngredients = this.ingredients.map(el => {
                // 1. Uniform units
                let ingredient = el.text.toLowerCase();
                unitsLong.forEach((unit, index) => {
                    ingredient = ingredient.replace(unit, unitsShort[index]);
                });

                // 2. Remove parenthesis
                ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

                // 3. Parse ingredients into count, unit and ingredient
                const arrIng = ingredient.split(' ');
                const unitIndex = arrIng.findIndex(elem =>
                    units.includes(elem)
                );
                let objIng;

                if (unitIndex > -1) {
                    // There is a unit
                    // Ex. 4 1/2 cups, arrCount = [4, 1/2] --> '4+1/2' --> 4.5
                    // Ex2. 4 cups, arrCount = [4]
                    const arrCount = arrIng.slice(0, unitIndex);
                    let count;
                    if (arrCount.length == 1) {
                        count = eval(arrCount[0].replace('-', '+'));
                    } else {
                        count = eval(arrCount.join('+'));
                    }

                    objIng = {
                        count,
                        unit: arrIng[unitIndex],
                        ingredient: arrIng.slice(unitIndex + 1).join(' ')
                    };
                } else if (parseInt(arrIng[0], 10)) {
                    // There is no unit, but the 1st element is a number
                    objIng = {
                        count: parseInt(arrIng[0], 10),
                        unit: '',
                        ingredient: arrIng.slice(1).join(' ')
                    };
                } else if (unitIndex === -1) {
                    // There is no unit and no number in 1st position
                    objIng = {
                        count: 1,
                        unit: '',
                        ingredient // This will auto add the ': ingredient'
                    };
                }
                return objIng;
            });
            this.ingredients = newIngredients;
        } catch (error) {
            console.log(error);
        }
    }
}
