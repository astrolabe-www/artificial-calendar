import urllib.request
from os import makedirs

URLS = {
  "GOES": "https://celestrak.org/NORAD/elements/gp.php?GROUP=goes&FORMAT=tle",
  "NOAA": "https://celestrak.org/NORAD/elements/gp.php?GROUP=noaa&FORMAT=tle",
  "STARLINK": "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle",
  "KUIPER": "https://celestrak.org/NORAD/elements/gp.php?GROUP=kuiper&FORMAT=tle",
  "SSS": "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle",
  "SCI": "https://celestrak.org/NORAD/elements/gp.php?GROUP=science&FORMAT=tle",
  "GPS": "https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle",
  "GLONASS": "https://celestrak.org/NORAD/elements/gp.php?GROUP=glo-ops&FORMAT=tle",
  "Galileo": "https://celestrak.org/NORAD/elements/gp.php?GROUP=galileo&FORMAT=tle",
  "Beidou": "https://celestrak.org/NORAD/elements/gp.php?GROUP=beidou&FORMAT=tle",
}

out_dir = f"./data/tles/"
makedirs(out_dir, exist_ok=True)

for k,url in URLS.items():
  out_path = f"{out_dir}/{k.lower()}.txt"
  try:
    urllib.request.urlretrieve(url, out_path)
  except Exception as e:
    print(f"An error occurred: {e}")
