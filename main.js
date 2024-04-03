document.addEventListener('DOMContentLoaded', function () {
    const inputBookForm = document.getElementById('inputBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    const deleteBookDialog = document.getElementById('deleteBookDialog');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');   

    const BOOKS_KEY = 'books';

    function getBooksFromStorage() {
        return JSON.parse(localStorage.getItem(BOOKS_KEY)) ||[]; 
    }

    function saveBooksToStorage(books) {
        localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    }

    function renderBooks() {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        const books = getBooksFromStorage();

        books.forEach(book => {
            const bookItem = document.createElement('article');
            bookItem.classList.add('book_item');
            const bookTitle = document.createElement('h3');
            bookTitle.innerText = book.title;
            const bookAuthor = document.createElement('p');
            bookAuthor.innerText = `Penulis: ${book.author}`;
            const bookYear = document.createElement('p');
            bookYear.innerText = `Tahun: ${book.year}`;
            const actionDiv = document.createElement('div');
            actionDiv.classList.add('action');

            const moveButton = document.createElement('button');
            moveButton.classList.add('green');
            moveButton.onclick = function () {
                moveBook(book.id, !book.isComplete);
            };
            moveButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('red');
            deleteButton.onclick = function () {
                removeBook(book.id);
            };
            deleteButton.innerText = 'Hapus buku';

            actionDiv.appendChild(moveButton);
            actionDiv.appendChild(deleteButton);

            bookItem.appendChild(bookTitle);
            bookItem.appendChild(bookAuthor);
            bookItem.appendChild(bookYear);
            bookItem.appendChild(actionDiv);

            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        });
    }

    function showDialog() {
        deleteBookDialog.style.display = 'block';
    }

    function hideDialog() {
        deleteBookDialog.style.display = 'none';
    }

    inputBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = parseInt(document.getElementById('inputBookYear').value);
        const isComplete = document.getElementById('inputBookIsComplete').checked;
        const id = +new Date();

        const newBook = {
            id,
            title,
            author,
            year,
            isComplete
        };

        const books = getBooksFromStorage();
        books.push(newBook);
        saveBooksToStorage(books);

        renderBooks();

        inputBookForm.reset();
    });

    window.moveBook = function (id, isComplete) {
        const books = getBooksFromStorage();
        const index = books.findIndex(book => book.id === id);
        books[index].isComplete = isComplete;
        saveBooksToStorage(books);
        renderBooks();
    }

    window.removeBook = function (id) {
        showDialog();

        confirmDeleteButton.onclick = function () {
            const books = getBooksFromStorage();
            const index = books.findIndex(book => book.id === id);
            books.splice(index, 1);
            saveBooksToStorage(books);
            renderBooks();
            hideDialog(); 
        }

        cancelDeleteButton.onclick = function () {
            hideDialog(); 
        }
    }

    renderBooks();
});
