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
      displayDetails(data, mediaType);
    })
    .catch(error => {
      console.error('Error fetching details:', error);
      detailsContainer.innerHTML = '<p>Error fetching details</p>';
    });
}

function displayDetails(details, mediaType) {
  const genres = details.genres ? details.genres.map(genre => genre.name).join(', ') : '';

  detailsContainer.innerHTML = `
    <div style="text-align: center;">
      <img src="https://image.tmdb.org/t/p/w300${details.poster_path}" alt="${details.title || details.name}">
    </div>
    <h2>${details.title || details.name}</h2>
    <p>Type: ${mediaType}</p>
    <p>${details.overview}</p>
    <p>Release Date: ${details.release_date || details.first_air_date}</p>
    <p>Rating: ${details.vote_average}</p>
    <p>Genres: ${genres}</p>
    <p>Language: ${details.original_language}</p>
    <button onclick="watchNow('${details.title || details.name}')">Watch Now</button>
  `;
}

function goHome() {
  window.location.href = 'index.html';
}
