const apiKey = 'ec98dcc4e185de0a0b10683fcc3b21f3';
const videoBaseUrl = 'https://vidsrc.cc/v2/embed';
const detailsContainer = document.getElementById('details');
const watchNowButton = document.getElementById('watchNowButton');
var videoContainer = document.getElementById('videoContainer');

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    showMovieDetails(id);
  } else {
    detailsContainer.innerHTML = '<p>Invalid request</p>';
  }
});

function showMovieDetails(id) {
  const detailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;

  fetch(detailsUrl)
    .then(response => response.json())
    .then(data => {
      displayMovieDetails(data);
    })
    .catch(error => {
      console.error('Error fetching details:', error);
      detailsContainer.innerHTML = '<p>Error fetching details</p>';
    });
}

function displayMovieDetails(details) {
  const genres = details.genres ? details.genres.map(genre => genre.name).join(', ') : '';
  detailsContainer.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://image.tmdb.org/t/p/w300${details.poster_path}" alt="${details.title}" style="max-width: 100%;">
    </div>
    <h2 style="text-align: center; color: #3498db;">${details.title}</h2>
    <p><strong>Overview:</strong> ${details.overview}</p>
    <p><strong>Release Date:</strong> ${details.release_date}</p>
    <p><strong>Rating:</strong> ${details.vote_average}</p>
    <p><strong>Genres:</strong> ${genres}</p>
    <p><strong>Language:</strong> ${details.original_language}</p>
  `;
}

function openMovie() {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const aspectRatio = 16 / 9;
  const videoHeight = Math.min(screenWidth * (1 / aspectRatio), 400);

  videoContainer.innerHTML = `<iframe src="${videoBaseUrl}/movie/${params.get('id')}" width="100%" height="${videoHeight}px" frameborder="0" allowfullscreen></iframe>`;
}
