class UI {

    //Muestra un mensaje modificado
    printMessage(message, className) {
        const div = document.createElement('div');

        // Añadir el HTML
        div.innerHTML = `
            <div class="alert alert-dismissible alert-${className}">
                <button type="button" class="close" data-dismiss="alert">x</button>
                ${message}
            </div>        
        `;

        //Insertar antes
        const reference = document.querySelector('.jumbotron h1');
        const parentNode = reference.parentElement;
        parentNode.insertBefore(div, reference);

        // eliminar la alerta despues de 3 segundos
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000)
    }


    //Muestra la consulta de las bebidas
    displayDrinksWithIngredients(drinks) {

        const resultsWrapper = document.querySelector('.results-wrapper');
        resultsWrapper.style.display = 'block';

        //Insertar los resultados
        const resultsDiv = document.querySelector('#results');

        drinks.forEach(drink => {
            resultsDiv.innerHTML += `
                    <div class="col-md-6">
                         <div class="card my-3">
                              <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-info">
                              +
                              </button>
                              <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">

                              <div class="card-body">
                                   <h2 class="card-title text-center">${drink.strDrink}</h2>
                                   <p class="card-text font-weight-bold">Instructions: </p>
                                   <p class="card-text">
                                         ${drink.strInstructions}
                                   </p>
                                   <p class="card-text">
                                        <ul class="list-group">
                                             <li class="list-group-item alert alert-danger">Ingredients</li>
                                             ${this.displayIngredients(drink)}
                                        </ul>
                                   </p>
                                   <p class="card-text font-weight-bold">Extra Information:</p>
                                   <p class="card-text">
                                        <span class="badge badge-pill badge-success">
                                             ${drink.strAlcoholic}
                                        </span>
                                        <span class="badge badge-pill badge-warning">
                                             Category: ${drink.strCategory}
                                        </span>
                                   </p>
                              </div>
                         </div>
                    </div>
            `;
        });
        this.isFavorite();
    }


    // Imprimir los cocteles con ingredientes y las medidas
    displayIngredients(drink) {
        let ingredients = [];
        for (let i = 1; i < 16; i++) {
            const ingredientMeasure = {};
            if (drink[`strIngredient${i}`] !== '' && drink[`strIngredient${i}`] !== null) {
                ingredientMeasure.ingredient = drink[`strIngredient${i}`];
                ingredientMeasure.measure = drink[`strMeasure${i}`];
                ingredients.push(ingredientMeasure);
            }
        }
        // Construir plantilla
        let ingredientsTemplate = '';
        ingredients.forEach(obj => {
            ingredientsTemplate += `
            <li class="list-group-item">${obj.ingredient} ${obj.measure == null ? '' : '- ' + obj.measure}</li>
            `;
        });
        return ingredientsTemplate;
    }

    //Mostrar solo los cocteles
    displayDrink(drinks) {
        //Muestra los resultados
        const resultsWrapper = document.querySelector('.results-wrapper');
        resultsWrapper.style.display = 'block';

        //Insertar los resultados
        const resultsDiv = document.querySelector('#results');

        // Recorrer las bebidas
        drinks.forEach(drink => {
            resultsDiv.innerHTML += `
                <div class="col-md-4">
                    <div class="card my-3">
                         <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-info">
                           +
                         </button>
                        <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                        <div class="card-body">
                             <h2 class="card-title text-center">${drink.strDrink}</h2>
                             <a class="btn btn-success get-recipe" href="#" data-toggle="modal" data-id="${drink.idDrink}"
                                data-target="#recipe"
                             >
                                Get Recipe
                             </a>
                        </div>
                    </div>
                </div>
            `
        });
        this.isFavorite();
    }


    // Borrar las anteriores resultados
    clearResults(){
        const resultsDiv = document.querySelector('#results');
        resultsDiv.innerHTML = '';
    }

    // Abrir modal para recceta sencilla
    displaySingleRecipe(recipe) {
        //Obtener las variables
        const modalTitle = document.querySelector('.modal-title'),
            modalDescription = document.querySelector('.modal-body .description-text'),
            modalIngredients = document.querySelector('.modal-body .ingredient-list .list-group');

        // Asignar los valores
        modalTitle.innerHTML = recipe.strDrink;
        modalDescription.innerHTML = recipe.strInstructions;

        // Mostrar los ingredientes
        modalIngredients.innerHTML = this.displayIngredients(recipe);
    }


    // Muestra las categorias
    displayCategories() {
        const categoryList = cocktail.getCategories()
            .then(obj => {
                const catList = obj.categories.drinks;

                // asigna la primera opcion de la lista
                const firstOption = document.createElement('option');
                firstOption.textContent = '-Select-';
                firstOption.value = '';
                document.querySelector('#search').appendChild(firstOption);

                // asignar el resto de opciones
                catList.forEach(category => {
                    const option = document.createElement('option');
                    option.textContent = category.strCategory;
                    option.value = category.strCategory.split(' ').join('_');
                    document.querySelector('#search').appendChild(option);
                });
            });
    }


    // Muestra los favoritos
    displayFavorites(drinks) {
        const favoritesTable = document.querySelector('#favorites tbody');

        // se crea elemento html para agregar en cada fila
        drinks.forEach(drink => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                     <img src="${drink.image}" alt="${drink.name}" class="img-fluid" width="100">
                </td>
                <td>
                    ${drink.name}
                </td>
                <td>
                    <a href="#" data-toggle="modal" data-target="#recipe" data-id="${drink.id}" 
                    class="btn btn-success get-recipe">
                        View
                    </a>
                </td>
                <td>
                    <a href="#" data-id="${drink.id}" 
                    class="btn btn-danger remove-recipe">
                        Remove
                    </a>
                </td>
            `;
            favoritesTable.appendChild(tr);
        });
    }


    // Elimina de favoritos
    removeFavorite(element) {
        element.remove();
    }


    // Añadir una clase cuando el cocktail es favorito
    isFavorite(){
        const drinks = cocktailDB.getFromDB();

        drinks.forEach(drink => {
            //destructuring the id
            let {id} = drink;

            // Seleccionar los favoritos
            let favoriteDrink = document.querySelector(`[data-id="${id}"]`);
            if (favoriteDrink){
                favoriteDrink.classList.add('is-favorite');
                favoriteDrink.textContent = '-';
            }
        })
    }
}
















