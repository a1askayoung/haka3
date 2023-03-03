const API = "http://localhost:8000/product";
const API2 = "http://localhost:8000/comments";

//? блок куда мы добавляем карточки
const list = document.querySelector("#product-list");
const modal = document.querySelector(".modal");
const authorizationModal = document.querySelector(".modal2");

//? форма с инпутами для ввода данных
const addForm = document.querySelector("#add-form");
const imageInp = document.querySelector("#image");
const nameInp = document.querySelector("#name");
const descInp = document.querySelector("#desc");
const priceInp = document.querySelector("#price");

// ? инпуты и кнопка из модалки
const editNameInp = document.querySelector("#edit-name");
const editPriceInp = document.querySelector("#edit-price");
const editDescriptionInp = document.querySelector("#edit-descr");
const editImageInp = document.querySelector("#edit-image");
const editSaveBtn = document.querySelector("#btn-save-edit");
const editCloseBtn = document.querySelector(".close-btn");
const closeModal = document.querySelector(".btn-close");
//
const adminPanel = document.querySelector(".admin-panel");
const btns = document.querySelector(".btns");
//
const closeAuthorization = document.querySelector(".btn-close2");
const loginBtn = document.querySelector("#btn-login");
const passInp = document.querySelector("#pass");
const logInp = document.querySelector("#login");
const sendPass = document.querySelector("#btn-send-pass");

//
const paginationList = document.querySelector(".pagination-list");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
//
const commentList = document.querySelector(".comment-list");
const addCommentary = document.querySelector(".send-comment");
const commInput = document.querySelector(".add-comment");

// ? инпут для поиска
const search = document.querySelector(".search");
const searchBtn = document.querySelector("#btn-search");
let searchVal = "";
const limit = 409;
let currentPage = 1;
let totalPages = 1;

// ? первоначальное отображение данных
getProducts();
getComment();

// функция для получения всех данных
async function getProducts() {
  const res = await fetch(
    `${API}?name_like=${searchVal}&_limit=${limit}&_page=${currentPage}`
  );
  const count = res.headers.get("x-total-count");
  totalPages = Math.ceil(count / limit);

  const data = await res.json();
  //   list.style.display = "flex";
  render(data);
}

// функция для добавления в db json
async function addProduct(product) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getProducts();
}

// функция для получения одного продукта
async function getOneProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();

  return data;
}

// функция для изменения продукта
async function editProducts(id, editedProduct) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getProducts();
}

// удаление
async function deleteProduct(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  getProducts();
}

// ? функия для отображения
function render(arr) {
  list.innerHTML = "";
  arr.forEach((item) => {
    list.innerHTML += `<div class="product-card">
    <img src="${item.image}" />
    <div class="product-info">
        <div class="product-text">
            <h3>${item.name}</h3>
            <p class="description">${item.description.slice(0, 35)}...</p>
            <p class="price" >$ ${item.price}</p>
        </div>
        <div class="comments"><p class="comm" id="${item.comments}"></p></div>
        <div class="btns">
            <button id="${item.id}" class="btn btn-edit">EDIT</button>
            <button id="${
              item.id
            }" class="btn btn-delete delete-btn">DELETE</button>
        </div>
    </div>
  </div>`;
  });
  renderPagination();
}

function renderPagination() {
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
        <li class="page-item"><a class="page-link page-number ${(currentPage = i
          ? "active"
          : "")}" href="#">${i}</a></li>`;
  }

  if (currentPage == 1) {
    prev.classList.add("disabled");
  } else {
    prev.classList.remove("disable");
  }
  if (currentPage == totalPages) {
    next.classList.add("disabled");
  } else {
    next.classList.remove("disabled");
  }
}

search.addEventListener("input", () => {
  searchVal = search.value;
  getProducts();
});

searchBtn.addEventListener("click", () => {
  scroll;
});

// ? Create обработчик события для добавления
addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    !nameInp.value.trim() ||
    !descInp.value.trim() ||
    !priceInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }

  const product = {
    image: imageInp.value,
    name: nameInp.value,
    description: descInp.value,
    price: priceInp.value,
  };

  addProduct(product);

  imageInp.value = "";
  nameInp.value = "";
  descInp.value = "";
  priceInp.value = "";
});

let id = null;

// обработчик события для EDIT

// обработчик события для Save
editSaveBtn.addEventListener("click", () => {
  if (
    !editImageInp.value.trim() ||
    !editDescriptionInp.value.trim() ||
    !editNameInp.value.trim() ||
    !editPriceInp.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }

  const editedProduct = {
    image: editImageInp.value,
    name: editNameInp.value,
    description: editDescriptionInp.value,
    price: editPriceInp.value,
  };

  editProducts(id, editedProduct);
  modal.style.visibility = "hidden";
});

// обработчик события для CLOSE
closeModal.addEventListener("click", () => {
  modal.style.visibility = "hidden";
});

editCloseBtn.addEventListener("click", () => {
  modal.style.visibility = "hidden";
});

// обработчик события для DELETE
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    alert("only admin can delete products");
  }
});
// обработчик события для авторизации

loginBtn.addEventListener("click", () => {
  authorizationModal.style.visibility = "visible";
});

closeAuthorization.addEventListener("click", () => {
  authorizationModal.style.visibility = "hidden";
});

// админ функции
sendPass.addEventListener("click", () => {
  if (logInp.value == "Nyhai" && passInp.value == "Bebru") {
    authorizationModal.style.visibility = "hidden";
    adminPanel.style.display = "flex";
    alert("Welcome!");
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        deleteProduct(e.target.id);
      }
      document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("btn-edit")) {
          id = e.target.id;
          modal.style.visibility = "visible";
          const product = await getOneProduct(e.target.id);

          modal.style.visibility = "visible";
          editImageInp.value = product.image;
          editNameInp.value = product.name;
          editDescriptionInp.value = product.desc;
          editPriceInp.value = product.price;
        }
      });
    });
  } else {
    authorizationModal.style.visibility = "hidden";
    alert("You're not a admin");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-number")) {
    currentPage = e.target.innerText;
    getActors();
  }
});

//

async function getComment() {
  const res2 = await fetch(`${API2}`);
  const data2 = await res2.json();
  renderComments(data2);
}

async function addComment(comments) {
  await fetch(API2, {
    method: "POST",
    body: JSON.stringify(comments),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getComment();
}

function renderComments(arr2) {
  commentList.innerHTML = "";
  arr2.forEach((item) => {
    commentList.innerHTML += `<div class="comm-content">
      <div class="author">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/1024px-Faenza-avatar-default-symbolic.svg.png"
          alt=""
        />
      </div>
      <div class="comm-text">
        <p>${item.commentary}</p>
      </div>
      <div class="likes">
      
      </div>
    </div>`;
  });
}

addCommentary.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!commInput.value.trim()) {
    alert("Заполните все поля");
    return;
  }

  const comments = {
    commentary: commInput.value,
    like: 0,
    dislike: 0,
  };

  addComment(comments);

  commInput.value = "";
});

async function editComment(id, editedComment) {
  await fetch(`${API2}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedComment),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getComment();
}

async function getOneComment(id) {
  const res2 = await fetch(`${API2}/${id}`);
  const data2 = await res2.json();
  return data2;
}

let id2 = null;

document.addEventListener("click", async (e) => {
  e.target.classList.contains("like");
  id2 = e.target.id;
  const comment = await getOneComment(e.target.id);
  console.log(comment);
  const editedComment = {
    // id: comment.id,
    commentary: comment.commentary,
    like: comment.like++,
    dislike: comment.dislike,
  };
});
