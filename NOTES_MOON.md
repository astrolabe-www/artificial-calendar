# Moon
Astronomical Algorithms Author: Jean Meeus
Chapter 45: Position of the Moon

Library:
https://github.com/mourner/suncalc

Planetary positions:
https://www.stjarnhimlen.se/comp/ppcomp.html

Basic, with moon example:
http://www.geoastro.de/elevazmoon/basics/

Nasa moon eclipse:
https://eclipse.gsfc.nasa.gov/LEvis/LEaltitude.html

## GPT Code (JavaScript)

```js
function moonAzEl(date, lat, lon) {

  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  /* -------------------------------------------------
     1. Convert time → Julian days since J2000
  --------------------------------------------------*/
  const JD = date.getTime() / 86400000 + 2440587.5;
  const d = JD - 2451545.0;

  /* -------------------------------------------------
     2. Mean orbital elements of the Moon
     (degrees → radians)
  --------------------------------------------------*/
  const L = (218.3164477 + 13.17639648 * d) * rad; // mean longitude
  const M = (134.9633964 + 13.06499295 * d) * rad; // mean anomaly
  const F = (93.2720950  + 13.22935024 * d) * rad; // argument of latitude
  const D = (297.8501921 + 12.19074912 * d) * rad; // mean elongation

  /* -------------------------------------------------
     3. Periodic perturbation terms
     (dominant lunar terms for good accuracy)
  --------------------------------------------------*/
  const lonEcl =
      L
    + (6.289 * rad)  * Math.sin(M)
    + (1.274 * rad)  * Math.sin(2*D - M)
    + (0.658 * rad)  * Math.sin(2*D)
    + (0.214 * rad)  * Math.sin(2*M)
    + (0.110 * rad)  * Math.sin(D);

  const latEcl =
      (5.128 * rad) * Math.sin(F)
    + (0.280 * rad) * Math.sin(M + F)
    + (0.277 * rad) * Math.sin(M - F)
    + (0.173 * rad) * Math.sin(2*D - F)
    + (0.055 * rad) * Math.sin(2*D + F - M)
    + (0.046 * rad) * Math.sin(2*D - F - M)
    + (0.033 * rad) * Math.sin(2*D + F)
    + (0.017 * rad) * Math.sin(2*M + F);

  /* -------------------------------------------------
     4. Convert ecliptic → equatorial coordinates
     (accounts for Earth's axial tilt)
  --------------------------------------------------*/
  const e = (23.439291 - 0.0000004 * d) * rad; // obliquity

  const sinL = Math.sin(lonEcl);
  const cosL = Math.cos(lonEcl);
  const sinB = Math.sin(latEcl);
  const cosB = Math.cos(latEcl);

  const ra = Math.atan2(
    sinL * Math.cos(e) - Math.tan(latEcl) * Math.sin(e),
    cosL
  );

  const dec = Math.asin(
    sinB * Math.cos(e) + cosB * Math.sin(e) * sinL
  );

  /* -------------------------------------------------
     5. Local Sidereal Time
     (Earth rotation relative to stars)
  --------------------------------------------------*/
  const lw = -lon * rad;

  const GMST =
    (280.16 + 360.9856235 * d) * rad;

  const LST = GMST + lw;

  /* -------------------------------------------------
     6. Hour angle
     (difference between local sky rotation and RA)
  --------------------------------------------------*/
  const H = LST - ra;

  /* -------------------------------------------------
     7. Convert RA/Dec → Horizontal coordinates
     --------------------------------------------------
     altitude = elevation above horizon
     azimuth measured from north clockwise
  --------------------------------------------------*/
  const phi = lat * rad;

  const sinAlt =
      Math.sin(phi) * Math.sin(dec) +
      Math.cos(phi) * Math.cos(dec) * Math.cos(H);

  const alt = Math.asin(sinAlt);

  const az = Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)
  );

  /* -------------------------------------------------
     8. Return degrees
  --------------------------------------------------*/
  return {
    azimuth: (az * deg + 180 + 360) % 360,
    elevation: alt * deg
  };
}
```
