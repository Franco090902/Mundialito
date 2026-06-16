from curl_cffi import requests

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
    'Referer': 'https://www.sofascore.com/',
    'Origin': 'https://www.sofascore.com',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0'
}

try:
    url = "https://api.sofascore.com/api/v1/unique-tournament/16/seasons"
    print("Testing with curl_cffi and headers...")
    r = requests.get(url, headers=headers, impersonate="chrome120")
    print("Status:", r.status_code)
    print("Body:", r.text[:500])
except Exception as e:
    print("Error:", e)
