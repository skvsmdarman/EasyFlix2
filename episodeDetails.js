const apiKey = 'ec98dcc4e185de0a0b10683fcc3b21f3';
const videoBaseUrl = 'https://vidsrc.cc/v2/embed';
const episodeDetailsContainer = document.getElementById('episodeDetails');
const watchNowButton = document.getElementById('watchNowButton');
var videoContainer = document.getElementById('videoContainer');

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const seriesId = params.get('seriesId');
  const seasonNumber = params.get('season');
  const episodeNumber = params.get('episode');
  if (seriesId && seasonNumber && episodeNumber) {
    fetchEpisodeDetails(seriesId, seasonNumber, episodeNumber);
  } else {
    episodeDetailsContainer.innerHTML = '<p>Invalid request</p>';
  }
});

function fetchEpisodeDetails(seriesId, seasonNumber, episodeNumber) {
  const episodeDetailsUrl = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${apiKey}`;

  fetch(episodeDetailsUrl)
    .then(response => response.json())
    .then(details => {
      displayEpisodeDetails(details);
    })
    .catch(error => {
      console.error('Error fetching episode details:', error);
      episodeDetailsContainer.innerHTML = '<p>Error fetching episode details</p>';
    });
}

function displayEpisodeDetails(details) {
  episodeDetailsContainer.innerHTML = `
    <h2 style="color: #3498db;">${details.name}</h2>
    <p><strong>Overview:</strong> ${details.overview}</p>
    <p><strong>Air Date:</strong> ${details.air_date}</p>
  `;
  watchNowButton.addEventListener('click', openEpisode);
}

function openEpisode() {
  const params = new URLSearchParams(window.location.search);
  const seriesId = params.get('seriesId');
  const seasonNumber = params.get('season');
  const episodeNumber = params.get('episode');

  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const aspectRatio = 16 / 9;
  const videoHeight = Math.min(screenWidth * (1 / aspectRatio), 400);

  videoContainer.innerHTML = `<iframe src="${videoBaseUrl}/tv/${seriesId}/${seasonNumber}/${episodeNumber}" width="100%" height="${videoHeight}px" frameborder="0" allowfullscreen></iframe>`;
}
