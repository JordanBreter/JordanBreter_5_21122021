fetch('http://localhost:3000/api/products')
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    console.log(value);
    value.map(product => {
      displayProduct(product);
    
    });
  })
  .catch(function(err) {
    alert(err);
  });
function displayProduct(prod) {
  console.log(prod);
  let link = document.createElement("a");
  link.setAttribute("href", "./product.html?id=" + prod._id);
  let article = document.createElement("article");
  let image = document.createElement ("img");
  image.setAttribute("src", prod.imageUrl);
  image.setAttribute("alt", prod.altTxt);
  let titre = document.createElement("h3");
  titre.setAttribute("class",'productName');
  titre.textContent = prod.name;
  let para = document.createElement("p");
  para.setAttribute("class", "productDescription");
  para.textContent = prod.description;
  article.append(image,titre,para);
  link.append(article);
  let section = document.getElementById("items");
  section.append(link);
}
