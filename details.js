const apiKey = 'ec98dcc4e185de0a0b10683fcc3b21f3';
const videoBaseUrl = 'https://vidsrc.cc/v2/embed';
const detailsContainer = document.getElementById('details');
const watchNowButton = document.getElementById('watchNowButton');
const videoOptionsContainer = document.getElementById('videoOptions');
const seasonSelect = document.getElementById('seasonSelect');
const episodeSelect = document.getElementById('episodeSelect');
const videoContainer = document.getElementById('videoContainer');

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const mediaType = params.get('mediaType');
  let season = params.get('season');
  let episode = params.get('episode');

  if (id && mediaType) {
    showDetails(id, mediaType, season, episode);
  } else {
    detailsContainer.innerHTML = '<p>Invalid request</p>';
  }
});

function showDetails(id, mediaType, initialSeason, initialEpisode) {
  const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}`;

  fetch(detailsUrl)
    .then(response => response.json())
    .then(data => {
      displayDetails(data, mediaType, initialSeason, initialEpisode);
    })
    .catch(error => {
      console.error('Error fetching details:', error);
      detailsContainer.innerHTML = '<p>Error fetching details</p>';
    });
}

function displayDetails(details, mediaType, initialSeason, initialEpisode) {
  const genres = details.genres ? details.genres.map(genre => genre.name).join(', ') : '';
  detailsContainer.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://image.tmdb.org/t/p/w300${details.poster_path}" alt="${details.title || details.name}" style="max-width: 100%;">
    </div>
    <h2 style="text-align: center; color: #3498db;">${details.title || details.name}</h2>
    <p><strong>Type:</strong> ${mediaType}</p>
    <p><strong>Overview:</strong> ${details.overview}</p>
    <p><strong>Release Date:</strong> ${details.release_date || details.first_air_date}</p>
    <p><strong>Rating:</strong> ${details.vote_average}</p>
    <p><strong>Genres:</strong> ${genres}</p>
    <p><strong>Language:</strong> ${details.original_language}</p>
  `;

  if (mediaType === 'movie') {
    watchNowButton.addEventListener('click', () => openVideo(details.id, 'movie'));
  } else if (mediaType === 'tv') {
    setupSeriesOptions(details, initialSeason, initialEpisode);
    videoOptionsContainer.style.display = 'block';
  }
}

function setupSeriesOptions(tvDetails, initialSeason, initialEpisode) {
  const regularSeasons = tvDetails.seasons.filter(season => season.season_number !== 0);
  seasonSelect.innerHTML = '';
  episodeSelect.innerHTML = '';

  regularSeasons.forEach(season => {
    const option = document.createElement('option');
    option.value = season.season_number;
    option.textContent = `Season ${season.season_number}`;
    seasonSelect.appendChild(option);
  });

  // Default to the first season if not provided or invalid
  let selectedSeason = initialSeason && regularSeasons.some(season => season.season_number == initialSeason) ? initialSeason : (regularSeasons.length > 0 ? regularSeasons[0].season_number : '');

  if (selectedSeason) {
    seasonSelect.value = selectedSeason;
    seasonSelect.dispatchEvent(new Event('change')); // Populate episodes
  }

  // Default to the first episode if not provided or invalid
  let selectedEpisode = initialEpisode && tvDetails.seasons.find(season => season.season_number === parseInt(selectedSeason))?.episode_count >= initialEpisode ? initialEpisode : (selectedSeason && tvDetails.seasons.find(season => season.season_number === parseInt(selectedSeason))?.episode_count > 0 ? 1 : '');

  if (selectedEpisode) {
    episodeSelect.value = selectedEpisode;
  }

  // Update URL params based on current selections
  updateURLParams(selectedSeason, selectedEpisode);
}

function openVideo(id, mediaType) {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const aspectRatio = 16 / 9;
  const videoHeight = Math.min(screenWidth * (1 / aspectRatio), 400);

  const selectedSeason = seasonSelect.value;
  const selectedEpisode = episodeSelect.value;

  if (mediaType === 'movie') {
    videoContainer.innerHTML = `<iframe src="${videoBaseUrl}/movie/${id}" width="100%" height="${videoHeight}px" frameborder="0" allowfullscreen></iframe>`;
  } else if (mediaType === 'tv') {
    if (selectedSeason && selectedEpisode) {
      videoContainer.innerHTML = `<iframe src="${videoBaseUrl}/tv/${id}/${selectedSeason}/${selectedEpisode}" width="100%" height="${videoHeight}px" frameborder="0" allowfullscreen></iframe>`;
    } else {
      videoContainer.innerHTML = '<p>Select a season and episode to watch.</p>';
    }
  }
}

function updateURLParams(season, episode) {
  const params = new URLSearchParams(window.location.search);
  params.set('season', season);
  params.set('episode', episode);
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function goHome() {
  window.location.href = 'index.html';
}
