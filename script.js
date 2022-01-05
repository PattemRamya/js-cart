// Store current page ref on localStorage
window.onbeforeunload = function () {
  localStorage.setItem("origin", window.location.href);
}

// clear localStorage if page ref in localStorage is same after page load
window.onload = function () {
  if (window.location.href == localStorage.getItem("origin")) {
    localStorage.clear();
  }
}

//function to display products in home page
function displayProducts() {
  let productsSection = document.getElementById("display-items");
  let section = `
            <div class="container">
            <div class="row">`;
  products.forEach((product) => {
    section += `
      <div class="col-4 gx-4 gy-3">
        <div class="card h-100 p-4 rounded">
          <img
            class="card-img-top h-50 w-50 d-block mx-auto pb-3"
            src="${product.imagesrc}"
            alt="Tablet Image"
          />
          <div class="card-body">
            <div>
              <h5 class="card-title">${product.description}</h5>
            </div>
            <div>
              <h4 style="color:brown;">${product.currency}${product.price}</h4>
            </div>
            <div>
              <button class="btn btn-warning" data-toggle="modal"
              data-target="#modal${product.id}">
                View details
              </button>
            </div>
          </div>
        </div>
      <div
        class="modal"
        id="modal${product.id}"
        tabindex="-1"
        role="dialog"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">
                <strong>Specifications</strong>
              </h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
              >&times;
                
              </button>
            </div>
            <div class="modal-body">
              <h5><strong>About this item</strong></h5>
              <ul>`;
    product.specifications.forEach((specification) => {   //to iterate specifications in subarray
      section += `<li> ${specification} </li>`;
    });
    section += `</ul>
              <table>
                <tr>
                  <td>
                    <h4><strong>Price : </strong></h4>
                  </td>
                  <td>
                    <h4 class="price_color">${product.currency}${product.price}</h4>
                  </td>
                </tr>
              </table>
              <p class="text text-success font-weight-bold d-none" id="product_added${product.id}">Product added to Cart</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="add-cart btn btn-warning" onclick="addToCart(${product.id})">
                Add to cart
              </button>

              <button type="button" class="btn btn-primary" onclick="window.location.href='cart.html'">View cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  });
  section += `</div></div>`;
  productsSection.innerHTML += section;

}


const cart_key = 0;

// function to add items in cart 
function addToCart(id) {
  let items = getCartItems();
  let cart_item = products.find(e => e.id === id);
  console.log("cartitem", cart_item);
  cart_item['quantity'] = 1;
  console.log("Add cart", cart_item);
  let duplicate_item = items.filter(e => e.id === id);// to remove duplicate items 
  console.log(duplicate_item);
  if (duplicate_item.length === 0) {
    items.push(cart_item);
    localStorage.setItem(cart_key, JSON.stringify(items))
    console.log("Cart Items array", JSON.stringify(items));
    document.getElementById("product_added" + id).classList.remove("d-none");//to display product added message in modal
    refreshCartCountBadge();          //updating item number in cart 
  }
  else {
    alert('Item is already available in cart'); //if item already present in cart, showing message as exists in cart 
  }

}

// function to display added items in cart page
function displayCart() {
  console.log("display cart");
  let cartSection = document.getElementById("display-cart");
  let section = `
      <div class="container table_margin" style="background-color: white">
      <br> 
      <h3>Shopping Cart</h3>
      <hr>`;
  let items = getCartItems();
  items.forEach((cart) => {       // iterating items present in local storage and displaying
    section += `
        <div class="row gy-3">
          <div class="col image-col">
            <img src="${cart.imagesrc}" width=350 height=150>
          </div>
          <div class="col-6 " style="font-size: small;">
            <h5>${cart.description}</h5>
            <a>
              <strong>Size name:</strong> 2+32 GB </a>
            <br>
            <a>
              <strong>Style name:</strong> LTE </a>
            <br>
            <a>
              <strong>Pattern name:</strong> Tablet </a>
            <br>
            <table class="mt-2">
              <tr >
                <td style="padding-right:10px;">
                  <select class="form-select" id="qty_select_${cart.id}" onchange="updatePrice(this.value, ${cart.id})"> 
                      <option value="1" >1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                  </select>
                </td>
                <td style="padding-right:10px;">
                  <button class="btn btn-outline-danger" onclick="deleteItem(${cart.id})" style="color:black; ">Delete</button>
                </td>
                <td>
                  <button class="btn btn-outline-info" onclick="window.location.href='index.html'" style="color:black;">See more like this</button>
                </td>
              </tr>
            </table>
          </div>
          <div class="col">
            <h4 id="price-${cart.id}">${cart.currency}${cart.price}</h4>
          </div>
        </div>
      `;
  });
  section += `<hr><div class="h5">Total price: <span id='total_price'></span></div>
    </div>`;
  cartSection.innerHTML = section;
  calcTotalPrice();
}

// function to maintain updated price in cart page
function updatePrice(qty_value, id) {
  console.log('Update Price');
  let items = getCartItems();
  let itemIndex = items.findIndex(e => e.id === id);
  console.log(itemIndex);
  items[itemIndex].quantity = qty_value;

  let price = items[itemIndex].price;
  price = Number(price) * Number(qty_value);
  document.getElementById("price-" + id).innerText = '₹' + price;
  console.log(items);
  localStorage.setItem(cart_key, JSON.stringify(items));
  calcTotalPrice();
}

// function to delete items in cart page
function deleteItem(id) {
  console.log("Delete Item triggered");
  let items = getCartItems();
  let updated_items = items.filter(e => e.id !== id);

  localStorage.setItem(cart_key, JSON.stringify(updated_items));
  calcTotalPrice();
  displayCart();
  refreshCartCountBadge();
  updateQty();
}

// function to calculate overall amount after all items added in cart
function calcTotalPrice() {
  console.log('calcTotalPrice');
  let items = getCartItems();
  let totalSum = 0;
  items.forEach(item => {
    totalSum += Number(item.price) * Number(item.quantity);
  });
  document.getElementById('total_price').textContent = '₹' + totalSum;
}

// function returns stored cart_items from LocalStorage
function getCartItems() {
  return localStorage.getItem(cart_key) === null ? [] : JSON.parse(localStorage.getItem(cart_key));
}

function refreshCartCountBadge() {
  let items = getCartItems();
  document.getElementById("cart").innerText = items.length;
}
// to update qty in selected item
function updateQty() {
  console.log("In updateQty");
  let items = getCartItems();
  items.forEach(e => {
    let qtyElement = document.getElementById("qty_select_" + e.id);
    console.log("QtyElement ", qtyElement.value, e.id);
    qtyElement.value = e.quantity;
    updatePrice(e.quantity, e.id);
  });
}

