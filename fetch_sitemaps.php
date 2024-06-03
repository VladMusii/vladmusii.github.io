<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    $input = json_decode(file_get_contents('php://input'), true);
    $sitemaps = $input['sitemaps'];
    $keywords = $input['keywords'];
    $results = [];

    foreach ($sitemaps as $sitemap) {
        $urls = fetchSitemapUrls($sitemap);
        foreach ($urls as $url) {
            foreach ($keywords as $keyword) {
                if (strpos($url, $keyword) !== false) {
                    $results[] = [
                        'sitemap' => $sitemap,
                        'url' => $url
                    ];
                }
            }
        }
    }

    echo json_encode($results);
}

function fetchSitemapUrls($sitemapUrl) {
    if (filter_var($sitemapUrl, FILTER_VALIDATE_URL) === false) {
        return []; // Якщо вхідний рядок не є валідним URL
    }

    // Видалення .gz з URL (альтернативний метод)
    $sitemapUrl = substr($sitemapUrl, -3) === '.gz' ? substr($sitemapUrl, 0, -3) : $sitemapUrl;

    $xmlContent = @file_get_contents($sitemapUrl);
    if ($xmlContent === false) {
        return []; // Якщо неможливо завантажити вміст за URL
    }

    try {
        $xml = new SimpleXMLElement($xmlContent);
        $urls = [];
        foreach ($xml->url as $urlElement) {
            $urls[] = (string) $urlElement->loc;
        }
        return $urls;
    } catch (Exception $e) {
        return []; // Якщо виникли помилки при парсингу XML
    }
}

?>
