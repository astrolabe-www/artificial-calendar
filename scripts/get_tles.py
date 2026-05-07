import json
import urllib.request
from os import makedirs


URLS = {
  "GOES": "https://celestrak.org/NORAD/elements/gp.php?GROUP=goes&FORMAT=tle",
  "NOAA": "https://celestrak.org/NORAD/elements/gp.php?GROUP=satnogs&FORMAT=tle",
  "STARLINK": "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle",
  "KUIPER": "https://celestrak.org/NORAD/elements/gp.php?GROUP=kuiper&FORMAT=tle",
  "SSS": "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle",
  "SCI": "https://celestrak.org/NORAD/elements/gp.php?GROUP=science&FORMAT=tle",
  "GPS": "https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle",
  "GLONASS": "https://celestrak.org/NORAD/elements/gp.php?GROUP=glo-ops&FORMAT=tle",
  "Galileo": "https://celestrak.org/NORAD/elements/gp.php?GROUP=galileo&FORMAT=tle",
  "Beidou": "https://celestrak.org/NORAD/elements/gp.php?GROUP=beidou&FORMAT=tle",
}


def get_tles_from_file(file):
  ifp = open(file, "r")
  tleLines = ifp.readlines()
  ifp.close()

  tles = []

  for idx in range(0, len(tleLines) - 2, 3):
    tles.append({
      "name": tleLines[idx + 0].strip(),
      "tle": [
        tleLines[idx + 1].strip(),
        tleLines[idx + 2].strip(),
      ]
    })

  return tles


def fetch_tles(urls, out_dir="./data/tles", out_filename="all.json"):
  makedirs(out_dir, exist_ok=True)
  all_json_out_path = f"{out_dir}/{out_filename}"

  data = {}
  for k,url in urls.items():
    txt_out_path = f"{out_dir}/{k.lower()}.txt"
    json_out_path = f"{out_dir}/{k.lower()}.json"
    try:
      urllib.request.urlretrieve(url, txt_out_path)
      data[k.lower()] = get_tles_from_file(txt_out_path)
      with open(json_out_path, "w") as ofp:
        json.dump(data[k.lower()], ofp)
    except Exception as e:
      print(f"loading: {k}")
      print(f"An error occurred: {e}")

  with open(all_json_out_path, "w") as ofp:
    json.dump(data, ofp)


if __name__ == "__main__":
  fetch_tles(URLS, out_dir="./data/tles", out_filename="all.json")
