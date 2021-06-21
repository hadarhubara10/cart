//import the categories
import * as names from '../modules/categories.js';

// variable

let arrayCat = names.myArr;
// phone path
let phoneArray = arrayCat[0].phone;
// TV path
let tvArray = arrayCat[1].TV;
// Laptop path
let laptopArray = arrayCat[2].laptop;
let typeOrder = 'phone';
let viewNav = true;
let arrayOrder = [];
let orderDetails = [];
let clientList = [];
let PKorderIdNum = 1;
let PKidClientNum = 1;
// id number of client in array
let idClientInArray;
let quantity = 1;
// variable valid function
let trueNum;

window.onload = () => {
  getClientFromLocalStorage();
  // Get data from localStorage
  if (localStorage.getItem('arrayOrder') != null) {
    getToLocalStorsge();
    checkTotalCart();
  }
  // start view
  categoryToView(phoneArray);
  // on button category click
  idPhone.onclick = () => {
    categoryToView(phoneArray);
  };
  idTV.onclick = () => {
    categoryToView(tvArray);
  };
  idLaptop.onclick = () => {
    categoryToView(laptopArray);
  };
  // Open side nav
  viewAll.onclick = () => {
    displayLeftNav();
  };
  // Add product to cart
  rowCart.onclick = () => {
    addToCart();
  };
  // Remove product in sideBar with bubbling
  idUlSideBar.onclick = () => {
    removeOrderInCart();
  };
  // Remove all product on cart
  deleteAll.onclick = () => {
    deleteAllCart();
  };
  // Show total price
  CheckoutButton.onclick = () => {
    idLabelCheckout.innerHTML = idTotalCart.innerHTML;
  };

  // Alert successful or error
  idPay.onclick = () => {
    trueNum = 0;
    regExpValidPhone();
    regExpValidName();
    regExpValidMail();
    if (trueNum == 3) endCheckout();
  };
};
// View the product of category on site
function categoryToView(category) {
  rowCart.innerHTML = '';
  for (let i = 0; i < category.length; i++) {
    rowCart.innerHTML += `<div class="col mb-5">
            <div class="card h-100">
              <!-- Product image-->
              <img
                class="card-img-top" 
                src="${category[i].img}"
                alt="..."
              />
              <!-- Product details-->
              <div class="card-body p-4">
                <div class="text-center">
                  <!-- Product name-->
                  <h5 class="fw-bolder">${category[i].productName}</h5>
                  <!-- Product price-->
                  <del>
                  ${numberWithCommas(category[i].price + 500)}₪
                  </del>
                  <br>
                  ${numberWithCommas(category[i].price)}₪
                </div>
              </div>
              <!-- Product actions-->
              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                  <button id="${
                    category[i].cartID
                  }" class="btn btn-outline-dark mt-auto clickOrder">
                  Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>`;
  }
  checkTotalCart();
}

// Add comma to number
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
// Add product to cart, and save the product in arrayOrder
function addToCart() {
  if (event.target.type == 'submit') {
    // console.log(event.target);
    let allArray = phoneArray.concat(tvArray, laptopArray);
    for (const key in allArray) {
      if (allArray[key].cartID == event.target.id) {
        if (checkIfOrderInArray(event.target.id)) {
          console.log(arrayOrder);
        } else {
          arrayOrder.push(allArray[key]);
          new Toast({
            message: 'The product added to the cart!',
            type: 'success',
          });
          // לשנות את הסכום
          idBadge.innerHTML = arrayOrder.length;
          checkTotalCart();
          showAll();
        }
      }
    }
  }
}
// Show all in cart
function showAll() {
  idUlSideBar.innerHTML = '';
  for (const index in arrayOrder) {
    idUlSideBar.innerHTML += `<li class="clearfix">
            <img src="${arrayOrder[index].img}"alt="item1"/>
            <span class="item-name">${arrayOrder[index].productName}</span>
            <span class="item-price">${numberWithCommas(
              arrayOrder[index].price
            )}₪</span>
            <span class="item-quantity">Quantity: ${
              arrayOrder[index].quantity
            }</span>
            <img id="${
              arrayOrder[index].cartID
            }" style="width: 19px; float:right;" src="./images/x-button.png">
          </li>`;
  }
  checkTotalCart();
  saveToLocalStorage();
}
// Remove order in cart with bubbling - event.target.
function removeOrderInCart() {
  if (event.target.id) {
    console.log(arrayOrder);
    for (let index = 0; index < arrayOrder.length; index++) {
      if (arrayOrder[index].cartID == event.target.id) {
        if (arrayOrder[index].quantity > 1) {
          arrayOrder[index].quantity--;
          checkTotalCart();
        } else {
          arrayOrder.splice(index, 1);
          idBadge.innerHTML = arrayOrder.length;
          checkTotalCart();
          break;
        }
      }
    }
  }
  console.log(arrayOrder);
  showAll();
}
// Show/Hide Cart in site
function displayLeftNav() {
  $('#idSideNav').slideToggle();
  if (viewNav) {
    viewAll.innerHTML = `View Cart<i class="fas fa-shopping-cart"></i>`;
    viewNav = false;
  } else {
    viewAll.innerHTML = `Hide Cart<i class="fas fa-shopping-cart"></i>`;
    viewNav = true;
  }
}
// Check total price
function checkTotalCart() {
  let totalValue = 0;
  for (const index in arrayOrder) {
    let totalOrder =
      Number(arrayOrder[index].price) * arrayOrder[index].quantity;
    totalValue += totalOrder;
  }
  idTotalCart.innerHTML = numberWithCommas(totalValue) + '₪';
  idBadge.innerHTML = arrayOrder.length;
  saveToLocalStorage();
}

