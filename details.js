const apiKey = 'ec98dcc4e185de0a0b10683fcc3b21f3';
const detailsContainer = document.getElementById('details');

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const mediaType = params.get('mediaType');
  
  if (id && mediaType) {
    showDetails(id, mediaType);
  } else {
    // Handle invalid or missing parameters
    detailsContainer.innerHTML = '<p>Invalid request</p>';
  }
});

function showDetails(id, mediaType) {
  const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}`;

  fetch(detailsUrl)
    .then(response => response.json())
    .then(data => {
      displayDetails(data);
    })
    .catch(error => {
      console.error('Error fetching details:', error);
      detailsContainer.innerHTML = '<p>Error fetching details</p>';
    });
}

function displayDetails(details) {
  const genres = details.genres ? details.genres.map(genre => genre.name).join(', ') : '';
  const type = details.media_type === 'movie' ? 'Movie' : 'TV Series';

  detailsContainer.innerHTML = `
    <h2>${details.title || details.name}</h2>
    <p>Type: ${type}</p>
    <p>${details.overview}</p>
    <p>Release Date: ${getYearRange(details)}</p>
    <p>Rating: ${details.vote_average}</p>
    <p>Genres: ${genres}</p>
    <p>Language: ${details.original_language}</p>
    <button onclick="watchNow('${details.title || details.name}')">Watch Now</button>
  `;
}

function getYearRange(details) {
  if (details.media_type === 'tv' && details.first_air_date && details.last_air_date) {
    return `${new Date(details.first_air_date).getFullYear()}-${new Date(details.last_air_date).getFullYear()}`;
  } else {
    return details.release_date ? new Date(details.release_date).getFullYear() : '';
  }
}

function goHome() {
  window.location.href = 'index.html';
}
