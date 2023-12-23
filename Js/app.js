let currentPage = 1;
const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_URL =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=';
const API_URL_POPULAR = API_URL + currentPage;

const API_URL_SEARCH =
  'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';

const API_URL_MOVIE_DETAILS =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

let btn = document.querySelector('.btn');

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
  });

  const respData = await resp.json();

  showMovies(respData);
  const pagination = document.querySelector('.pagination');
  pagination.style.display = 'block';
  return respData.pagesCount;
}

getMovies(API_URL_POPULAR);

function showMovies(data) {
  const moviesEl = document.querySelector('.movies');

  document.querySelector('.movies').innerHTML = '';

  data.films.forEach((movie) => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
          <div class="movie__cover-inner">
          <img
            src="${movie.posterUrlPreview}"
            class="movie__cover"
            alt="${movie.nameRu}"
          />
          <div class="movie__cover--darkened"></div>
        </div>
        <div class="movie__info">
          <div class="movie__title">${movie.nameRu}</div>
          <div class="movie__category">${movie.genres.map(
            (genre) => ` ${genre.genre}`
          )}</div>

          ${
            movie.rating !== 'null' && movie.rating !== null
              ? `
          <div class="movie__average movie__average--${getClassByRate(
            movie.rating
          )}">
            ${movie.rating}</div>
          `
              : ''
          }
        </div>

          `;

    movieEl.addEventListener('click', () => openModal(movie.filmId));
    moviesEl.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote > 7) {
    return 'green';
  } else if (vote > 5) {
    return 'orange';
  } else if (vote > 0) {
    return 'red';
  } else {
    return 'blue';
  }
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = '';
  }
});
const modalEl = document.querySelector('.modal');

async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
  });

  const respData = await resp.json();

  modalEl.classList.add('modal--show');
  document.body.classList.add('stop-scrolling');
  modalEl.innerHTML = `
  <div class="modal__card">
  <h2>
  <span class="modal__movie-title">${respData.nameRu}</span>
  <span class="modal__movie-release-year"> (${respData.year})</span>
</h2>
<div class= "movie-editional"> 
        <img class="modal__movie-backdrop" src="${
          respData.posterUrlPreview
        }" alt=${respData.nameRu}>
        <div class= "movie-info"> 
       
        <ul class="modal__movie-info">
          <div class="loader"></div>
          <li class="modal__movie-genre">Жанр - ${respData.genres.map(
            (el) => `<span> ${el.genre} </span>`
          )}</li>
          ${
            respData.filmLength
              ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>`
              : ''
          }
          <li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${
    respData.webUrl
  }</a></li>
          <li class="modal__movie-overview">Описание - ${
            respData.description
          }</li>
        </ul>
        
      </div>
      </div>
      <button type="button" class="modal__button-close">Закрыть</button>
      </div>
  `;

  const btnClose = document.querySelector('.modal__button-close');
  btnClose.addEventListener('click', () => closeModal());
}
function closeModal() {
  modalEl.classList.remove('modal--show');
  document.body.classList.remove('stop-scrolling');
}

window.addEventListener('click', (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});

const element = document.querySelector('.pagination ul');
let page = 1;
let totalPages = 35;
// let totalPages = await getMovies(API_URL_POPULAR);
element.innerHTML = createPagination(totalPages, page);

function createPagination(totalPages, page) {
  let liTag = '';
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (page > 1) {
    //show the next button if the page value is greater than 1
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${
      page - 1
    })">Prev</li>`;
  }

  if (page > 2) {
    //if page value is less than 2 then add 1 after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>1</span></li>`;
    if (page > 3) {
      //if page value is greater than 3 then add this (...) after the first li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }

  // how many pages or li show before the current li
  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  // how many pages or li show after the current li
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      //if plength is greater than totalPage length then continue
      continue;
    }
    if (plength == 0) {
      //if plength is 0 than add +1 in plength value
      plength = plength + 1;
    }
    if (page == plength) {
      //if page is equal to plength than assign active string in the active variable
      active = 'active';
    } else {
      //else leave empty to the active variable
      active = '';
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${plength}</span></li>`;
  }

  if (page < totalPages - 1) {
    // if page value is less than totalPage value by -1 then show the last li or page
    if (page < totalPages - 2) {
      //if page value is less than totalPage value by -2 then add this (...) before the last li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    //show the next button if the page value is less than totalPage(20)
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${
      page + 1
    })"> Next</li`;
  }

  element.innerHTML = liTag; //add li tag inside ul tag
  getMovies(API_URL + page);
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  topFunction();
  return liTag; //reurn the li tag
}
