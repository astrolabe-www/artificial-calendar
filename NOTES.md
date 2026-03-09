# Sun 

## Ultimate

https://en.wikipedia.org/wiki/Solar_azimuth_angle#The_formula_based_on_the_subsolar_point_and_the_atan2_function

https://www.sciencedirect.com/science/article/pii/S0960148121004031

𝑛 = −1.5 + (𝑌𝑖𝑛 − 2000) ∙ 365 + 𝑁𝑙𝑒𝑎𝑝+ Day of Year + Fraction of Day from 0:00 UT (day),<br>
𝐿 = 280.466 + 0.9856474𝑛 (°),<br>
𝑔 = 357.528 + 0.9856003𝑛 (°),<br>
𝜆 = 𝐿 + 1.915 sin 𝑔 + 0.020 sin(2𝑔) (°),<br>
𝜀 = 23.440 − 0.0000004𝑛 (°);<br>
𝛼 = tan−1(cos 𝜀 tan 𝜆) ∙ 180⁄𝜋 (°),<br>
𝛿 = sin−1(sin 𝜀 sin 𝜆) ∙ 180⁄𝜋 (°), (1)<br>
𝑅 = 1.00014 − 0.01671 cos 𝑔 − 0.00014 cos(2𝑔) (au), (2)<br>
𝐸𝑚𝑖𝑛 = (𝐿 − 𝛼) ∙ 4 (min). <br>

where:<br>
𝑛 is the number of days of Terrestrial Time (TT) from J2000.0 UT;<br>
𝑌𝑖𝑛 is the input year;<br>
𝑁𝑙𝑒𝑎𝑝 is the number of leap years;<br>
Day is Day of Year<br>
Fraction is Fraction of Day from 0:00 UT (day),<br>
𝐿 is the mean longitude of the Sun corrected for aberration;<br>
𝑔 is the mean anomaly;<br>
𝜆 is the ecliptic longitude;<br>
𝜀 is the obliquity of ecliptic;<br>
𝛼 is the right ascension;<br>
𝛿 is the declination of the Sun;<br>
𝑅 is the Earth-Sun distance;<br>
𝐸𝑚𝑖𝑛 is the equation of time.<br>


Note that 𝐿 and 𝑔 as well as 𝜆 given as above can be either positive or negative, but computationally they need to be put in the range 0° to 360°, and this can be accomplished by using the modulo function; 𝛼 needs to be in the same quadrant as 𝜆, and this can be done by using the atan2 function, which takes two arguments, instead of the atan function, which takes only one argument.

Suppose the observer’s coordinates, or latitude and longitude, are (𝜙𝑜, 𝜆𝑜), and the subsolar point’s coordinates are (𝜙𝑠, 𝜆𝑠), then the x-, y- and z-components of the unit vector, 𝑺, pointing from the observer to the center of the Sun are as follows:

𝜙𝑠 = 𝛿, (4)<br>
𝜆s =−15($𝑇_{GMT}$ −12+𝐸min /60), (5)<br>
𝑆𝑥 = cos𝜙𝑠 sin(𝜆𝑠−𝜆𝑜),(6)<br>
𝑆𝑦 = cos𝜙𝑜 sin𝜙𝑠 − sin𝜙𝑜 cos𝜙𝑠 cos(𝜆𝑠 −𝜆𝑜), (7)<br>
𝑆𝑧 = sin𝜙𝑜 sin𝜙𝑠 + cos𝜙𝑜 cos𝜙𝑠 cos(𝜆𝑠−𝜆𝑜). (8)

It can be shown that there exists 𝑆x2 + 𝑆y2 + 𝑆z2 = 1. Sproul (2007) used vector analysis to derive the x-, y- and z-components of 𝑺, and they are exactly the same as the 𝑆𝑥, 𝑆𝑦 and 𝑆𝑧 here, noticing that 𝜆𝑠 − 𝜆𝑜 differs from the hour angle, 𝜔, by only a negative sign.

The solar zenith angle is now simply:<br>
𝑍 = cos−1 𝑆𝑧, (9)

and the solar azimuth angle following the South-Clockwise convention is:<br>
𝛾s = atan2(−𝑆x , −𝑆y ). (10)

Eq. (10) gives an unambiguous solar azimuth angle and it is final, and it works everywhere from pole to pole. In other words, the solar azimuth angle is in the right quadrant. The standard atan2(y, x) function which follows the East-Clockwise convention is available in programming/scripting languages Fortran, Python, etc. and it gives the angle in the range [-𝜋, 𝜋] which can be converted to [-180°, 180°].

## Omni Calculator

https://www.omnicalculator.com/physics/sun-angle

The elevation (α) measures the Sun's height relative to the horizon line. It ranges from -90° to 90°. The positive values denote the Sun is above the horizon, while negative ones mean it's below. The Sun reaches the maximal angle in the zenith – directly above your head.

The azimuth (β) tells you how much you should turn clockwise to look directly at the Sun. The reference direction is usually north, and the azimuth angle spans 0° and 360°. Following this convention, the most common bearings are North (0°), East (90°), South (180°), and West (270°).

α = sin−1[sinδ sinϕ + cosδ cosϕ cosγ]

β = β0 = cos−1[(sinδ cosϕ − cosδ sinϕ cosγ)/cosα] if γ<0°

β = 360° - β0 if γ≥0°

where:

- δ = Declination angle
- ϕ = Latitude
- γ = Local hour angle

δ = −23.45° ∙ cos[ (360/365) (d + 10)]

γ = 15° ∙ (T − 12)

The T unit is hours, and the factor 15° comes from the fact that the Earth makes a 15° rotation during one hour.

# Moon

Astronomical Algorithms Author: Jean Meeus

Chapter 45: Position of the Moon

https://github.com/mourner/suncalc

GPT Code

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
