const form = document.querySelector('form');
const nameInput = document.getElementById('title');
const authorInput = document.getElementById('author')
const genreInput = document.getElementById('genre')
const rateInput = document.getElementById('rating')
const pubDatefield = document.getElementById('publicationDate')
const filterButton = document.getElementById("applyFilterButton")
const showAll = document.getElementById("render")
const clearButton = document.getElementById("clear")
const submitButton = document.getElementById("submitbtn");
const sortTitleBtn = document.getElementById("sortTitleButton");
const sortDateBtn = document.getElementById("sortDateButton");

const bookList = document.getElementById("bookList")

let Deleters = document.getElementsByClassName("Delete");
let Editors = document.getElementsByClassName("Edit");

var ID = 0;
var editing = false;
var editingID = -1;

const Books = []
var active_books = []

function Book(title, author, genre, rate, pub){
    this.id = ID;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.rate = rate;
    this.publication = pub
    ID += 1;
}


function del(element){
    let i = Books.findIndex((book)=>{
        return book.id == element.dataset.id;
    });
    console.log("Delete");
    Books.splice(i,1);
    active_books = [...Books];
    clear();
    render(Books);
}

function reset_edit(){
    clear_fields();
    let i = Books.findIndex((book) => book.id == editingID);
    let child_index = Array.from(bookList.children).findIndex((div)=>div.id == editingID);
    let node = create_book_div(Books[i]);

    bookList.replaceChild(node, bookList.children[child_index]);
    editing = false;
    editingID = -1;
    submitButton.innerText = "Add Book";
}

function edit(element){
    if (editingID > -1)
        reset_edit();

    editing = true;
    // editing = !editing;
    console.log(editing);
    if (editing){
        editingID = element.dataset.id;
        let book = Books.find((book)=> book.id == editingID);

        // const editing_template = `
        //     <input value="${book.title}" type="text" class="titletxt" name="Title">
        //     <b>Author:</b> <input value="${book.author}" type="text" class="authortxt" name="Author"> <br>
        //     <b>Genre:</b> <input value="${book.genre}" type="text" class="genretxt" name="Genre"> <br>
        //     <b>Rate:</b> <input value="${book.rate}" class="rating" type="number" min="0" max="5" step="0.1" placeholder="0 to 5"> <br>
        //     <button type="button" class="Delete" data-id="${book.id}">Delete</button>
        //     <button type="button" class="Edit" data-id="${book.id}">Edit</button>
        // `

        const node_index = Array.from(bookList.children).findIndex((div)=> div.id == editingID);
        // bookList.children[node_index].innerHTML = editing_template;
        
        // const editBtn = bookList.children[node_index].getElementsByClassName("Edit")[0];
        // editBtn.innerText = "Save";
        // editBtn.style.backgroundColor = "#8b5e34" ;
        // editBtn.style.color = "white";
        // editBtn.addEventListener('click', ()=>edit(editBtn));

        // const delBtn = bookList.children[node_index].getElementsByClassName("Delete")[0];
        // delBtn.addEventListener('click', ()=>del(delBtn));

        nameInput.value = book.title;
        authorInput.value = book.author;
        genreInput.value = book.genre;
        rateInput.value = book.rate;
        pubDatefield.value = book.publication;

        bookList.children[node_index].style.backgroundColor = "#a33737";

        submitButton.innerText = "Save";

    }
    // } else {

    //     console.log("saving!");
    //     let i = Books.findIndex((book) => book.id == editingID);
    //     let child_index = Array.from(bookList.children).findIndex((div)=>div.id == editingID);
    //     let node = bookList.children[child_index];
    //     console.log(i);

    //     Books[i].title = node.getElementsByClassName("titletxt")[0].value;
    //     Books[i].author = node.getElementsByClassName("authortxt")[0].value;
    //     Books[i].genre = node.getElementsByClassName("genretxt")[0].value;
    //     Books[i].rate = node.getElementsByClassName("rating")[0].value;
    //     Books[i].publication = pubDatefield.value;

    //     const Book_card = `
    //         <h3>${Books[i].title}</h3>
    //         <b>Author:</b> ${Books[i].author}<br>
    //         <b>Genre:</b> ${Books[i].genre}<br>
    //         <b>Rate:</b> ${Books[i].rate}<br>
    //         <button type="button" class="Delete" data-id="${Books[i].id}">Delete</button>
    //         <button type="button" class="Edit" data-id="${Books[i].id}">Edit</button>
    //     `
    //     node.innerHTML = Book_card;
    //     bookList.replaceChild(node, bookList.children[child_index]);
    //     editing = false;
    // }
}

