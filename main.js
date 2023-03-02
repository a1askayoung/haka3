const API='http://localhost:8000/product'

// ЛИСТ для карточек 
const list=document.querySelector('.list')

// ДЛЯ ДОБАВЛЕНИЯ
const addForm=document.querySelector('#add-form')
const imageInp=document.querySelector('#image')
const nameInp=document.querySelector('#name')
const descInp=document.querySelector('#desc')
const priceInp=document.querySelector('#price')

// MODAL
const modal=document.querySelector('.modal')
const modalImg=document.querySelector('.modal-img')
const modalName=document.querySelector('.modal-name')
const modalDesc=document.querySelector('.modal-desc')
const modalPrice=document.querySelector('.modal-price')
const save=document.querySelector('.save')
const close=document.querySelector('.close')

// SEARCH
const search=document.querySelector('.search')
let searchVal=''



getProducts()

// GET ALL PRODUCTS
async function getProducts(){
    const res=await fetch(`${API}?name_like=${searchVal}`);
    const data=await res.json();


    render(data)
}

// GET ONE PRODUCT
async function getOneProduct(id){
    const res=await fetch(`${API}/${id}`);
    const data=await res.json();
    return data;
}

// ADD
async function addProduct(product){
    await fetch(API, {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    getProducts();
}

// EDIT
async function editProducts(id, editedProduct){
    await fetch(`${API}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(editedProduct),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    getProducts();
}

async function deleteProduct(id){
    await fetch(`${API}/${id}`,{
        method: 'DELETE'
    })
    getProducts()
}

// RENDER
function render (arr){
    list.innerHTML=''
    arr.forEach(item =>{
        list.innerHTML+=
    `<div class="card-img">
    <img
      src="${item.image}"
      alt="Music Album Cover"
    />
  </div>
  <div class="card-body">
            <h5 class="card-name">${item.name}</h5>
            <p class="card-text">${item.desc.slice(0, 70)}...</p>
            <p class="card-text">$ ${item.price}</p>
            <button id="${item.id}" class="btn btn-danger btn-delete">DELETE</button>
            <button data-bs-toggle="modal" data-bs-target="#exampleModal" id="${
                item.id
            }" class="btn btn-dark btn-edit">EDIT</button>
        </div>
    <div class="card-rating">
      <input type="radio" id="star5" name="rating" value="5" />
      <label for="star5"></label>
      <input type="radio" id="star4" name="rating" value="4" />
      <label for="star4"></label>
      <input type="radio" id="star3" name="rating" value="3" />
      <label for="star3"></label>
      <input type="radio" id="star2" name="rating" value="2" />
      <label for="star2"></label>
      <input type="radio" id="star1" name="rating" value="1" />
      <label for="star1"></label>
    </div>
  </div>`
    })

}


// ADD
addForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    if(!imageInp.value.trim() ||
    !nameInp.value.trim() ||
    !descInp.value.trim() ||
    !priceInp.value.trim())
    {
        alert('Hello mathafucka?')
        return;
    }

    const product={
        image: imageInp.value,
        name: nameInp.value,
        desc: descInp.value,
        price: priceInp.value
    }

    addProduct(product)

    imageInp.value=''
    nameInp.value=''
    desc.value=''
    priceInp.value=''

})

// EDIT
let id=null;
document.addEventListener('click', async (e) => {
    if(e.target.classList.contains('btn-edit')){
        id=e.target.id;

        const product=await getOneProduct(e.target.id)

        modal.style.visibility='visible'
        modalImg.value=product.image;
        modalName.value=product.name;
        modalDesc.value=product.desc;
        modalPrice.value=product.price;
    }
})

// SAVE
save.addEventListener('click', ()=>{
    if (!modalImg.value.trim() ||
        !modalName.value.trim() ||
        !modalDesc.value.trim() ||
        !modalPrice.value.trim())
        {
            alert('hello mathaphuka')
            return
        }

    const editedProduct={
        image: modalImg.value,
        name: modalName.value,
        desc: modalDesc.value,
        price: modalPrice.value
    }

    editProducts(id, editedProduct)
    modal.style.visibility='hidden'
})

// CLOSE
close.addEventListener('click', ()=>{
    modal.style.visibility='hidden'
})

// DELETE
document.addEventListener('click', (e)=>{
    if(e.target.classList.contains('btn-delete')){
        deleteProduct(e.target.id)
    }
})

// SEARCH
search.addEventListener('input', ()=>{

    searchVal=search.value;
    getProducts()
})

// ANIMATED CURSOR
const coords={x:0,y:0}
const circles=document.querySelectorAll(".circle")


circles.forEach(function (circle, index){
    circle.x=0;
    circle.y=0;
})

window.addEventListener('mousemove', function(e){
    coords.x=e.clientX;
    coords.y=e.clientY;

})
function animateCircles(){

    let x=coords.x;
    let y=coords.y;

    circles.forEach(function(circle, index){
        circle.style.left=(x-12) + "px";
        circle.style.top=(y-12) + "px"

        circle.style.scale=(circles.length-index)/circles.length

        circle.x=x;
        circle.y=y;

        const nextCircle=circles[index+1] || circles[0];
        x+=(nextCircle.x - x)*0.3;
        y+=(nextCircle.y-y)*0.3;
    })

    requestAnimationFrame(animateCircles)
}

animateCircles();