// Save on local storage
function saveToLocalStorage() {
  localStorage.setItem('arrayOrder', JSON.stringify(arrayOrder));
}

// Get on local storage
function getToLocalStorsge() {
  arrayOrder = localStorage.getItem('arrayOrder');
  console.log(arrayOrder);
  arrayOrder = JSON.parse(arrayOrder);
  idBadge.innerHTML = arrayOrder.length;
  showAll();
}
// Delete all cart
function deleteAllCart() {
  arrayOrder = [];
  showAll();
  checkTotalCart();
}
// Check if client in arrayClient through email
function checkIfClientInArray() {
  for (let i = 0; i < clientList.length; i++) {
    if (idInputMail.value == clientList[i].clientMail) {
      idClientInArray = clientList[i].PKidClient;
      return true;
    }
  }
  return false;
}
// if: client not in array add to clientArray
// else: add order details with id client of clientArray
function addToClientArray() {
  if (!checkIfClientInArray()) {
    clientList.push({
      PKidClient: clientList.length + 1,
      clientName: idInputName.value,
      clientPhone: idPhoneName.value,
      clientMail: idInputMail.value,
    });
    orderDetails.push({
      PKorderId: orderDetails.length + 1,
      dateOrder: new Date(),
      clientId: PKidClientNum,
      product: arrayOrder,
    });
    PKidClientNum++;
    PKorderIdNum++;
  } else {
    orderDetails.push({
      PKorderId: orderDetails.length + 1,
      dateOrder: new Date(),
      clientId: idClientInArray,
      product: arrayOrder,
    });
    PKorderIdNum++;
  }
  console.log(clientList);
  console.log(orderDetails);
}
// If order in arrayOrder, quantity++.
function checkIfOrderInArray(orderID) {
  quantity = 1;
  for (let index = 0; index < arrayOrder.length; index++) {
    let element = arrayOrder[index];
    if (element.cartID == orderID) {
      arrayOrder[index].quantity++;
      showAll();
      return true;
    }
  }
  return false;
}

function saveClientToLocalStorage() {
  localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
  localStorage.setItem('clientList', JSON.stringify(clientList));
}
function getClientFromLocalStorage() {
  // debugger;
  orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
  clientList = JSON.parse(localStorage.getItem('clientList'));
  if (clientList == null) clientList = [];
  if (orderDetails == null) orderDetails = [];
  console.log(orderDetails);
  console.log(clientList);
}

function endCheckout() {
  if (
    idInputName.value != '' &&
    idInputMail.value != '' &&
    idPhoneName.value != ''
  ) {
    alertify.alert(
      '',
      `<span class="fas fa-clipboard-check" style="vertical-align:middle;color:blue;">&nbsp;	
               </span>Your purchase was successful!`,
      function () {
        alertify.success('Thanks for buying');
      }
    );
    // remove localStorage
    localStorage.removeItem('arrayOrder');
    addToClientArray();
    saveClientToLocalStorage();
  }
}

// check if work
function regExpValidMail() {
  let patternMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  let result = patternMail.test(idInputMail.value);
  if (result) {
    trueNum++;
    return true;
  } else {
    alertify.alert(`<span class="fa fa-times-circle fa-2x"
                style="vertical-align:middle;color:#e10000;">&nbsp;	
               </span> Please fill your mail!`);
  }
}
function regExpValidName() {
  let patterName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;
  let result = patterName.test(idInputName.value);
  if (result) {
    trueNum++;
    return true;
  } else {
    alertify.alert(`<span class="fa fa-times-circle fa-2x"
                style="vertical-align:middle;color:#e10000;">&nbsp;	
               </span> Please fill your Name!`);
  }
}
function regExpValidPhone() {
  let patterPhone = /^^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
  let result = patterPhone.test(idPhoneName.value);
  if (result) {
    trueNum++;
    return true;
  } else {
    alertify.alert(`<span class="fa fa-times-circle fa-2x"
                style="vertical-align:middle;color:#e10000;">&nbsp;	
               </span> Please fill your Phone!`);
  }
}
