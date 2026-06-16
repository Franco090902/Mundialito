import cloudscraper

try:
    print("Creating session scraper...")
    scraper = cloudscraper.create_scraper()
    
    # 1. Fetch main page to establish session/cookies
    print("Fetching sofascore main page...")
    r1 = scraper.get("https://www.sofascore.com", timeout=10)
    print("Main page status:", r1.status_code)
    
    # 2. Fetch API
    url = "https://api.sofascore.com/api/v1/unique-tournament/16/seasons"
    print("Fetching seasons API...")
    r2 = scraper.get(url, timeout=10)
    print("API status:", r2.status_code)
    print("API body:", r2.text[:500])
except Exception as e:
    print("Error:", e)
