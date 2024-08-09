const menuIcon = document.querySelector('.bx-menu');
const closeIcon = document.getElementById('close-icon')
const mobileLinks = document.querySelector('.mobile-links');

menuIcon.addEventListener('click', function () {
    mobileLinks.classList.toggle('hidden');
})

closeIcon.addEventListener('click', function () {
    mobileLinks.classList.add('hidden');
})

// cart-page
const cartIcon = document.querySelector('.bx-cart-alt')
const cartCloseIcon = document.getElementById('cart-close-icon')
const cartPage = document.querySelector('.cart-page')

cartIcon.addEventListener('click', function () {
    cartPage.classList.toggle('hidden')
})

cartCloseIcon.addEventListener('click', function () {
    cartPage.classList.add('hidden')
})

// feching-api
const apiUrl = "https://fakestoreapi.com/products";
const productsPage = document.querySelector('.products-page')
const limitProduct = document.querySelector('.limit-products')

// fetch all products
async function fetchProduct(){
    const res = await fetch(apiUrl);
    const data = await res.json()
    console.log(data)

    productsPage.innerHTML = data.map( function (items) {
        return`
          <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200" data-aos="fade-up">
            <div class="bg-gray-200 px-3 py-3  rounded-md">
                <div class=-"">
                    <i class='bx bx-heart'></i>
                </div>
                <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
            </div>
            <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                <div class="flex items-center justify-between">
                    <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                    <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                </div>
                <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
            </div>
        </div>`
    }).join('')
}

fetchProduct()


// fetch 8 products
async function fetchEightProduct(){
    const res = await fetch(`${apiUrl}?limit=8`);
    const data = await res.json()
    console.log(data)

    limitProduct.innerHTML = data.map( function (items) {
        return`
          <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200" data-aos="fade-up">
            <div class="bg-gray-200 px-3 py-3  rounded-md">
                <div class=-"">
                    <i class='bx bx-heart'></i>
                </div>
                <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
            </div>
            <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                <div class="flex items-center justify-between">
                    <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                    <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                </div>
                <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
            </div>
        </div>`
    }).join('')
}

fetchEightProduct()


const showCart = document.querySelector('.show-cart')
let emptyMessage1 = document.querySelector('.empty-message1')
let emptyMessage2 = document.querySelector('.empty-message2')


let cart = [];

// display cart

async function displayCart(id) {
    const res = await fetch(apiUrl);
    const data = await res.json()

    if(cart.some(function(exist){return exist.id === id})) {
        alert('Products already exist!');
    } else {
        const item = data.find(function(product) {
            return product.id === id;
        })

        // add number of units
        item.numberOfUnits = 1;

        cart.push(item);
        renderCartItems();
        calculateTotal()
        emptyMessage1.innerHTML = ""
        emptyMessage2.innerHTML = ""
    }
}

// remove item
async function removeItem (id) {
    cart = cart.filter(function(product) {
        return product.id !== id;
    }) 
    renderCartItems()
    calculateTotal()
}

// increase the quantity
async function increaseQuantity (id) {
    const item = cart.find(function(product) {
        return product.id === id;
    })
    if(item.numberOfUnits < 5){
        item.numberOfUnits ++
        renderCartItems()
        calculateTotal()
    } else {
        alert('You can only add 5 units')
    }
}

// decrease quantity
async function decreaseQuantity (id){
    const item = cart.find(function(product) {
        return product.id === id;
    })
    if(item.numberOfUnits === 1){
        alert('You must have at least a quantity')
    } else {
        item.numberOfUnits--
        renderCartItems()
        calculateTotal()
    }
}

const subTotal = document.querySelector('.sub-total');
const total = document.querySelector('.total');
const cartUpdate = document.querySelector('.cart-update');

// total price
async function calculateTotal() {
    const totalCartProductsPrice = cart.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.price * currentValue.numberOfUnits)
    }, 0);
    subTotal.innerHTML = totalCartProductsPrice;

    // checkoutPrice
    total.innerHTML = totalCartProductsPrice + 10;
    cartUpdate.innerHTML = cart.length;
}


// render cart items
const renderCartItems = () => {
    showCart.innerHTML = cart.map(items => {
        return `
                <div class="cart-products relative flex items-center justify-between md:w-[40rem] w-[20rem] border border-gray-200 rounded-lg px-6 py-3">
                    <div class="flex items-center gap-3">
                        <img src="${items.image}" style="width: 4rem;" class="bg-gray-200 rounded-lg px-2 py-2" >
                        <h3 class="md:text-[1rem] text-[0.7rem] md:w-[10rem] w-[7rem] font-bold">${items.title}</h3>
                    </div>
                    <p class="md:text-[1rem] text-[0.7rem] font-bold">$${items.price}</p>
                    <div>
                        <p class="increase cursor-pointer" onclick="increaseQuantity(${items.id})">+</p>
                        <h3>${items.numberOfUnits}</h3>
                        <p class="decrease cursor-pointer" onclick="decreaseQuantity(${items.id})">-</p>
                    </div>
                    <i class='bx bx-trash' class="absolute right-1 top-1" onclick="removeItem(${items.id})"></i>
                </div>`
    }).join('')
}



