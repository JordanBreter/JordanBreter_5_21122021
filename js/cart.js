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
  paraPrice.textContent = prod.price;
  divDescription.append(titre, para, paraPrice);
  let divParam = document.createElement("div");
  divParam.setAttribute("class", "cart__item__content__settings");
  let divParamQty = document.createElement("div");
  divParamQty.setAttribute("class", "cart__item__content__settings__quantity");
  let paraQty = document.createElement("p");
  paraQty.textContent = "Qté :" + prod.qty;
  let input = document.createElement("input");
  input.setAttribute("type", "number");
  input.setAttribute("class", "itemQuantity");
  input.setAttribute("name", "itemQuantity");
  input.setAttribute("min", "1");
  input.setAttribute("max", "100");
  input.setAttribute("value", "42")
  divParamQty.append(paraQty, input);
  let divDelete = document.createElement("div");
  divDelete.setAttribute("class","cart__item__content__settings__delete");
  let paraDelete = document.createElement("p");
  paraDelete.setAttribute("class","deleteItem");

}
function init() {
  let basket = JSON.parse(localStorage.getItem("basket"));
  if (basket == null || basket == "") {
    alert('Panier vide');
    return false;
  }
  displayProd(basket);
}
function displayProd(articles) {
  articles.map(product => {
    fetch('http://localhost:3000/api/products/' + product._id)
      .then(function (res) {
        res.json();
      })
      .then((prod) => {
        prod.qty = product.qty;
        prod.color = product.color;
        displayProduct(prod);
        //calcul()
      });
  });
}
//init();