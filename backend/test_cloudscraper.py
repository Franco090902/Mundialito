import cloudscraper

try:
    print("Creating cloudscraper...")
    scraper = cloudscraper.create_scraper(
        browser={
            'browser': 'chrome',
            'platform': 'windows',
            'desktop': True
        }
    )
    url = "https://api.sofascore.com/api/v1/unique-tournament/16/seasons"
    print("Fetching Sofascore with cloudscraper on:", url)
    r = scraper.get(url)
    print("Status:", r.status_code)
    print("Body length:", len(r.text))
    print("Body content:", r.text[:500])
except Exception as e:
    print("Error:", e)