// search by categories implementation
const searchIcon = document.querySelector('.bx-search');
async function getCategories () {
    const categoryInput = document.querySelector('.category-Input').value;
    console.log(categoryInput)
    const res = await fetch(apiUrl);
    const data = await res.json()
    console.log(data)
    if(categoryInput === 'jewelery' ){
        let jeweleryFilter = data.filter(function(item) {
            return item.category === "jewelery";
        })
        productsPage.innerHTML = jeweleryFilter.map(items => {
              return `
                <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200">
                  <div class="bg-gray-200 px-3 py-3 rounded-md">
                      <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
                  </div>
                  <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                      <div class="flex items-center justify-between">
                          <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                          <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                      </div>
                      <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
                  </div>
                </div>`;
          }).join('');

    } else if (categoryInput === 'electronics') {
        let electronicsFilter = data.filter(function (item) {
            return item.category === 'electronics';
        })
        productsPage.innerHTML = electronicsFilter.map(items => {
            return `
              <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200">
                <div class="bg-gray-200 px-3 py-3 rounded-md">
                    <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
                </div>
                <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                    <div class="flex items-center justify-between">
                        <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                        <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                    </div>
                    <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
                </div>
              </div>`;
        }).join('');

    } else if (categoryInput === `men's clothing`) {
        let menClothingFilter = data.filter(function (item) {
            return item.category === `men's clothing`;
        })
        productsPage.innerHTML = menClothingFilter.map(items => {
            return `
              <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200">
                <div class="bg-gray-200 px-3 py-3 rounded-md">
                    <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
                </div>
                <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                    <div class="flex items-center justify-between">
                        <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                        <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                    </div>
                    <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
                </div>
              </div>`;
        }).join('');
} else if (categoryInput === `women's clothing`) {
    let womenClothingFilter = data.filter(function (item) {
        return item.category === `women's clothing`;
    })
    productsPage.innerHTML = womenClothingFilter.map(items => {
        return `
          <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200">
            <div class="bg-gray-200 px-3 py-3 rounded-md">
                <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
            </div>
            <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                <div class="flex items-center justify-between">
                    <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                    <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                </div>
                <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
            </div>
          </div>`;
    }).join('');
}
    productsPage.scrollIntoView({ behavior: 'smooth' });
}
searchIcon.addEventListener('click', getCategories);

const womenCollBtns = document.querySelectorAll('.womenColl')
const menCollBtns = document.querySelectorAll('.menColl')
const electronicsBtns = document.querySelectorAll('.electronics')
const jewelryCollBtns = document.querySelectorAll('.jewelry')
async function getWomenColl () {
    const res = await fetch(apiUrl);
    const data = await res.json()
    const womenFilter = data.filter(function(items) {
        return  items.category === `women's clothing`
    })

    productsPage.innerHTML = womenFilter.map(items => {
        return `
          <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200">
            <div class="bg-gray-200 px-3 py-3 rounded-md">
                <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
            </div>
            <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                <div class="flex items-center justify-between">
                    <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                    <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                </div>
                <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
            </div>
          </div>`;
    }).join('');

    productsPage.scrollIntoView({ behavior: 'smooth' });
}

womenCollBtns.forEach(btn => {
    btn.addEventListener('click', getWomenColl);
});

async function getMenColl () {
    const res = await fetch(apiUrl);
    const data = await res.json()
    const menFilter = data.filter(function(items) {
        return  items.category === `men's clothing`
    })

    productsPage.innerHTML = menFilter.map(items => {
        return `
          <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200">
            <div class="bg-gray-200 px-3 py-3 rounded-md">
                <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
            </div>
            <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                <div class="flex items-center justify-between">
                    <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                    <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                </div>
                <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
            </div>
          </div>`;
    }).join('');

    productsPage.scrollIntoView({ behavior: 'smooth' });
}

menCollBtns.forEach(btn => {
    btn.addEventListener('click', getMenColl);
});

async function electronicsColl () {
    const res = await fetch(apiUrl);
    const data = await res.json()
    const electronicsFilter = data.filter(function(items) {
        return  items.category === `electronics`
    })

    productsPage.innerHTML = electronicsFilter.map(items => {
        return `
          <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200">
            <div class="bg-gray-200 px-3 py-3 rounded-md">
                <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
            </div>
            <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                <div class="flex items-center justify-between">
                    <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                    <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                </div>
                <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
            </div>
          </div>`;
    }).join('');

    productsPage.scrollIntoView({ behavior: 'smooth' });
}

electronicsBtns.forEach(btn => {
    btn.addEventListener('click', electronicsColl);
});

async function getJewelryColl () {
    const res = await fetch(apiUrl);
    const data = await res.json()
    const jewelryFilter = data.filter(function(items) {
        return  items.category === `jewelery`
    })

    productsPage.innerHTML = jewelryFilter.map(items => {
        return `
          <div class="flex flex-col gap-3 md:w-56 w-40 shadow-lg rounded-md border border-gray-200">
            <div class="bg-gray-200 px-3 py-3 rounded-md">
                <img src="${items.image}" class="w-36 md:w-44 h-40" alt="">
            </div>
            <div class="w-[100%] flex flex-col gap-3 px-2 py-2">
                <div class="flex items-center justify-between">
                    <h1 class="text-[0.5rem] font-bold">${items.title}</h1>
                    <p class="font-semibold text-gray-800 text-[1.rem]">$<span>${items.price}</span></p>
                </div>
                <button class="text-white bg-[#00FF66] w-[100%] py-2 rounded-md border-none font-bold" onclick="displayCart(${items.id})">Add to Cart</button>
            </div>
          </div>`;
    }).join('');

    productsPage.scrollIntoView({ behavior: 'smooth' });
}

jewelryCollBtns.forEach(btn => {
    btn.addEventListener('click', getJewelryColl);
});
