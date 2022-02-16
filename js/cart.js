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
      noToDelete.push(prod);
    }

  });

  localStorage.setItem("basket", JSON.stringify(noToDelete));
  elem.remove();
  if (!noToDelete.length) {
    alert("Votre panier est vide !");
  }
  calcul();
}
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
  calcul();
}

function getStorage() {
  return JSON.parse(localStorage.getItem("basket"));
}

function init() {

  let str = window.location.href;
  let url = new URL(str);
  let orderId = url.searchParams.get("orderId");
  if (orderId) {

  } else {
    let basket = getStorage();
    if (basket == null || basket == "") {
      alert('Panier vide');
      return false;
    }
    displayProd(basket);
    initInputForm();
  }
}

function calcul() {
  let totalQuantity = document.getElementById("totalQuantity");
  let totalPriceElem = document.getElementById("totalPrice");

  let inputs = document.getElementsByClassName("itemQuantity");

  let totalQty = 0;
  let totalPrice = 0;

  for (let elem of inputs) {
    let qty = elem.value; // toujours renvoyer une string
    totalQty += parseInt(qty);

    let totalProd = parseInt(qty) * parseInt(elem.unitPrice);
    totalPrice += totalProd;
    console.log(elem.value);
  }
  totalQuantity.textContent = totalQty;
  totalPriceElem.textContent = totalPrice;
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
        calcul()
      });
  });
}
init();

function initInputForm() {
  let inputsForm = document.forms[0];

  inputsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    getForm(event);
    return false;
  });
}

function regTests(inputValue) {
  let testSpecialChars = /[$!@#%&*().?":{}|<>]/;
  let testNumber = /[0-9]/;
  if (testSpecialChars.test(inputValue) || testNumber.test(inputValue)) {
    return false
  } else {
    return true
  }
}

function regTestAdress(inputValue) {
  let testSpecialChars = /[$!@#%&*().?":{}|<>]/;
  if (testSpecialChars.test(inputValue)) {
    return false;
  } else {
    return true;
  }
}

function regTestEmail(inputValue) {
  let testMail = /[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,3}$/;
  if (testMail.test(inputValue)) {
    return true;
  } else {
    return false;
  }
}


function testInput(input) {
  let inputName = input.name;
  let inputValue = input.value;

  let retour = "";

  switch (inputName) {
    case "firstName":
    case "lastName":
    case "city":
      if (regTests(inputValue)) {
        document.getElementById(inputName + "ErrorMsg").textContent = "";
        retour = inputValue;
      } else {
        document.getElementById(inputName + "ErrorMsg").textContent = "Champs incorrect";
        retour = false;
      }
      break;
    case "adresse":
      if (regTestAdress(inputValue)) {
        document.getElementById(inputName + "ErrorMsg").textContent = "";
        retour = inputValue;
      } else {
        document.getElementById(inputName + "ErrorMsg").textContent = "Champs incorrect";
        retour = false;
      }
      break;
    case "email":
      if (regTestEmail(inputValue)) {
        document.getElementById(inputName + "ErrorMsg").textContent = "";
        retour = inputValue;
      } else {
        document.getElementById(inputName + "ErrorMsg").textContent = "Champs incorrect";
        retour = false;
      }
      break;

  }
  return retour;
}


function getForm() {
  /*
    . Ajout des expressions régulières (RegExp)
    . Validation de prénom
    . let valideName = ('^[a-zA-Z]+ [a-zA-Z]$')
    . Le prénom comporte des lettres (Majuscules/Minuscules) et/ou un tiret
    . Validation du nom
    . let valideFirstName = new RegExp ('^[a-zA-Z]+ [a-zA-Z]$')
    . Le nom comporte des lettres (Majuscules/Minuscules) et/ou un tiret
    . Validation de l'adresse
    . L'adresse doit comporter des lettres, des chiffres et quelques caractères spéciaux
    . Validation de la ville
    . let valideAdress = new RegExp ('[0-9]+ [a-zA-Z]+ [0-9]+ [a-zA-Z]$')
    . La ville doit comporter des lettres, (Majuscules/Minuscules) et/ou un tiret
    . Validation de l'Email
      let valideEmail = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$','g')
    . L'email doit en première partie une série de caractères, et/ou chiffres suivis d'un '@', suivis d'une chaine de caractères, suivis d'un '.' et pour finir d'une suite de caractère de maximum 3 lettres
    . Intégrer un message d'erreur au cas où les champs ne sont pas bien remplis
    . Intégrer un message de validation si tous les champs sont bien remplis
  */
  let inputsForm = document.forms[0];

  let contact = {};

  let error = 0;

  for (input of inputsForm) {
    let type = input.type;
    if ("submit" != type) {
      console.log(input.name);
      let prop = testInput(input);
      if (prop) {
        contact[input.name] = prop;
      } else {
        error++;
      }
    }
  }

  if (error) {
    return false;
  }

  let cart = getStorage();
  let products = [];
  cart.map((prod) => {
    products.push(prod.id);
  });

  if (products.length) {
    return false;
  }

  let data = {
    contact,
    products
  };

  fetch("http://localhost:3000/api" + "/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((resp) => {
      localStorage.clear();
      let urlcourante = document.location.href;
      urlcourante = urlcourante.replace("cart.html", "");
      let confirm = "confirmation.html?orderId=" + resp.orderId;
      let url = urlcourante + confirm;
      windox.location = url;
    })
    .catch((error) => {
      logDebug("Error:", error);
    });
}

