$(function () {

    var modalBody = $('.modal-body');
    var ingredientDiv;
    var ingredientName

    var createCard = function (result) {
        var drinks = result.drinks;
        var parrent = $('#cards');
        parrent.html('');
        for (var i = 0; i < drinks.length; i++) {
            var imgUrl = drinks[i].strDrinkThumb;
            var card = $('<div class="card card-' + i
                + '"  data-toggle="modal" data-target="#modalWindow"><img class="card-img-top" src="' + imgUrl +
                '" alt="Card image cap"><div class="card-body"><p class="card-text">' + drinks[i].strDrink + '</p></div></div>');
            card.addClass('col-sm-6 col-md-3')
            parrent.append(card);
            if (drinks[i].strAlcoholic === 'Alcoholic') {
                card.append('<img class="alcoholImg" src="img/G3523.png">');
            }
            if (drinks[i].strIngredient1) {
                $('.card-' + i).on('click', getIngredients(drinks[i]));
            }
        }
    };

    var getIngredients = function (drink) {
        return function () {
            modalBody.html('');
            var ul = $('<ul>').text('Ингредиенты:');
            for (var i = 1; i < 16; i++) {
                var ingredient = drink['strIngredient' + i];
                if (ingredient != '') {
                    var li =
                        $('<li>').append('<img src="https://www.thecocktaildb.com/images/ingredients/'
                            + ingredient + '-Small.png">' + ingredient + ' ' + '{' + drink['strMeasure' + i] +
                            '}').addClass(ingredient);
                    ul.append(li);
                } else {
                    break;
                }
            }
            modalBody.append('<p>Алкогольный: ' + drink['strAlcoholic']);
            modalBody.append('<p>Категория: ' + drink['strCategory']);
            modalBody.append('<p>Подается в: ' + drink['strGlass']);
            modalBody.append(ul);
            modalBody.append('<p>Инструкция</p><p>' + drink['strInstructions'] + '</p>');
        }
    }

    var request = function (url, ingredientName) {
        $.get(url).then(function (result) {
            if (!result.ingredients) {
                createCard(result);
            } else {
                var ingredientInfo = result.ingredients[0];
                modalBody.append($('<div class="ingredient_desc">').html('<p>' +
                    ingredientInfo.strIngredient + '</p><p>' +
                    ingredientInfo.strDescription + '</p>' +
                    '<button class="extra_modal" type="button">Закрыть</button>' +
                    '<button class="extra_modal_find" type="button">Найти напитки с ' + ingredientName
                    + '</button>'));
                ingredientDiv = $('.ingredient_desc').css('display', 'block');
                ingredientDiv.prepend('<img class="modal_img" src="https://www.thecocktaildb.com/images/ingredients/' +
                    ingredientName + '-Small.png">');
            }

        });
    }

    var close = function(ingredientDiv) {
        ingredientDiv.css('display', 'none');
        ingredientDiv.html('');
    }

    $('.form-inline').on('submit', function (e) {
        e.preventDefault();
        request('https:www.thecocktaildb.com/api/json/v1/1/search.php?s=' + $('.form-control').val());
    });

    modalBody.on('click', 'li', function (e) {
        e.preventDefault();
        ingredientName = e.currentTarget.className;
        request('https://www.thecocktaildb.com/api/json/v1/1/search.php?i=' + ingredientName, ingredientName);
    });

    modalBody.on('click', '.extra_modal', function (e) {
        e.preventDefault();
        close(ingredientDiv)
    });

    modalBody.on('click', '.extra_modal_find', function (e) {
        e.preventDefault();
        request('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + ingredientName);
        close(ingredientDiv)
    });
});