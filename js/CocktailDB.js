class CocktailDB {

    // obtiene las bebidas del local storage
    getFromDB(){
        let drinks;

        // revisa en localstorage
        if (localStorage.getItem('drinks') === null){
            drinks = [];
        } else {
            drinks = JSON.parse(localStorage.getItem('drinks'));
        }
        return drinks;
    }


    // Guarda las recetas en Local storage
    saveIntoDB(drink){
        const drinks = this.getFromDB();
        drinks.push(drink);

        // Añade el nuevo array en el localstorage
        localStorage.setItem('drinks', JSON.stringify(drinks));
    }


    // Eliminar del local storage
    removeFromDB(id) {
        const drinks = this.getFromDB();

        drinks.forEach((drink, index) => {
            if (id === drink.id){
                drinks.splice(index, 1);
            }
        });

        //guardar el array en local storage
        localStorage.setItem('drinks', JSON.stringify(drinks));
    }
}
