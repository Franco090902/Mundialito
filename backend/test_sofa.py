import urllib.request
import json
import ssl

url = "https://api.sofascore.com/api/v1/search/all?q=Argentina"
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://www.sofascore.com',
        'Referer': 'https://www.sofascore.com/'
    }
)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    with urllib.request.urlopen(req, context=ctx, timeout=8) as response:
        html = response.read()
        print("Success!")
        print(html[:200])
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print("Response body:", e.read())
