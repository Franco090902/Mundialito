import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://api.sofascore.com/api/v1/unique-tournament/16/seasons'
req = urllib.request.Request(url)

try:
    with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
        data = resp.read().decode('utf-8')
        print(f"Status: {resp.status}")
        print(data[:500])
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode('utf-8')[:300])
except Exception as e:
    print(f"Error: {e}")
