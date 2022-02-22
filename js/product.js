init();
function init() {
    let str = window.location.href;
    let url = new URL(str);
    let idProduct = url.searchParams.get("id");
    if (idProduct) {
        getArticle(idProduct);
    } else {
        alert("erreur");
    }
}

function getArticle(idProduct) {
    fetch("http://localhost:3000/api/products/" + idProduct)
        .then(function (res) {
            if (res.ok) {
                return res.json()
            }
        })
        .then(function (resultatAPI) {
            displayProduct(resultatAPI);
        })
        .catch(function (err) {
            alert(err)("Erreur");
        })
}

function displayProduct(article) {
    let image = document.createElement('img');
    image.setAttribute('src', article.imageUrl);
    image.setAttribute('alt', article.altTxt);
    document.querySelector('.item__img').append(image);
    console.log(image)
    let nameProduct = document.getElementById('title');
    nameProduct.textContent = article.name;
    let priceProduct = document.getElementById('price');
    priceProduct.textContent = article.price;
    let descriptionProduct = document.getElementById('description');
    descriptionProduct.textContent = article.description;
    let color = document.getElementById('colors');
    console.log(article);
    for (let col of article.colors) {
        let option = document.createElement('option');
        option.value = col;
        option.textContent = col;
        color.append(option);
    }
    //********************FOR IN ***********************/
    //for (let col in article.colors) {
    //console.log(color);
    //let option = document.createElement('option');
    //option.value = article.colors[col];
    //option.textContent = article.colors[col];
    //color.append(option);
    //}
    /*********************FOR EACH ********************/
    //let col = (array) => {
    //array.forEach(item => {
    //let option = document.createElement ('option');
    //option.textContent = item;
    //option.value = item;
    //color.append(option);
    //});
    //col (article.colors);
    //}
    /*********************NEW OPTION *****************/
    //let option = new Option();

    document.getElementById('addToCart').addEventListener('click', () => {

        addToCart(article._id);
        alert("Produit ajouté");
    });
}
function addToCart(choise) {
    let color = document.getElementById('colors').value;
    if (color === '') {
        alert('Il faut choisir une couleur');
        return false;
    }
    let quantite = document.getElementById('quantity').value;
    if (quantite <= 0) {
        alert('Il faut mettre une quantité');
        return false;
    }
    let cart = {
        id: choise,
        color: color,
        qty: quantite,
    };
    addCart(cart);
}
function addToLs(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}
function getToLs() {
    let basket = localStorage.getItem("basket");
    if (basket == null) {
        return false;
    } else {
        return JSON.parse(basket);
    }
}
function addCart(product) {
    let basket = getToLs();
    if (basket === false) {
        basket = [];
        basket.push(product);
        addToLs(basket);
        return false;
    }
    let verif = false;
    basket.forEach(p => {
        if (p.id == product.id && p.color == product.color) {
            p.qty = parseInt(product.qty) + parseInt(p.qty);
            verif = true;
        }
    });
    if (verif == false) {
        basket.push(product);
    }
    // if (!verif)

    addToLs(basket);
}