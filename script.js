const apiKey = '29916ed7';
// http://www.omdbapi.com/?i=tt3896198&apikey=29916ed7
const URL = `http://www.omdbapi.com/?i=tt3896198&apikey=29916ed7`;
const imgURL = 'https://image.tmdb.org/t/p/w1280';
const searchURL = `http://www.omdbapi.com/?apikey=29916ed7&s=`;
const form = document.getElementById('search-form');
const moreLoader = document.getElementById('loader');
const query = document.getElementById('query');
const root = document.getElementById('root');
let prevQuery = '';
let movies = [],
  page = 1,
  inSearchPage = false;

// Fetch json data from URL
async function fetchData(URL) {
  try {
    const data = await fetch(URL).then((res) => res.json());
    // console.log(data, 'response');
    return data;
  } catch (error) {
    console.log(error.message, 'error');
    root.innerHTML = '<h5>Something went wrong!</h5>';
    moreLoader.classList.remove('lds-roller');
    return null;
  }
}

// fetch movie details
async function fetchMovie(title) {
  try {
    const data = await fetch(URL + '&t=' + title).then((res) => res.json());
    console.log(data, 'response');
    return data;
  } catch (error) {
    console.log(error.message, 'error');
    root.innerHTML = '<h5>Something went wrong!</h5>';
    return null;
  }
}

const fetchAndShowResults = async (URL) => {
  const { Search } = await fetchData(URL);

  if (movies.length >= 10) {
    Search.map((movie) => movies.push(movie));
  } else {
    movies = Search;
  }
  console.log(movies);
  Search && showResults();
};

const getSpecificPage = (page) => {
  const URL = searchURL + prevQuery + `&page=${page}`;
  // console.log(URL);
  fetchAndShowResults(URL);
};

const movieCard = ({ Poster, Title, Type, Year, imdbID }) =>
  `<div class="col">
          <div class="card">
            <a class="card-media" href="./img-01.jpeg">
              <img src="${Poster}" alt="PUBG Mobile" width="100%" />
            </a>

            <div class="card-content">
              <div class="card-cont-header">
                <div class="cont-left">
                  <h3 style="font-weight: 600">${Title}</h3>
                  <span style="color: #12efec">${Year}</span>
                </div>
                <div class="cont-right">
              
                </div>
              </div>

              <div class="describe">
               <div class="movie-details">
               <p> ${Type}</p>
               <button id="myBtn" class="btn btn-more" onclick="showModal('${Title}')">View Details</button>
               </div>
              </div>
            </div>
          </div>
        </div>`;

const showResults = () => {
  let content = !inSearchPage ? root.innerHTML : '';
  if (movies && movies.length > 0) {
    moreLoader.classList.remove('lds-roller');
    movies.map((movie) => {
      let { Poster, Title, Type, Year, imdbID } = movie;

      const movieItem = {
        Poster,
        Title,
        Type,
        Year,
        imdbID,
      };

      content += movieCard(movieItem);
    });
  } else {
    content += '<h5>Something went wrong!</h5>';
  }

  root.innerHTML = content; // Inject content to root
};

const handleLoadMore = () => {
  getSpecificPage(++page);
};

const detectEndAndLoadMore = (e) => {
  let el = document.documentElement;
  //   Checking scroll height and the view height are the same to makes an api call.
  // console.log(el.scrollTop);
  if (
    inSearchPage &&
    (parseFloat(el.scrollTop + el.clientHeight).toFixed(0) == el.scrollHeight
      ? parseFloat(el.scrollTop + el.clientHeight).toFixed(0) == el.scrollHeight
      : Number(parseFloat(el.scrollTop + el.clientHeight).toFixed(0)) + 1 ==
        el.scrollHeight)
  ) {
    // console.log('Bingo!');
    // inSearchPage = false;
    moreLoader.classList.add('lds-roller');
    handleLoadMore();
  }
};

form.addEventListener('submit', async (e) => {
  let el = document.documentElement;
  inSearchPage = true;
  e.preventDefault();
  prevQuery = query.value;
  el.scrollTop = 0;
  page = 1;
  movies = [];
  if (query.value) {
    root.innerHTML = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    const searchTerm = query.value;
    searchTerm && fetchAndShowResults(searchURL + searchTerm);
    query.value = '';
  } else {
    root.innerHTML = '<h2>Enter a movie title!</h2>';
  }
});

window.addEventListener('scroll', detectEndAndLoadMore);

// function init() {
//   inSearchPage = false;
//   fetchAndShowResults(URL);
// }

// init();

// Modal

async function showModal(title) {
  let modal = document.getElementById('myModal');
  let bodyContainer = document.getElementById('body-container');
  bodyContainer.innerHTML = `<div class="spinner-cover"><div class="movie-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`;

  // When the user clicks on the button, open the modal
  modal.style.display = 'block';
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName('close')[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = 'none';
  };
  const data = await fetchMovie(title);
  if (data) {
    bodyContainer.innerHTML = modalContent(data);
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

// individual movie

// Modal Content

const modalContent = (data) =>
  `<div class="modal-body">
  <div class="movie-details1">
      <div class="image-container">
      <img src="${data.Poster}" alt="movie poster">
    </div>
    <div class="sub-details">
<h2> ${data.Title}</h2>
<p><b>Actors:</b> ${data.Actors}</p>
<p> <b>Director:</b> ${data.Director} </p>
<p><b>Writer:</b> ${data.Writer}</p>
<p><b>Released:</b> ${data.Released}</p>
<p><b>Website:</b> ${data.Website}</p>
<p><b>Type:</b> ${data.Type}</p>
<p><b>Runtime:</b> ${data.Runtime}</p>
<p><b>Rated:</b> ${data.Rated}</p>
<p><b>Production:</b> ${data.Production}</p>
<p><b>Metascore:</b> ${data.Metascore}</p>
<p><b>Language:</b> ${data.Language}</p>

    </div>
  </div>
  <div class="movie-details2">
    <p><b>Plot:</b> ${data.Plot}</p>
<p><b>Genre:</b> ${data.Genre}</p>
<p><b>Country:</b> ${data.Country}</p>
<p><b>BoxOffice:</b> ${data.BoxOffice}</p>
<p><b>imdbRating:</b> ${data.imdbRating}</p>
<p><b>imdbVotes:</b> ${data.imdbVotes}</p>
<p><b>Awards:</b> ${data.Awards}</p>
<p><b>Ratings:</b></p>
<ul>
 ${data.Ratings.map((rating) => `<li>${rating.Source} - ${rating.Value}</li>`)}
</ul>
  </div>
   </div>
  `;
