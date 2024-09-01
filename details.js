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

function showDetails(id, mediaType, season, episode) {
  const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}`;

  fetch(detailsUrl)
    .then(response => response.json())
    .then(data => {
      displayDetails(data, mediaType, season, episode);
      watchNowButton.addEventListener('click', () => {
        const selectedSeason = seasonSelect.value;
        const selectedEpisode = episodeSelect.value;
        openVideo(id, mediaType, selectedSeason, selectedEpisode);
      });
      seasonSelect.addEventListener('change', () => {
        const selectedSeason = seasonSelect.value;
        updateEpisodeDetails(id, selectedSeason);
      });
      episodeSelect.addEventListener('change', () => {
        const selectedSeason = seasonSelect.value;
        updateEpisodeDetails(id, selectedSeason);
      });
    })
    .catch(error => {
      console.error('Error fetching details:', error);
      detailsContainer.innerHTML = '<p>Error fetching details</p>';
    });
}

function displayDetails(details, mediaType, season, episode) {
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
    setupSeriesOptions(details, season, episode);
    videoOptionsContainer.style.display = 'block';
    if (season && episode) {
      updateEpisodeDetails(details.id, season, episode);
    }
  }
}

function openVideo(id, mediaType, season, episode) {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const aspectRatio = 16 / 9;
  const videoHeight = Math.min(screenWidth * (1 / aspectRatio), 400);

  if (mediaType === 'movie') {
    videoContainer.innerHTML = `<iframe src="${videoBaseUrl}/movie/${id}" width="100%" height="${videoHeight}px" frameborder="0" allowfullscreen></iframe>`;
  } else if (mediaType === 'tv') {
    videoContainer.innerHTML = `<iframe src="${videoBaseUrl}/tv/${id}/${season}/${episode}" width="100%" height="${videoHeight}px" frameborder="0" allowfullscreen></iframe>`;
  }
}

function setupSeriesOptions(tvDetails, season, episode) {
  const regularSeasons = tvDetails.seasons.filter(season => season.season_number !== 0);
  regularSeasons.forEach(season => {
    const option = document.createElement('option');
    option.value = season.season_number;
    option.textContent = `Season ${season.season_number}`;
    seasonSelect.appendChild(option);
  });

  if (season) {
    seasonSelect.value = season;
  }

  seasonSelect.addEventListener('change', () => {
    const selectedSeason = parseInt(seasonSelect.value, 10);
    const selectedSeasonDetails = regularSeasons.find(season => season.season_number === selectedSeason);
    episodeSelect.innerHTML = '';
    if (selectedSeasonDetails) {
      for (let i = 1; i <= selectedSeasonDetails.episode_count; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Episode ${i}`;
        episodeSelect.appendChild(option);
      }
    }

    if (episode) {
      episodeSelect.value = episode;
    }
  });

  seasonSelect.dispatchEvent(new Event('change'));
}

function goHome() {
  window.location.href = 'index.html';
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
