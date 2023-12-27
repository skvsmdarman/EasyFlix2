const apiKey = 'ec98dcc4e185de0a0b10683fcc3b21f3';
const detailsContainer = document.getElementById('details');
const watchNowButton = document.getElementById('watchNowButton');
const videoOptionsContainer = document.getElementById('videoOptions');
const seasonSelect = document.getElementById('seasonSelect');
const episodeSelect = document.getElementById('episodeSelect');
const videoContainer = document.getElementById('videoContainer');
const episodeDetailsContainer = document.getElementById('episodeDetails');
const episodeNameContainer = document.getElementById('episodeName');
const episodeOverviewContainer = document.getElementById('episodeOverview');

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
        episodeDetailsContainer.style.display = 'none';
    } else if (mediaType === 'tv') {
        const selectedSeason = seasonSelect.value;
        const selectedEpisode = episodeSelect.value;

        // Construct the URL for the selected episode
        const episodeUrl = `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}/episode/${selectedEpisode}?api_key=${apiKey}`;

        // Fetch details for the selected episode
        fetch(episodeUrl)
            .then(response => response.json())
            .then(episodeDetails => {
                // Update episode details
                if (episodeDetails) {
                    episodeNameContainer.textContent = episodeDetails.name;
                    episodeOverviewContainer.textContent = episodeDetails.overview;
                    episodeDetailsContainer.style.display = 'block';
                } else {
                    episodeDetailsContainer.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching episode details:', error);
                episodeDetailsContainer.style.display = 'none';
            });

        // Display video container with episode details
        videoContainer.innerHTML = `<iframe src="https://vidsrc.to/embed/tv/${id}/season/${selectedSeason}/episode/${selectedEpisode}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
    }
}

function setupSeriesOptions(details) {
    const seasons = details.seasons;

    if (seasons) {
        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.season_number;
            option.textContent = `Season ${season.season_number}`;
            seasonSelect.appendChild(option);
        });

        seasonSelect.addEventListener('change', () => {
            const selectedSeason = seasonSelect.value;
            setupEpisodeOptions(details.id, selectedSeason);
        });

        // Initial setup of episode options for the first season
        setupEpisodeOptions(details.id, seasons[0].season_number);
    }
}

function setupEpisodeOptions(seriesId, seasonNumber) {
    // Remove existing episode options
    episodeSelect.innerHTML = '';

    // Fetch episodes for the selected season
    const episodesUrl = `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${apiKey}`;

    fetch(episodesUrl)
        .then(response => response.json())
        .then(data => {
            const episodes = data.episodes;

            if (episodes) {
                episodes.forEach(episode => {
                    const option = document.createElement('option');
                    option.value = episode.episode_number;
                    option.textContent = `Episode ${episode.episode_number}: ${episode.name}`;
                    episodeSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching episodes:', error);
        });
}
