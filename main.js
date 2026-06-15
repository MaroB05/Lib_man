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

const filter_criteria = new Book("","","","","","");

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
    console.log(editing);
    editingID = element.dataset.id;
    let book = Books.find((book)=> book.id == editingID);

    const node_index = Array.from(bookList.children).findIndex((div)=> div.id == editingID);
    nameInput.value = book.title;
    authorInput.value = book.author;
    genreInput.value = book.genre;
    rateInput.value = book.rate;
    pubDatefield.value = book.publication;

    bookList.children[node_index].style.backgroundColor = "#a33737";

    submitButton.innerText = "Save";
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

function update_list(){
    active_books = filter_list(Books, filter_criteria);
    render(active_books);
}


function match_criteria(book, filter_criteria){
    let flag = 0;
    if (filter_criteria.title == "" || book.title == filter_criteria.title)
        flag += 1;
    if (filter_criteria.author == "" || book.author == filter_criteria.author)
        flag += 1;
    if (filter_criteria.genre == "" || book.genre == filter_criteria.genre)
        flag += 1;
    if (filter_criteria.rate == "" || book.rate == filter_criteria.rate)
        flag += 1;
    if (filter_criteria.publication == "" || book.rate == filter_criteria.publication)
        flag += 1;
    return flag == 5;
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
        submitButton.innerText = "Add Book";
    } else{
        let b = new Book(
            nameInput.value,
            authorInput.value,
            genreInput.value,
            rateInput.value,
            pubDatefield.value
        )

        Books.push(b);
        if (match_criteria(b, filter_criteria)){
            let node = create_book_div(b);
            bookList.appendChild(node);
        }
    }

    clear_fields();
});

function filter_list(books, filter_criteria){
    return books.filter((element, index) => match_criteria(element, filter_criteria));
}

filterButton.addEventListener('click', function(){
    filter_criteria.title = nameInput.value;
    filter_criteria.author = authorInput.value;
    filter_criteria.genre = genreInput.value;
    filter_criteria.rate = rateInput.value;
    filter_criteria.publication = pubDatefield.value;

    active_books = filter_list(Books, filter_criteria);
    clear();
    render(active_books);
});


document.addEventListener('keydown', (event)=>{
    if (event.key == 'Escape' && editing){
        reset_edit();
    }
});