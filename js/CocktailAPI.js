class CocktailAPI{

    // Obtener la receta por nombre
    async getDrinksByName(searchTerm) {
        // Buscar por nombre
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);

        //Retorna una respuesta JSON
        const cocktails = await apiResponse.json();

        return {
            cocktails
        }
    }

    // Obtener la receta por ingrediente
    async getDrinksByIngredient(searchTerm) {
        //Buscar por ingrediente
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchTerm}`);

        //Espera la respuesta y retorna JSON
        const cocktails = await apiResponse.json();

        return {
            cocktails
        }
    }

    // obtener la recete sencilla
    async getSingleRecipe(id) {
        //Buscar por ingrediente
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);

        //Espera la respuesta y retorna JSON
        const recipe = await apiResponse.json();

        return {
            recipe
        }
    }

    // Obtener las categorias
    async getCategories() {
        const apiResponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');

        // Espera la respuesta del JSON
        const categories = await apiResponse.json();

        return {
            categories
        }
    }

    // obtener bebidas por categoria
    async getDrinksByCategory(searchTerm) {
        //Buscar por categoria
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${searchTerm}`);

        //Espera la respuesta y retorna JSON
        const cocktails = await apiResponse.json();

        return {
            cocktails
        }
    }

    async getDrinksByAlcohol(searchTerm) {
        //Buscar por alcohol/non
        const apiResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${searchTerm}`);

        //Espera la respuesta y retorna JSON
        const cocktails = await apiResponse.json();

        return {
            cocktails
        }
    }
}













