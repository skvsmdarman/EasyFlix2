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
    detailsContainer.innerHTML = '<p>Invalid request</p>';
  }

  watchNowButton.addEventListener('click', () => {
    const selectedSeason = seasonSelect.value;
    const selectedEpisode = episodeSelect.value;
    openVideo(id, mediaType, selectedSeason, selectedEpisode);
  });

  seasonSelect.addEventListener('change', () => {
    const selectedSeason = seasonSelect.value;
    const selectedEpisode = episodeSelect.value;
    updateEpisodeDetails(id, selectedSeason, selectedEpisode);
  });

  episodeSelect.addEventListener('change', () => {
    const selectedSeason = seasonSelect.value;
    const selectedEpisode = episodeSelect.value;
    updateEpisodeDetails(id, selectedSeason, selectedEpisode);
  });
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
    setupSeriesOptions(details);
    videoOptionsContainer.style.display = 'block';
    const seasonNumber = document.getElementById('seasonSelect').value;
    const episodeNumber = document.getElementById('episodeSelect').value;
    updateEpisodeDetails(details.id, seasonNumber, episodeNumber);
    watchNowButton.addEventListener('click', () => openVideo(details.id, 'tv'));
  }
}

function openVideo(id, mediaType) {
  if (mediaType === 'movie') {
    videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/movie/${id}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
  } else if (mediaType === 'tv') {
    const selectedSeason = seasonSelect.value;
    const selectedEpisode = episodeSelect.value;

    videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
   console.log('ID:', id, 'Selected Season:', selectedSeason, 'Selected Episode:', selectedEpisode);
  }
}

function updateVideo(id) {
  const selectedSeason = seasonSelect.value;
  const selectedEpisode = episodeSelect.value;

  videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
 console.log('ID:', id, 'Selected Season:', selectedSeason, 'Selected Episode:', selectedEpisode);
}


function setupSeriesOptions(tvDetails) {
  const regularSeasons = tvDetails.seasons.filter(season => season.season_number !== 0);

  regularSeasons.forEach(season => {
    const option = document.createElement('option');
    option.value = season.season_number;
    option.textContent = `Season ${season.season_number}`;
    seasonSelect.appendChild(option);
  });

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
  });

  seasonSelect.dispatchEvent(new Event('change'));
}

function goHome() {
  window.location.href = 'index.html';
}


function updateEpisodeDetails(seriesId, seasonNumber, episodeNumber) {
  // Construct the URL for fetching episode details
  const episodeDetailsUrl = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${apiKey}`;

  // Fetch episode details
  fetch(episodeDetailsUrl)
    .then(response => response.json())
    .then(details => {
      const episodeDetailsContainer = document.getElementById('episodeDetails');

      // Check if there was an error
      if (details.error) {
        episodeDetailsContainer.innerHTML = `<p>${details.error}</p>`;
      } else {
        // Update the episode details in the HTML
        episodeDetailsContainer.innerHTML = `
          <h2>${details.name}</h2>
          <p>${details.overview}</p>
          <p>Air Date: ${details.air_date}</p>
          <p>Episode Number: ${details.episode_number}</p>
          <!-- Add more details as needed -->
        `;
      }
    })
    .catch(error => {
      console.error('Error fetching episode details:', error);
    });
}
