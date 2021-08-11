//Instanciacion de las clases
const ui = new UI(),
    cocktail = new CocktailAPI(),
    cocktailDB = new CocktailDB();


//Creacion de los Event Listeners
function eventListeners() {

    // Apenas carga la pagina
    document.addEventListener('DOMContentLoaded', documentReady);

    //Se añade evento cuando se da clic en el boton submitted
    const searchForm = document.querySelector('#search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', getCocktails);
    }

    //eventos para botones 'getrecipes'
    const resultsDiv = document.querySelector('#results');
    if (resultsDiv) {
        resultsDiv.addEventListener('click', resultsDelegation)
    }


}

eventListeners();


//Funcion para obtener los cocteles
function getCocktails(e) {
    e.preventDefault();

    const searchTerm = document.querySelector('#search').value;

    //Revisa si viene algo en el campo de busqueda
    if (searchTerm === '') {
        //Llama a la interfaz de usuario para que imprima un mensaje de alerta
        ui.printMessage('Por favor ingrese algo en el campo de busqueda', 'danger');
    } else {
        // respuesta del servidor desde la promise
        let serverResponse;

        // tipo de busqueda(ingredientes,cockteles o nombre)
        const type = document.querySelector('#type').value;

        // Evaluar el tipo de metodo y entonces ejecuta la busqueda
        switch (type) {

            case 'name':
                serverResponse = cocktail.getDrinksByName(searchTerm);
                break;

            case 'ingredient':
                serverResponse = cocktail.getDrinksByIngredient(searchTerm);
                break;

            case 'category':
                serverResponse = cocktail.getDrinksByCategory(searchTerm);
                break;

            case 'alcohol':
                serverResponse = cocktail.getDrinksByAlcohol(searchTerm);
                break;
        }

        // limpiar busquedas anteriores
        ui.clearResults();


        // buscar el nombre de la bebida
        serverResponse
            .then(obj => {
                if (obj.cocktails.drinks === null) {
                    // No vienen datos
                    ui.printMessage('No hay bebidas con ese parametro de busqueda', 'danger');
                } else {
                    //Mostrar los cocketeles encontrados en pantalla
                    if (type === 'name') {
                        ui.displayDrinksWithIngredients(obj.cocktails.drinks)
                    } else {
                        //Mostrar los cockteles sin ingredientes
                        ui.displayDrink(obj.cocktails.drinks);
                    }
                }
            });
    }
}

// manejo de botones
function resultsDelegation(e) {
    e.preventDefault();

    // Cuando se presiona el boton get recipe
    if (e.target.classList.contains('get-recipe')) {
        cocktail.getSingleRecipe(e.target.dataset.id)
            .then(obj => {
                // Mostrar la receta simple en un modal
                ui.displaySingleRecipe(obj.recipe.drinks[0])
            })
    }

    // Cuando se presiona el boton favorito
    if (e.target.classList.contains('favorite-btn')) {
        if (e.target.classList.contains('is-favorite')) {
            // Si existe la clase, la borra
            e.target.classList.remove('is-favorite');
            e.target.textContent = '+';

            // Quitar del local storage
            cocktailDB.removeFromDB(e.target.dataset.id);
        } else {
            // Si no existe la adiciona
            e.target.classList.add('is-favorite');
            e.target.textContent = '-';

            // Se guarda en local storage
            const cardBody = e.target.parentElement;
            const drinkInfo = {
                id: e.target.dataset.id,
                name: cardBody.querySelector('.card-title').textContent,
                image: cardBody.querySelector('.card-img-top').src
            }
            cocktailDB.saveIntoDB(drinkInfo);
        }
    }
}


// Apenas carga la pagina
function documentReady(e) {
    // Muestra los favoritos ya seleccionados
    ui.isFavorite();


    // Seleccionar la categoria
    const searchCategory = document.querySelector('.search-category');
    if (searchCategory) {
        ui.displayCategories();
    }


    // cuando se carga pagina favoritos
    const favoritesTable = document.querySelector('#favorites');
    if (favoritesTable){
        //obtener favoritos del local storage y mostrarlos
        const drinks = cocktailDB.getFromDB();
        ui.displayFavorites(drinks);

        // cuando el boton ver o borrar son cliqueados en favoritos
        favoritesTable.addEventListener('click', (e) => {
            e.preventDefault();

            // click en View
            if (e.target.classList.contains('get-recipe')){
                cocktail.getSingleRecipe(e.target.dataset.id)
                    .then(obj => {
                        // Mostrar la receta simple en un modal
                        ui.displaySingleRecipe(obj.recipe.drinks[0])
                    })
            }

            // click en Delete
            if (e.target.classList.contains('remove-recipe')){
                ui.removeFavorite(e.target.parentElement.parentElement);

                // Quitar del local storage
                cocktailDB.removeFromDB(e.target.dataset.id);
            }
        })
    }

}













