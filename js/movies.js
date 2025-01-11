const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8'; // ключ для TMDB API
const BASE_URL = 'https://api.themoviedb.org/3'; // базовый URL
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY; // URL для получения популярных фильмов
const IMG_URL = 'https://image.tmdb.org/t/p/w500'; // URL для получения постеров фильмов
const searchURL = BASE_URL + '/search/movie?'+API_KEY; // URL для поиска фильмов по названию

const homeButton = document.querySelector('.home-btn');

homeButton.addEventListener('click', () => {
    // Очистить поле поиска
    search.value = '';
    // Очистить выбранные жанры
    selectedGenre = [];
    setGenre();
    // Вернуться на главную страницу или перезагрузить текущие данные
    getMovies(API_URL);
});


// Список жанров для фильтрации фильмов
const genres = [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
];

// DOM элементы для взаимодействия с интерфейсом
const main = document.getElementById('main'); // Глав.контейнер для отображения фильмов
const form = document.getElementById('form'); // Форма поиска
const search = document.getElementById('search'); // Поле ввода для поиска
const tagsEl = document.getElementById('tags'); // Контейнер для жанров

// Элементы для перелистывания страницы
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

// состояние страницы во время перелистывания и выбранных жанров
var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;
var selectedGenre = [];

// отображение доступных жанров
setGenre();

// Функция для настройки жанров и добавления обработчиков событий на них
function setGenre() {
    tagsEl.innerHTML= ''; // Очистка предыдущих жанров
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            // Переключение выбранных жанров
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id);
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre = selectedGenre.filter(id => id !== genre.id); // Убираем жанр, если он уже выбран
                } else {
                    selectedGenre.push(genre.id); // Добавляем жанр, если он не выбран
                }
            }
            console.log(selectedGenre);
            // Получаем фильмы по выбранным жанрам
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')));
            highlightSelection();
        });
        tagsEl.append(t);
    });
}

// Функция для подсветки выбранных жанров
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight'); // Убираем подсветку с всех жанров
    });
    clearBtn();
    if (selectedGenre.length != 0) {   
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight'); // Подсвечиваем выбранные жанры
        });
    }
}

// Функция для добавления кнопки "Очистить" для сброса выбранных жанров
function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.classList.add('highlight');
    } else {
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = []; // Сбрасываем выбранные жанры
            setGenre(); // Обновляем список жанров
            getMovies(API_URL); // Получаем все фильмы заново
        });
        tagsEl.append(clear);
    }
}

// Получение фильмов при загрузке страницы
getMovies(API_URL);

// Функция для отображения фильмов по URL
function getMovies(url) {
    lastUrl = url; // Сохраняем текущий URL для перелистывания страницы
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        if (data.results.length !== 0) {
            showMovies(data.results); // Отображаем фильмы
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage; // Отображаем текущую страницу

            // Включаем или отключаем кнопки перелистывания страницы в зависимости от текущей страницы
            if (currentPage <= 1) {
                prev.classList.add('disabled');
                next.classList.remove('disabled');
            } else if (currentPage >= totalPages) {
                prev.classList.remove('disabled');
                next.classList.add('disabled');
            } else {
                prev.classList.remove('disabled');
                next.classList.remove('disabled');
            }

            tagsEl.scrollIntoView({ behavior: 'smooth' });

        } else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`; // Отображаем сообщение, если нет результатов
        }
    });
}

// Функция для отображения фильмов на странице
function showMovies(data) {
    main.innerHTML = ''; // Очищаем текущий список фильмов

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/>
                <button class="know-more" id="${id}">Know More</button>
            </div>
        `;

        main.appendChild(movieEl);

        // Добавляем обработчик для кнопки "Подробнее", чтобы открыть доп окно
        document.getElementById(id).addEventListener('click', () => {
            console.log(id);
            openNav(movie); // Открываем доп окно
        });
    });
}

// Функция для открытия доп окна с описанием фильма
const overlayContent = document.getElementById('overlay-content');
function openNav(movie) {
    let id = movie.id;
    fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
        console.log(videoData);
        if (videoData) {
            document.getElementById("myNav").style.width = "100%"; // Открываем доп окно
            if (videoData.results.length > 0) {
                var embed = [];
                var dots = [];
                videoData.results.forEach((video, idx) => {
                    let { name, key, site } = video;

                    if (site == 'YouTube') {
                        embed.push(`
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        `);

                        dots.push(`
                            <span class="dot">${idx + 1}</span>
                        `);
                    }
                });

                var content = `
                <h1 class="no-results">${movie.original_title}</h1>
                <br/>
                ${embed.join('')}
                <br/>
                <div class="dots">${dots.join('')}</div>
                `;
                overlayContent.innerHTML = content;
                activeSlide = 0; // начальное значение текущего трейлера в слайдере
                showVideos(); // Отображаем первый трейлер
            } else {
                overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`; // Отображаем сообщение, если видео не найдены
            }
        }
    });
}

// Функция для закрытия доп окна
function closeNav() {
    document.getElementById("myNav").style.width = "0%"; // Закрываем доп окно
}

var activeSlide = 0;
var totalVideos = 0;

// Функция для отображения видео в доп окне
function showVideos() {
    let embedClasses = document.querySelectorAll('.embed');
    let dots = document.querySelectorAll('.dot');

    totalVideos = embedClasses.length;
    embedClasses.forEach((embedTag, idx) => {
        if (activeSlide == idx) {
            embedTag.classList.add('show');
            embedTag.classList.remove('hide');
        } else {
            embedTag.classList.add('hide');
            embedTag.classList.remove('show');
        }
    });

    dots.forEach((dot, indx) => {
        if (activeSlide == indx) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Функция для обработки клика на стрелку влево в доп окне
const leftArrow = document.getElementById('left-arrow');
leftArrow.addEventListener('click', () => {
    if (activeSlide > 0) {
        activeSlide--;
    } else {
        activeSlide = totalVideos - 1; //переход к последнему трейлеру при клике на стрелку влево при первом видео
    }

    showVideos();
});

// Функция для обработки клика на стрелку вправо в доп окне
const rightArrow = document.getElementById('right-arrow');
rightArrow.addEventListener('click', () => {
    if (activeSlide < (totalVideos - 1)) {
        activeSlide++;
    } else {
        activeSlide = 0; // переход к первому трейлеру при клике на стрелку вправо при последнем видео
    }

    showVideos();
});

// Функция для определения цвета рейтинга фильма
function getColor(vote) {
    if (vote >= 8) {
        return 'green'; // Высокий рейтинг
    } else if (vote >= 5) {
        return "orange"; // Средний рейтинг
    } else {
        return 'red'; // Низкий рейтинг
    }
}

// Функция для обработки отправки формы поиска
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value; // Получаем текст для поиска
    selectedGenre = []; // Сбрасываем выбранные жанры
    setGenre(); // Обновляем список жанров
    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm); // Получаем фильмы по введенному запросу
    } else {
        getMovies(API_URL); // Получаем все фильмы
    }
});
