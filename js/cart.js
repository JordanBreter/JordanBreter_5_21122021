function displayProduct(prod) {
  let article = document.createElement("article");
  article.setAttribute("class", "cart__item");
  article.setAttribute("data-id", prod._id);
  article.setAttribute("data-color", prod.color);
  article.setAttribute("data-price", prod.price);

  let image = document.createElement("img");
  image.setAttribute("src", prod.imageUrl);
  image.setAttribute('alt', prod.altTxt);
  let divImage = document.createElement("div");
  divImage.setAttribute("class", "cart__item__img");
  divImage.append(image);

  let divContent = document.createElement("div");
  divContent.setAttribute("class", "cart__item__content");

  let divDescription = document.createElement("div");
  divDescription.setAttribute("class", "cart__item__content__description");
  let titre = document.createElement("h2");
  titre.textContent = prod.name;
  let para = document.createElement("p");
  para.textContent = prod.color;

  let paraPrice = document.createElement("p");
  paraPrice.textContent = prod.price + " €";
  divDescription.append(titre, para, paraPrice);

  let divParam = document.createElement("div");
  divParam.setAttribute("class", "cart__item__content__settings");

  let divParamQty = document.createElement("div");
  divParamQty.setAttribute("class", "cart__item__content__settings__quantity");
  let paraQty = document.createElement("p");
  paraQty.textContent = "Qté : " + prod.qty;
  let input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("class", "itemQuantity");
  input.setAttribute("name", "itemQuantity");
  input.setAttribute("min", "1");
  input.setAttribute("max", "100");
  input.value = prod.qty;
  input.colorSelected = prod.color;
  input.unitPrice = prod.price;
  divParamQty.append(paraQty, input);

  input.addEventListener("change", (event) => (
    updateQty(event)//event.target = input
  ));

  let divDelete = document.createElement("div");
  divDelete.setAttribute("class", "cart__item__content__settings__delete");

  let paraDelete = document.createElement("p");
  paraDelete.setAttribute("class", "deleteItem");
  paraDelete.textContent = "Supprimer";
  paraDelete.addEventListener("click", (e) => {
    deleteProd(e);
  });

  divDelete.append(paraDelete);

  divParam.append(divParamQty, divDelete);

  divContent.append(divDescription, divParam);

  article.append(divImage, divContent);

  let section = document.getElementById("cart__items");
  section.append(article);

}

function deleteProd(e) {
  let elem = e.target.closest("article");

  let color = elem.getAttribute("data-color");
  let id = elem.getAttribute("data-id");

  let basket = getStorage();
  let noToDelete = [];
  basket.map((prod) => {
    if (id !== prod.id || color !== prod.color) {
      noToDelete.push(noToDelete);
    }

  });

  function updateQty(event) {
    let priceInObj = event.target.unitPrice;
    let colorInObj = event.target.colorSelected;
    let val = event.target.value;
    console.log(priceInObj + " " + colorInObj, "In object");

    let price = event.target.closest("article").getAttribute("data-price");
    let color = event.target.closest("article").getAttribute("data-color");
    console.log(price + " " + color + " " + val, "In Article");

    if (0 >= parseInt(val)) {
      alert("0 n'est pas une quantité");
      return false;
    }

    let id = event.target.closest("article").getAttribute("data-id");

    let basket = getStorage();
    basket.map((prod) => {
      if (id === prod.id && color === prod.color) {
        prod.qty = val;
      }
    });

    localStorage.setItem("basket", JSON.stringify(basket));
  }

  function getStorage() {
    return JSON.parse(localStorage.getItem("basket"));
  }

  function init() {
    let basket = getStorage();
    if (basket == null || basket == "") {
      alert('Panier vide');
      return false;
    }
    displayProd(basket);
  }
  
  function calcul() {

  }
  function displayProd(articles) {
    articles.map(product => {
      fetch('http://localhost:3000/api/products/' + product.id)
        .then((res) => res.json())
        .then((prod) => {
          prod.qty = product.qty;
          prod.color = product.color;
          prod.id = product.id;
          displayProduct(prod);
          //calcul()
        });
    });
  }
}
