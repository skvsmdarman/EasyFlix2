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

    updateEpisodeDetails(parseInt(selectedSeason, 10), parseInt(selectedEpisode, 10));
  }
}

function updateVideo(id) {
  const selectedSeason = seasonSelect.value;
  const selectedEpisode = episodeSelect.value;

  videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;

  updateEpisodeDetails(parseInt(selectedSeason, 10), parseInt(selectedEpisode, 10));
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

    updateEpisodeDetails(selectedSeason, 1); // Display details for the first episode when season changes
  });

  seasonSelect.dispatchEvent(new Event('change'));
}

function updateEpisodeDetails(seasonNumber, episodeNumber) {
  const episodeDetailsContainer = document.getElementById('episodeDetails');
  const episodeNameElement = document.getElementById('episodeName');
  const episodeOverviewElement = document.getElementById('episodeOverview');

  const episode = getEpisodeDetails(seasonNumber, episodeNumber);

  if (episode) {
    episodeNameElement.textContent = episode.name;
    episodeOverviewElement.textContent = episode.overview;
  } else {
    episodeNameElement.textContent = '';
    episodeOverviewElement.textContent = '';
  }
}

function getEpisodeDetails(seasonNumber, episodeNumber) {
  const season = tvDetails.seasons.find(season => season.season_number === seasonNumber);

  if (season && season.episodes) {
    return season.episodes.find(episode => episode.episode_number === episodeNumber);
  }

  return null;
}
