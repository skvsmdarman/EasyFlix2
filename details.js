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
  const season = params.get('season');
  const episode = params.get('episode');

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
      displayDetails(data, mediaType);
      if (mediaType === 'tv') {
        setupSeriesOptions(data);
        videoOptionsContainer.style.display = 'block';
        if (initialSeason) {
          seasonSelect.value = initialSeason;
          seasonSelect.dispatchEvent(new Event('change'));
        }
        if (initialEpisode) {
          episodeSelect.value = initialEpisode;
        } else if (seasonSelect.options.length > 0) {
          episodeSelect.value = '';
        }
        updateEpisodeDetails(id, seasonSelect.value, episodeSelect.value || 1);
        watchNowButton.addEventListener('click', () => openVideo(id, mediaType, seasonSelect.value, episodeSelect.value));
      } else if (mediaType === 'movie') {
        watchNowButton.addEventListener('click', () => openVideo(id, 'movie'));
      }
    })
    .catch(error => {
      console.error('Error fetching details:', error);
      detailsContainer.innerHTML = '<p>Error fetching details</p>';
    });
}

function displayDetails(details, mediaType) {
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
}

function openVideo(id, mediaType, season = null, episode = null) {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const aspectRatio = 16 / 9;
  const videoHeight = Math.min(screenWidth * (1 / aspectRatio), 400);

  if (mediaType === 'movie') {
    videoContainer.innerHTML = `<iframe src="${videoBaseUrl}/movie/${id}" width="100%" height="${videoHeight}px" frameborder="0" allowfullscreen></iframe>`;
  } else if (mediaType === 'tv') {
    videoContainer.innerHTML = `<iframe src="${videoBaseUrl}/tv/${id}/${season}/${episode}" width="100%" height="${videoHeight}px" frameborder="0" allowfullscreen></iframe>`;
  }
}

function setupSeriesOptions(tvDetails) {
  const regularSeasons = tvDetails.seasons.filter(season => season.season_number !== 0);
  seasonSelect.innerHTML = '<option value="">Select Season</option>'; // Clear previous options
  regularSeasons.forEach(season => {
    const option = document.createElement('option');
    option.value = season.season_number;
    option.textContent = `Season ${season.season_number}`;
    seasonSelect.appendChild(option);
  });

  seasonSelect.addEventListener('change', () => {
    const selectedSeason = seasonSelect.value;
    const selectedEpisode = episodeSelect.value || 1;
    updateEpisodeDetails(tvDetails.id, selectedSeason, selectedEpisode);
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('season', selectedSeason);
    newUrl.searchParams.set('episode', selectedEpisode);
    history.pushState(null, '', newUrl);
  });

  episodeSelect.addEventListener('change', () => {
    const selectedSeason = seasonSelect.value;
    const selectedEpisode = episodeSelect.value;
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('season', selectedSeason);
    newUrl.searchParams.set('episode', selectedEpisode);
    history.pushState(null, '', newUrl);
  });

  // Initialize selection
  seasonSelect.dispatchEvent(new Event('change'));
}

function updateEpisodeDetails(seriesId, seasonNumber, episodeNumber) {
  videoContainer.innerHTML = '';
  const episodeDetailsUrl = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${apiKey}`;

  fetch(episodeDetailsUrl)
    .then(response => response.json())
    .then(details => {
      const episodeDetailsContainer = document.getElementById('episodeDetails');
      if (details.error) {
        episodeDetailsContainer.innerHTML = `<p>${details.error}</p>`;
      } else {
        episodeDetailsContainer.innerHTML = `
          <h3 style="color: #3498db;">${details.name}</h3>
          <p><strong>Overview: </strong>${details.overview}</p>
          <p><strong>Air Date: </strong>${details.air_date}</p>
        `;
      }
    })
    .catch(error => {
      console.error('Error fetching episode details:', error);
    });
}

function goHome() {
  window.location.href = 'index.html';
}

// Handle browser navigation (back/forward)
window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  const seasonParam = params.get('season');
  const episodeParam = params.get('episode');
  const id = params.get('id');
  const mediaType = params.get('mediaType');

  if (id && mediaType) {
    showDetails(id, mediaType, seasonParam, episodeParam);
  }
});
