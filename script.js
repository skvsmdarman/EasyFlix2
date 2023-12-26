const apiKey = 'ec98dcc4e185de0a0b10683fcc3b21f3';
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const detailsContainer = document.getElementById('details');

function searchMovies() {
  const query = searchInput.value;

  if (query.trim() !== '') {
    const apiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`;

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
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  results.forEach(result => {
    const resultCard = document.createElement('div');
    resultCard.classList.add('result-card');
    resultCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w92${result.poster_path}" alt="${result.title || result.name}">
      <div>
        <p>${result.title || result.name}</p>
        <p>${getReleaseYear(result)}</p>
      </div>
    `;
    resultCard.addEventListener('click', () => showDetails(result.id, result.media_type));
    resultsContainer.appendChild(resultCard);
  });
}

function showDetails(id, mediaType) {
  window.location.href = `details.html?id=${id}&mediaType=${mediaType}`;
}

function getReleaseYear(result) {
  const releaseDate = result.release_date || result.first_air_date;
  return releaseDate ? new Date(releaseDate).getFullYear() : '';
}

