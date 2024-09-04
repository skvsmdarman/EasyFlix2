const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

function searchMovies() {
  const query = searchInput.value;
  if (query === '') {
    resultsContainer.innerHTML = '';
    return;
  }

  if (query.trim() !== '') {
    const apiUrl = `${config.tmdbBaseUrl}/search/multi?api_key=${config.tmdbApiKey}&query=${query}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        displayResults(data.results);
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
  }
}
function displayResults(results) {
  resultsContainer.innerHTML = '';
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="noResults">No results found.</p>';
    return;
  }
  results.forEach(result => {
    if (result.media_type !== 'person') {
      const resultCard = document.createElement('div');
      resultCard.classList.add('result-card');
      resultCard.innerHTML = `
        <img src="${config.tmdbPosterUrl}w92${result.poster_path}" alt="${result.title || result.name}">
        <div>
          <p class="title">${result.title || result.name}</p>
          <p>${result.media_type} (${getReleaseYear(result)})</p>
        </div>
      `;
      resultCard.addEventListener('click', () => showDetails(result.id, result.media_type));
      resultsContainer.appendChild(resultCard);
    }
  });
}
function getReleaseYear(result) {
  const releaseDate = result.release_date || result.first_air_date;
  return releaseDate ? new Date(releaseDate).getFullYear() : '';
}

function showDetails(id, mediaType) {
  if (mediaType === 'tv') {
    window.location.href = `details.html?id=${id}&mediaType=${mediaType}&season=1&episode=1`;
  } else {
    window.location.href = `details.html?id=${id}&mediaType=${mediaType}`;
  }
}

function handleSearchFormSubmit(event) {
  event.preventDefault();
  searchMovies();
}

window.handleSearchFormSubmit = handleSearchFormSubmit;
window.searchMovies = searchMovies;
