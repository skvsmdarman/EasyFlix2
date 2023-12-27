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

function displayResults(results) {
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="noResults">No results found.</p>';
    return;
  }

  results.forEach(result => {
    if (result.media_type !== 'person') {
      if (checkVideoAvailabilityInVidSrc(result.media_type, result.id)) {
        const resultCard = document.createElement('div');
        resultCard.classList.add('result-card');
        resultCard.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w92${result.poster_path}" alt="${result.title || result.name}">
          <div>
            <p class="title">${result.title || result.name}</p>
            <p>${result.media_type} (${getReleaseYear(result)})</p>
          </div>
        `;
        resultCard.addEventListener('click', () => showDetails(result.id, result.media_type));
        resultsContainer.appendChild(resultCard);
    }
    }
  });
}


function getReleaseYear(result) {
  const releaseDate = result.release_date || result.first_air_date;
  return releaseDate ? new Date(releaseDate).getFullYear() : '';
}

function showDetails(id, mediaType) {
  window.location.href = `details.html?id=${id}&mediaType=${mediaType}`;
}

function handleSearchFormSubmit(event) {
  event.preventDefault();
  searchMovies();
}

function checkVideoAvailabilityInVidSrc(type,videoId) {
  const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://vidsrc.to/embed/${type}/${videoId}`)}`;

  return fetch(apiUrl)
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      return data.status === 200;
    })
    .catch(error => {
      console.error('Error checking video availability:', error);
      return false;
    });
}
