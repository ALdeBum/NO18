document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('movieTitle').value;
    const type = document.getElementById('movieType').value;
    searchMovies(title, type, 1); // Изначально начнем с первой страницы
});

const apiKey = 'ad5e955b'; // Твой ключ API
const moviesContainer = document.getElementById('movies');
const paginationContainer = document.getElementById('pagination');
const maxPagesToShow = 5; // Количество страниц, отображаемых одновременно

// Функция для поиска фильмов
function searchMovies(title, type, page) {
    const url = `http://www.omdbapi.com/?s=${encodeURIComponent(title)}&type=${type}&page=${page}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displayMovies(data.Search);
                setupPagination(Math.ceil(data.totalResults / 10), title, type, page);
            } else {
                moviesContainer.innerHTML = `<p>${data.Error}</p>`;
                paginationContainer.innerHTML = ''; // Сброс пагинации
            }
        })
        .catch(error => {
            console.error('Error:', error);
            moviesContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
        });
}

// Функция отображения фильмов
function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/100'}" alt="${movie.Title}">
            <div class="movie-info">
                <h2>${movie.Title} (${movie.Year})</h2>
                <button onclick="showMovieDetails('${movie.imdbID}')">Details</button>
            </div>
        `;
        moviesContainer.appendChild(movieElement);
    });
}

// Функция показа деталей фильма
function showMovieDetails(id) {
    const url = `http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(movie => {
            alert(`
                Title: ${movie.Title}
                Year: ${movie.Year}
                Genre: ${movie.Genre}
                Plot: ${movie.Plot}
            `);
        })
        .catch(error => console.error('Error:', error));
}

// Функция настройки пагинации
function setupPagination(totalPages, title, type, currentPage) {
    paginationContainer.innerHTML = '';

    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Кнопка "Предыдущая"
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => searchMovies(title, type, currentPage - 1);
        paginationContainer.appendChild(prevButton);
    }

    // Отображение страниц
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => searchMovies(title, type, i);
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        paginationContainer.appendChild(pageButton);
    }

    // Кнопка "Следующая"
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => searchMovies(title, type, currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
}
