document.getElementById('sitemap-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    let sitemapsInput = document.getElementById('sitemaps').value.split('\n').map(url => url.trim()).filter(url => url);
    let sitemaps = [];
    for (let input of sitemapsInput) {
        if (input.startsWith('<')) { // Check if input is XML content
            sitemaps = sitemaps.concat(extractUrlsFromXml(input));
        } else { // If it's a URL
            const xmlContent = await fetchXmlContent(input);
            if (xmlContent) {
                sitemaps = sitemaps.concat(extractUrlsFromXml(xmlContent));
            }
        }
    }

    const keywords = document.getElementById('keywords').value.split('\n').map(keyword => keyword.trim()).filter(keyword => keyword);

    // Check if any URLs have been entered
    if (sitemaps.length === 0 || keywords.length === 0) {
        alert('Будь ласка, введіть хоча б один URL Sitemap і одну частину URL для пошуку.');
        return;
    }

    // Display spinner
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('results').innerHTML = '';

    try {
        const response = await fetch('fetch_sitemaps.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sitemaps, keywords })
        });

        const text = await response.text();
        try {
            const results = JSON.parse(text);
            displayResults(results);
        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            console.log('Response text:', text);
            document.getElementById('results').innerText = 'Виникла помилка під час отримання даних.';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('results').innerText = 'Виникла помилка під час отримання даних.';
    } finally {
        // Hide spinner
        document.getElementById('spinner').style.display = 'none';
    }
});

async function fetchXmlContent(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching XML:', error);
        return null; // Return null if an error occurred
    }
}

function extractUrlsFromXml(xmlString) {
    const urls = [];
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Перевірка на помилки парсингу XML
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        console.error('XML parsing error:', xmlDoc.getElementsByTagName('parsererror')[0].textContent);
        return []; // Повертаємо порожній масив, якщо XML не валідний
    }

    const locElements = xmlDoc.getElementsByTagName('loc');
    for (let loc of locElements) {
        let url = loc.textContent.trim();
        if (url.endsWith('.gz')) {
            url = url.slice(0, -3); // Видалення '.gz' з кінця URL
        }
        urls.push(url);
    }
    return urls;
}


function displayResults(results) {
    const resultsPerPage = 20;
    let currentPage = 1;

    function renderPage(page) {
        currentPage = page;
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        const start = (page - 1) * resultsPerPage;
        const end = start + resultsPerPage;
        const paginatedResults = results.slice(start, end);

        const table = document.createElement('table');
        table.className = 'datatables-projects table border-top dataTable no-footer dtr-column collapsed';
        table.innerHTML = `
            <thead>
                <tr>
                    <th class="sorting_disabled">Sitemap</th>
                    <th class="sorting_disabled">URL</th>
                </tr>
            </thead>
            <tbody>
                ${paginatedResults.map(result => `
                    <tr>
                        <td>${result.sitemap}</td>
                        <td>${result.url}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        resultsDiv.appendChild(table);

        if (results.length === 0) {
            resultsDiv.innerHTML = '<p>Дані відсутні, спробуйте змінити умови пошуку.</p>';
        }

        renderPagination(results.length);
    }

    function renderPagination(totalResults) {
        const totalPages = Math.ceil(totalResults / resultsPerPage);
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'pagination';

        const createPageButton = (page) => {
            const button = document.createElement('button');
            button.innerText = page;
            button.classList.toggle('active', page === currentPage);
            button.addEventListener('click', () => renderPage(page));
            paginationDiv.appendChild(button);
        };

        if (totalPages > 1) {
            createPageButton(1);
        }

        if (currentPage > 4) {
            const dots = document.createElement('button');
            dots.innerText = '...';
            dots.classList.add('disabled');
            dots.style.color = '#9e95f5';
            paginationDiv.appendChild(dots);
        }

        let startPage = Math.max(2, currentPage - 2);
        let endPage = Math.min(totalPages - 1, currentPage + 2);

        if (currentPage <= 4) {
            startPage = 2;
            endPage = Math.min(5, totalPages - 1);
        } else if (currentPage >= totalPages - 3) {
            startPage = Math.max(2, totalPages - 4);
            endPage = totalPages - 1;
        }

        for (let i = startPage; i <= endPage; i++) {
            createPageButton(i);
        }

        if (currentPage < totalPages - 3) {
            const dots = document.createElement('button');
            dots.innerText = '...';
            dots.classList.add('disabled');
            dots.style.color = '#9e95f5';
            paginationDiv.appendChild(dots);
        }

        if (totalPages > 1) {
            createPageButton(totalPages);
        }

        const resultsDiv = document.getElementById('results');
        resultsDiv.appendChild(paginationDiv);
    }

    renderPage(currentPage);

    document.getElementById('export-button-top').addEventListener('click', () => exportToCSV(results));
}

function exportToCSV(results) {
    const csvContent = results.map(result => `${result.sitemap},${result.url}`).join('\n');
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = csvUrl;
    downloadLink.download = 'sitemap_results.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

var swiper = new Swiper('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    loop: true,
    autoplay: {
        delay: 5000,
    },
});

document.getElementById('toggle-button').addEventListener('click', function() {
    const moreText = document.getElementById('more-text');
    const button = this;
    if (moreText.style.display === 'none' || moreText.style.display === '') {
        moreText.style.display = 'block';
        button.innerText = 'Читати менше';
    } else {
        moreText.style.display = 'none';
        button.innerText = 'Читати більше';
    }
});