function clear(){
    bookList.innerHTML = ""
}

function clear_fields(){
    nameInput.value = "";
    authorInput.value = "";
    genreInput.value = "";
    rateInput.value = "";
    pubDatefield.value = "";
}

function sortby(books, field){
    books.sort((a,b)=>{
        console.log(b[field] > a[field]);
        if (a[field] > b[field]){
            return 1;
        } else if (a[field] < b[field]){
            return -1;
        } else {
            return 0;
        }
    });

    clear();
    render(books);
}

function create_book_div(b){
    const Book_card = `
        <h3>${b.title}</h3>
        <b>Author:</b> ${b.author}<br>
        <b>Genre:</b> ${b.genre}<br>
        <b>Rate:</b> ${b.rate}<br>
        <button type="button" class="Delete" data-id="${b.id}">Delete</button>
        <button type="button" class="Edit" data-id="${b.id}">Edit</button>
    `

    const node = document.createElement("div");
    node.id = b.id;
    node.className = "book";
    node.innerHTML = Book_card;

    let newDelBtn = node.getElementsByClassName("Delete")[0];
    newDelBtn.addEventListener('click', ()=>{del(newDelBtn);});
    let newEditBtn = node.getElementsByClassName("Edit")[0];
    newEditBtn.addEventListener('click', ()=>{edit(newEditBtn);});
    return node;
}


function render(books){
    for (const book of books){
        let node = create_book_div(book);
        bookList.appendChild(node);
    }
}

showAll.addEventListener('click', () => {
    active_books = [...Books];
    clear();
    render(Books);
});

clearButton.addEventListener('click', clear);

sortTitleBtn.addEventListener("click", ()=>{
    sortby(active_books, "title");
});

sortDateBtn.addEventListener("click", ()=>{
    sortby(active_books, "publication");
});

form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    if (editing){
        let i = Books.findIndex((book) => book.id == editingID);
        let child_index = Array.from(bookList.children).findIndex((div)=>div.id == editingID);

        Books[i].title = nameInput.value;
        Books[i].author = authorInput.value;
        Books[i].genre = genreInput.value;
        Books[i].rate = rateInput.value;
        Books[i].publication = pubDatefield.value;
        let node = create_book_div(Books[i]);

        bookList.replaceChild(node, bookList.children[child_index]);
        editing = false;
        editingID = -1;
    } else{
        let b = new Book(
            nameInput.value,
            authorInput.value,
            genreInput.value,
            rateInput.value,
            pubDatefield.value
        )

        Books.push(b);
        let node = create_book_div(b);
        bookList.appendChild(node);

    }

    clear_fields();
});


filterButton.addEventListener('click', function(){
    active_books = Books.filter((element, index, arr) => {
        let flag = 0;
        if (nameInput.value == "" || element.title == nameInput.value)
            flag += 1;
        if (authorInput.value == "" || element.author == authorInput.value)
            flag += 1;
        if (genreInput.value == "" || element.genre == genreInput.value)
            flag += 1;
        if (rateInput.value == "" || element.rate == rateInput.value)
            flag += 1;

        return flag == 4;
    });
    clear();
    render(active_books);
});


document.addEventListener('keydown', (event)=>{
    if (event.key == 'Escape' && editing){
        reset_edit();
    }
});