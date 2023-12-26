const apiKey = 'ec98dcc4e185de0a0b10683fcc3b21f3';
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

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

async function displayResults(results) {
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  for (const result of results) {
    if (result.media_type !== 'person') {
      const videoLink = (result.media_type === 'movie')
        ? `https://vidsrc.to/embed/movie/${result.id}`
        : `https://vidsrc.to/embed/tv/${result.id}/1/1`;

      try {
        const response = await axios.head(videoLink);
        if (response.status === 200) {
          const resultCard = document.createElement('div');
          resultCard.classList.add('result-card');
          resultCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w92${result.poster_path}" alt="${result.title || result.name}">
            <div>
              <p>${result.title || result.name}</p>
              <p>${result.media_type} (${getReleaseYear(result)})</p>
            </div>
          `;
          resultCard.addEventListener('click', () => showDetails(result.id, result.media_type));
          resultsContainer.appendChild(resultCard);
        }
      } catch (error) {
        console.error('Error checking video link:', error);
      }
    }
  }
}

function getReleaseYear(result) {
  const releaseDate = result.release_date || result.first_air_date;
  return releaseDate ? new Date(releaseDate).getFullYear() : '';
}

function showDetails(id, mediaType) {
  window.location.href = `details.html?id=${id}&mediaType=${mediaType}`;
}
