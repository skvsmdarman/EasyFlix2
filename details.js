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

  if (mediaType === 'movie') {
    watchNowButton.addEventListener('click', () => openVideo(details.id, 'movie'));
  } else if (mediaType === 'tv') {
    setupSeriesOptions(details.id);
    videoOptionsContainer.style.display = 'block';
    watchNowButton.addEventListener('click', () => openVideo(details.id, 'tv'));
  }
}

function openVideo(id, mediaType) {
  if (mediaType === 'movie') {
    videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/movie/${id}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
  } else if (mediaType === 'tv') {
    // Get selected season and episode
    const selectedSeason = seasonSelect.value;
    const selectedEpisode = episodeSelect.value;

    // Display the video based on the selected season and episode
    videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
   console.log('ID:', id, 'Selected Season:', selectedSeason, 'Selected Episode:', selectedEpisode);
  }
}

function updateVideo(id) {
  // Get selected season and episode
  const selectedSeason = seasonSelect.value;
  const selectedEpisode = episodeSelect.value;

  // Display the video based on the selected season and episode
  videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
 console.log('ID:', id, 'Selected Season:', selectedSeason, 'Selected Episode:', selectedEpisode);
}


function setupSeriesOptions(tvDetails) {
  // Get the list of regular seasons (exclude specials)
  const regularSeasons = tvDetails.seasons.filter(season => season.season_number !== 0);

  // Populate the season dropdown
  regularSeasons.forEach(season => {
    const option = document.createElement('option');
    option.value = season.season_number;
    option.textContent = `Season ${season.season_number}`;
    seasonSelect.appendChild(option);
  });

  // Handle the change event on the season dropdown
  seasonSelect.addEventListener('change', () => {
    const selectedSeason = parseInt(seasonSelect.value, 10);

    // Find the selected season
    const selectedSeasonDetails = regularSeasons.find(season => season.season_number === selectedSeason);

    // Clear existing episodes
    episodeSelect.innerHTML = '';

    // Populate the episode dropdown based on the number of episodes in the selected season
    if (selectedSeasonDetails) {
      for (let i = 1; i <= selectedSeasonDetails.episode_count; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Episode ${i}`;
        episodeSelect.appendChild(option);
      }
    }
  });

  // Trigger the change event to populate the episode dropdown for the initial season
  seasonSelect.dispatchEvent(new Event('change'));
}

function goHome() {
  window.location.href = 'index.html';
}
