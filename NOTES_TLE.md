# TLE File Format

## Info

https://en.wikipedia.org/wiki/Two-line_element_set

https://www.youtube.com/watch?v=y1zpVQwP4bI

https://www.youtube.com/watch?v=_C-GQy0qTY0

## TLE sources

1. Celestrak (most popular)
   - Website: https://celestrak.com
   - Directory: https://celestrak.org/NORAD/elements/index.php?FORMAT=tle
   - Example: ISS TLE: https://celestrak.com/NORAD/elements/stations.txt
   - All Active: https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle
2. Space-Track.org (official NORAD source)
   - Website: https://www.space-track.org
   - Historical TLEs
   - Example: Query ISS: NORAD ID 25544
3. N2YO.com
   - Website: https://www.n2yo.com
   - Real-time satellite tracking with TLE download
4. Heavens-Above
   - Website: https://www.heavens-above.com
   - Provides TLEs for popular satellites
   - Useful for observational astronomy

## Get Azimuth/Elevation: High-Level Steps

1. Propagate TLE using SGP4
   - Produces satellite position in ECI (TEME) coordinates
2. Convert ECI → ECEF
   - Account for Earth rotation (GMST)
3. Convert ECEF → Topocentric (SEZ or ENU)
   - Relative to observer
4. Convert to Azimuth / Elevation

```
azimuth  = atan2(East, North)
elevation = atan2(Up, sqrt(East² + North²))
```

## Libraries

AstroPy:
- https://www.astropy.org/
- https://www.youtube.com/watch?v=o9wWCbdcQl0

AstroPy for JS:
- https://github.com/shashwatak/satellite-js

C++:
- https://github.com/dnwrnr/sgp4/


## Code:

```python
# pip install sgp4 astropy numpy

from sgp4.api import Satrec
from sgp4.api import jday
from astropy.coordinates import EarthLocation, TEME, AltAz
from astropy.time import Time
import astropy.units as u

# --- TLE ---
tle1 = "1 25544U 98067A   24014.52782407  .00016717  00000+0  10270-3 0  9992"
tle2 = "2 25544  51.6416  33.0114 0004562  78.6976  39.4781 15.50027556432019"

sat = Satrec.twoline2rv(tle1, tle2)

# --- Observation time (UTC) ---
time = Time("2024-01-14T12:00:00", scale="utc")

jd, fr = jday(
  time.datetime.year,
  time.datetime.month,
  time.datetime.day,
  time.datetime.hour,
  time.datetime.minute,
  time.datetime.second + time.datetime.microsecond * 1e-6
)

# --- Propagate orbit ---
error, r, v = sat.sgp4(jd, fr)
if error != 0:
  raise RuntimeError("SGP4 propagation error")

# TEME position (km → meters)
teme = TEME(
  x=r[0]*u.km,
  y=r[1]*u.km,
  z=r[2]*u.km,
  obstime=time
)

# --- Observer location ---
observer = EarthLocation(
  lat=40.0*u.deg,
  lon=-105.0*u.deg,
  height=1600*u.m
)

# --- Convert to Az/El ---
altaz = teme.transform_to(AltAz(obstime=time, location=observer))

print(f"Azimuth: {altaz.az.deg:.2f}°")
print(f"Elevation: {altaz.alt.deg:.2f}°")

```

## Function

```python
from sgp4.api import Satrec, jday
from astropy.coordinates import EarthLocation, TEME, AltAz
from astropy.time import Time
import astropy.units as u
from datetime import datetime
import pytz

def tle_to_az_el(
    tle_line1: str,
    tle_line2: str,
    latitude_deg: float,
    longitude_deg: float,
    height_m: float,
    time_input: datetime,
    time_is_utc: bool = True,
    local_timezone: str | None = None
):
  """
  Convert TLE to azimuth and elevation.

  Parameters
  ----------
  tle_line1, tle_line2 : str
      Two-Line Element set
  latitude_deg : float
      Observer latitude in degrees (+N)
  longitude_deg : float
      Observer longitude in degrees (+E)
  height_m : float
      Observer height above sea level (meters)
  time_input : datetime
      Observation time (UTC or local)
  time_is_utc : bool
      True if time_input is UTC, False if local time
  local_timezone : str
      IANA timezone name (e.g. 'Europe/Berlin') if time_is_utc=False

  Returns
  -------
  azimuth_deg : float
      Degrees clockwise from North
  elevation_deg : float
      Degrees above horizon
  """

  # --- Handle time ---
  if time_is_utc:
      if time_input.tzinfo is None:
          time_input = time_input.replace(tzinfo=pytz.UTC)
      obs_time = Time(time_input.astimezone(pytz.UTC))
  else:
      if local_timezone is None:
          raise ValueError("local_timezone must be provided for local time")
      tz = pytz.timezone(local_timezone)
      if time_input.tzinfo is None:
          time_input = tz.localize(time_input)
      obs_time = Time(time_input.astimezone(pytz.UTC))

  # --- Load satellite ---
  sat = Satrec.twoline2rv(tle_line1, tle_line2)

  # --- Julian date ---
  jd, fr = jday(
      obs_time.datetime.year,
      obs_time.datetime.month,
      obs_time.datetime.day,
      obs_time.datetime.hour,
      obs_time.datetime.minute,
      obs_time.datetime.second + obs_time.datetime.microsecond * 1e-6
  )

  # --- Propagate ---
  error, r, v = sat.sgp4(jd, fr)
  if error != 0:
      raise RuntimeError(f"SGP4 propagation error: {error}")

  # --- TEME position ---
  teme = TEME(
      x=r[0] * u.km,
      y=r[1] * u.km,
      z=r[2] * u.km,
      obstime=obs_time
  )

  # --- Observer location ---
  observer = EarthLocation(
      lat=latitude_deg * u.deg,
      lon=longitude_deg * u.deg,
      height=height_m * u.m
  )

  # --- Convert to Az/El ---
  altaz = teme.transform_to(AltAz(obstime=obs_time, location=observer))

  return altaz.az.deg, altaz.alt.deg

```

