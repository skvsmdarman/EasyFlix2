const apiKey = 'ec98dcc4e185de0a0b10683fcc3b21f3';
const detailsContainer = document.getElementById('details');
const watchNowButton = document.getElementById('watchNowButton');
const videoOptionsContainer = document.getElementById('videoOptions');
const seasonSelect = document.getElementById('seasonSelect');
const episodeSelect = document.getElementById('episodeSelect');
var videoContainer = document.getElementById('videoContainer');

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
  `;

  if (details.media_type === 'movie') {
    watchNowButton.addEventListener('click', () => openVideo(details.id, 'movie'));
  } else if (details.media_type === 'tv') {
    setupSeriesOptions(details.id);
    watchNowButton.addEventListener('click', () => toggleVideoOptions());
  }
}

function openVideo(id, mediaType) {
  if (mediaType === 'movie') {
    videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/movie/${id}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
  } else if (mediaType === 'tv') {
    const selectedSeason = seasonSelect.value;
    const selectedEpisode = episodeSelect.value;
    videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
  }
}

function setupSeriesOptions(tvId) {
  // Assuming you have information about the series (number of seasons, episodes, etc.)
  // Update the following code based on your data
  const numberOfSeasons = 5; // Replace with actual number of seasons
  const numberOfEpisodes = 10; // Replace with actual number of episodes per season

  for (let i = 1; i <= numberOfSeasons; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Season ${i}`;
    seasonSelect.appendChild(option);
  }

  for (let i = 1; i <= numberOfEpisodes; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Episode ${i}`;
    episodeSelect.appendChild(option);
  }
}

function toggleVideoOptions() {
  videoOptionsContainer.style.display = videoOptionsContainer.style.display === 'none' ? 'block' : 'none';
}

function goHome() {
  window.location.href = 'index.html';
}
