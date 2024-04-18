
const home= document.getElementById("home");
const popularDishes = document.getElementById("popular_dishes");
const dishImage = document.getElementById('dish_image');
const dishTitle = document.getElementById('dish_title');
const categoryDropdown = document.getElementById('categoryDropdown');
const searchedCategories = document.getElementById('searched_categories');
const information = document.getElementById('information');
const randomDish = document.getElementById('random_dish');
const modalContainer = document.getElementById('modal-container');

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            dishImage.src = meal.strMealThumb;
            dishTitle.textContent = meal.strMeal;
            dishImage.style.display = 'block';
            
            dishImage.addEventListener("click",function(){
                fetchMealDetails(meal.idMeal);
            })
        })
});

document.addEventListener('DOMContentLoaded', function () {
    fetchCategories();
});

function fetchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.strCategory;
                option.textContent = category.strCategory;
                categoryDropdown.append(option);
            });
        })
        
}

categoryDropdown.addEventListener('change', function () {
    const selectedCategory = categoryDropdown.value;
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`)
        .then(response => response.json())
        .then(data => {
            const meals = data.meals;
            if (meals && meals.length > 0) {
                clearResults();
                information.style.visibility = 'hidden';
                meals.forEach(meal => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item');

                    const resultImage = document.createElement('img');
                    resultImage.src = meal.strMealThumb;
                    resultImage.alt = meal.strMeal;
                    resultImage.classList.add('result-image');

                    const resultTitle = document.createElement('p');
                    resultTitle.textContent = meal.strMeal;
                    resultTitle.classList.add('result-title');

                    resultItem.appendChild(resultImage);
                    resultItem.appendChild(resultTitle);
                    searchedCategories.appendChild(resultItem);

                    resultItem.addEventListener('click', function () {
                        fetchMealDetails(meal.idMeal);
                    });
                });
            } else {
                console.error('No meals found for the selected category');
            }
        })
        
});

function clearResults() {
    searchedCategories.innerHTML = '';
}

function fetchMealDetails(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            openModal(meal);
        })
        
}

function openModal(meal) {
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = 'X';

    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = meal.strMeal;

    const ingredients = document.createElement('div');
    ingredients.innerHTML = `<h3>Ingredients:</h3>${getIngredientsList(meal)}`;

    const youtubeVideo = document.createElement('div');
    youtubeVideo.innerHTML = `<h3>YouTube Video:</h3><iframe width="560" height="315" src="${meal.strYoutube.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen></iframe>`;

    modalContent.append(closeButton);
    modalContent.append(title);
    modalContent.append(ingredients);
    modalContent.append(youtubeVideo);
    modalContainer.innerHTML = '';
    modalContainer.append(modalContent);
    document.body.append(modalContainer);
    modalContainer.style.display = 'flex';

    modalContainer.innerHTML = ''; 
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);

    modalContainer.style.display = 'flex';

    modalContainer.addEventListener('click', function (event) {
        if (event.target == closeButton || event.target == modalContainer) {
            if (document.body.contains(modalContainer)) {
                modalContainer.style.display = 'none';
                document.body.removeChild(modalContainer);
            }
        }
    });
}

function getIngredientsList(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }
    return ingredients.join('<br>');
}


home.addEventListener("click",function(){
    window.location.href="./index.html"
})

popularDishes.addEventListener("click",function(){
    window.location.href="dish.html"
})