## No Astropy

```python
import numpy as np
from sgp4.api import Satrec, jday
from datetime import datetime, timezone, timedelta

# WGS84 constants
a_earth = 6378.137  # km
f_earth = 1 / 298.257223563
b_earth = a_earth * (1 - f_earth)

def gmst_from_jd(jd):
  """Compute Greenwich Mean Sidereal Time in radians"""
  T = (jd - 2451545.0) / 36525.0
  gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933*T**2 - T**3 / 38710000
  gmst = np.radians(gmst % 360)
  return gmst

def eci_to_ecef(r_eci, jd):
  """Rotate ECI coordinates to ECEF"""
  gmst = gmst_from_jd(jd)
  R = np.array([
      [np.cos(gmst), np.sin(gmst), 0],
      [-np.sin(gmst), np.cos(gmst), 0],
      [0, 0, 1]
  ])
  return R @ r_eci

def geodetic_to_ecef(lat, lon, alt):
  """Convert geodetic (deg, deg, m) to ECEF (km)"""
  lat = np.radians(lat)
  lon = np.radians(lon)
  alt_km = alt / 1000.0
  e2 = 1 - (b_earth**2 / a_earth**2)
  N = a_earth / np.sqrt(1 - e2 * np.sin(lat)**2)
  x = (N + alt_km) * np.cos(lat) * np.cos(lon)
  y = (N + alt_km) * np.cos(lat) * np.sin(lon)
  z = (N * (b_earth**2 / a_earth**2) + alt_km) * np.sin(lat)
  return np.array([x, y, z])

def ecef_to_enu(r_ecef, observer_lat, observer_lon, observer_ecef):
  """Convert ECEF vector to local ENU coordinates"""
  lat = np.radians(observer_lat)
  lon = np.radians(observer_lon)
  dr = r_ecef - observer_ecef
  R = np.array([
      [-np.sin(lon),             np.cos(lon),            0],
      [-np.sin(lat)*np.cos(lon), -np.sin(lat)*np.sin(lon), np.cos(lat)],
      [np.cos(lat)*np.cos(lon),  np.cos(lat)*np.sin(lon), np.sin(lat)]
  ])
  enu = R @ dr
  return enu

def enu_to_az_el(enu):
  """Convert ENU vector to azimuth and elevation"""
  east, north, up = enu
  horiz_dist = np.sqrt(east**2 + north**2)
  az = np.degrees(np.arctan2(east, north)) % 360
  el = np.degrees(np.arctan2(up, horiz_dist))
  return az, el

def tle_to_az_el(tle1, tle2, lat_deg, lon_deg, height_m, obs_time):
  """
  Compute azimuth and elevation from TLE without Astropy.
  obs_time must be a datetime in UTC.
  """
  # --- Load satellite ---
  sat = Satrec.twoline2rv(tle1, tle2)
  
  # --- Julian date ---
  jd, fr = jday(obs_time.year, obs_time.month, obs_time.day,
                obs_time.hour, obs_time.minute,
                obs_time.second + obs_time.microsecond*1e-6)
  
  # --- Propagate ---
  error, r, v = sat.sgp4(jd, fr)
  if error != 0:
      raise RuntimeError(f"SGP4 propagation error: {error}")
  r_eci = np.array(r)  # km
  
  # --- Observer ECEF ---
  observer_ecef = geodetic_to_ecef(lat_deg, lon_deg, height_m)
  
  # --- Satellite ECEF ---
  r_ecef = eci_to_ecef(r_eci, jd)
  
  # --- Convert to ENU ---
  enu = ecef_to_enu(r_ecef, lat_deg, lon_deg, observer_ecef)
  
  # --- Azimuth & Elevation ---
  az, el = enu_to_az_el(enu)
  return az, el

## USAGE

from datetime import datetime, timezone

tle1 = "1 25544U 98067A   24014.52782407  .00016717  00000+0  10270-3 0  9992"
tle2 = "2 25544  51.6416  33.0114 0004562  78.6976  39.4781 15.50027556432019"

az, el = tle_to_az_el(
    tle1, tle2,
    lat_deg=40.0,
    lon_deg=-105.0,
    height_m=1600,
    obs_time=datetime(2024,1,14,12,0,0, tzinfo=timezone.utc)
)

print(f"Azimuth: {az:.2f}°")
print(f"Elevation: {el:.2f}°")

```
