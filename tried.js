const apiKey = '29916ed7';
// http://www.omdbapi.com/?i=tt3896198&apikey=29916ed7
const URL = `http://www.omdbapi.com/?i=tt3896198&apikey=29916ed7`;
const imgURL = 'https://image.tmdb.org/t/p/w1280';
const searchURL = `http://www.omdbapi.com/?apikey=29916ed7&s=`;
const form = document.getElementById('search-form');
const query = document.getElementById('query');
const root = document.getElementById('root');
let prevQuery = '';

let movies = [],
  page = 1,
  inSearchPage = false;
let content = !inSearchPage ? root.innerHTML : '';

// Fetch json data from URL
async function fetchData(URL) {
  try {
    const data = await fetch(URL).then((res) => res.json());
    // console.log(data, 'response');
    return data;
  } catch (error) {
    console.log(error.message, 'error');
    return null;
  }
}

const fetchAndShowResults = async (URL) => {
  const { Search } = await fetchData(URL);
  movies = Search;
  Search && showResults(Search);
};

const getSpecificPage = (page) => {
  const URL = searchURL + prevQuery + `&page=${page}`;
  // console.log(URL);
  fetchAndShowResults(URL);
};

const movieCard = (movie) =>
  `<div class="col">
          <div class="card">
            <a class="card-media" href="./img-01.jpeg">
              <img src="${movie.Poster}" alt="PUBG Mobile" width="100%" />
            </a>

            <div class="card-content">
              <div class="card-cont-header">
                <div class="cont-left">
                  <h3 style="font-weight: 600">${movie.Title}</h3>
                  <span style="color: #12efec">${movie.Year}</span>
                </div>
                <div class="cont-right">
              
                </div>
              </div>

              <div class="describe">
               <div class="movie-details">
               <p> ${movie.Type}</p>
               <button class="btn btn-more">View Details</button>
               </div>
              </div>
            </div>
          </div>
        </div>`;

const showResults = (items) => {
  // movies = [];
  if (movies && movies.length > 0) {
    console.log(movies, 'movies');
    // query.value === prevQuery ? content : (content = '');
    movies.map((movie) => {
      let { Poster, Title, Type, Year, ImdbID } = movie;

      //   if (poster_path) {
      //     poster_path = imgURL + poster_path;
      //   } else {
      //     poster_path = './img-01.jpeg';
      //   }

      //   if (original_title.length > 15) {
      //     original_title = original_title.slice(0, 15) + '...';
      //   }

      //   if (!overview) {
      //     overview = 'No overview yet...';
      //   }

      //   if (!release_date) {
      //     release_date = 'No release date';
      //   }

      const movieItem = {
        Poster,
        Title,
        Type,
        Year,
        ImdbID,
      };

      content += movieCard(movieItem);
    });
  } else {
    content = '<p>Something went wrong!</p>';
  }

  root.innerHTML = content; // Inject content to root
};

const handleLoadMore = () => {
  getSpecificPage(++page);
};

const detectEndAndLoadMore = (e) => {
  let el = document.documentElement;
  //   Checking scroll height and the view height are the same to makes an api call.
  if (
    inSearchPage &&
    (parseFloat(el.scrollTop + el.clientHeight).toFixed(0) == el.scrollHeight
      ? parseFloat(el.scrollTop + el.clientHeight).toFixed(0) == el.scrollHeight
      : Number(parseFloat(el.scrollTop + el.clientHeight).toFixed(0)) + 1 ==
        el.scrollHeight)
  ) {
    inSearchPage = false;
    handleLoadMore();
  }
};
form.addEventListener('submit', async (e) => {
  inSearchPage = true;
  e.preventDefault();
  prevQuery = query.value;
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

function init() {
  inSearchPage = false;
  fetchAndShowResults(URL);
}

// init();
