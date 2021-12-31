let productElements = document.getElementById("display-items");
const cart_key = "cart_items";

console.log(window.location.href);

// To clear session storage on page refresh
// Store current page ref on sessionStorage
window.onbeforeunload = function () {
    sessionStorage.setItem("origin", window.location.href);
}

// clear sessionStorage if page ref in sessionStorage is same after page load
window.onload = function () {
    if (window.location.href == sessionStorage.getItem("origin")) {
        sessionStorage.clear();
    }
}

function displayProducts() {
    let productsSubArrays = chunck(products, 3);

    productsSubArrays.forEach((products) => {
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
          <div class="card-block">
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
            product.specifications.forEach((spec) => {
                section += `<li> ${spec} </li>`;
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

              <button type="button" class="btn btn-primary" onclick="displayCart()">View cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
        });
        section += `</div></div>`;
        productElements.innerHTML += section;
    });
}
displayProducts();

// function creates and returns an array of subarray with given size
function chunck(array, size) {
    const productsSubArrays = [];
    let index = 0;
    while (index < array.length) {
        productsSubArrays.push(array.slice(index, size + index));
        index += size;
    }
    return productsSubArrays;
}

function addToCart(id) {
    let items = getCartItems();

    let cart_item = products.find(e => e.id === id);
    cart_item['quantity'] = 1;
    console.log("Add cart", cart_item);

    let duplicate_item = items.filter(e => e.id === id);

    console.log(duplicate_item);

    if (duplicate_item.length === 0) {
        items.push(cart_item);

        sessionStorage.setItem(cart_key, JSON.stringify(items))
        console.log("Cart Items array", JSON.stringify(items));
        document.getElementById("product_added" + id).classList.remove("d-none");
        document.getElementById("cart").textContent = items.length;
        displayCart();
    } else {
        alert('Item is already available in cart');
    }

}



function displayCart() {
    console.log("display cart");
    let cartElements = document.getElementById("display-cart");
    let section = `
      <div class="container table_margin" style="background-color: white">
      <br> 
      <h3>Shopping Cart</h3>
      <hr>`;
    let items = getCartItems();
    items.forEach((cart) => {
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
              <tr>
                <td>
                  <select class="form-select" id="qty-${cart.id}" onchange="updatePrice(this.value, ${cart.id})">
                      <option value="1" selected>1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                </td>
                <td>
                  <button class="btn btn-outline-danger" onclick="deleteItem(${cart.id})" style="color:black; ">Delete</button>
                </td>
                <td>
                  <button class="btn btn-outline-info" href="#" style="color:black;">See more like this</button>
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
    cartElements.innerHTML = section;
    calcTotalPrice();
}

function updatePrice(qty_value, id) {
    console.log("price", id);
    console.log("Qty", qty_value);

    let items = getCartItems();
    let itemIndex = items.findIndex(e => e.id === id);

    items[itemIndex].quantity = qty_value;

    let price = items[itemIndex].price.replaceAll(',', '');
    price = Number(price) * Number(qty_value);
    document.getElementById("price-" + id).innerText = '₹' + price;
    sessionStorage.setItem(cart_key, JSON.stringify(items));
    calcTotalPrice();

}

function deleteItem(id) {
    console.log("Delete Item triggered");

    let items = getCartItems();

    let updated_items = items.filter(e => e.id !== id);

    sessionStorage.setItem(cart_key, JSON.stringify(updated_items));
    document.getElementById("cart").textContent = updated_items.length;
    displayCart();
    calcTotalPrice();
}

function calcTotalPrice() {
    console.log('calcTotalPrice');
    let items = getCartItems();
    let totalSum = 0;
    items.forEach(item => {
        totalSum += Number(item.price.replaceAll(',', '')) * Number(item.quantity);
    });
    document.getElementById('total_price').textContent = '₹' + totalSum;
}

function getCartItems() {
    return sessionStorage.getItem(cart_key) === null ? [] : JSON.parse(sessionStorage.getItem(cart_key));

}