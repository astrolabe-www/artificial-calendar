# Sun Equations

## Almanac

In The Almanac algorithm, the time argument is the difference in days between the current Julian date, jd, and JD 2451545.0, which is noon 1 January 2000 Universal Time (UT). The current Julian date may be specified directly or calculated from more familiar expressions of time using:

jd = 2432916.5 + delta x 365 + leap + day + hour/24,

where

delta = year - 1949,

and

leap = integer portion of (delta/4).

Day is the day of the year (e.g., Feb 1 = 32), and hour is the UT in hours including fractions thereof. The leading number in the formula for jd is the Julian date for midnight 0 January 1949 UT. The choice of 1949 is arbitrary, but it does allow one to work with positive numbers in the calculation of jd for the century in question. The details of specifying local time in terms of UT and day of the year are left to the reader to include in the code that calls the subroutine,

The ecliptic coordinates are calculated from the time argument according to the following steps:

n = jd - 2451545.0<br>
L (mean long.) = 280.460 + 0.9856474 x n (0 <= L < 360°)<br>
g (mean anomaly) = 357.528 + 0.9856003 × n (0  <= g < 360°)<br>
l(eclipticlong.) = L + 1.915 × sin(g) + 0.020 x sin(2 × g) (0 <= l < 360°)<br>
ep (obliquity of the ecliptic) = 23.439 - 0.0000004 x n (degs)

Note that the specification (0 <= L < 360°) implies that the quantity L is to have multiples of 360° added or subtracted until is has a value in the stated range.

To calculate the right ascension and declination we use the following formulas:

tan(ra) = cos(ep) × sin (l)/cos(l)<br>
sin(dec) = sin(ep) × sin(l)

gmst = 6.697375 + 0.0657098242 x n + hour(UT) (0 <= gmst < 24 h)

lmst = gmst + (east long.)/15 (0  <= lmst < 24 h)

the hour angle (ha) is then given by:<br>
ha = lmst - ra (-12 < ha <= 12 h)

To calculate the elevation and azimuth, we use the following transformations:<br>

sin (el) = sin (dec) × sin (lat) + cos (dec) x cos (lat) x cos (ha) (degs)

sin (az) = -cos (dec) x sin (ha)/cos (el) (0 <= az < 360°)


## Ultimate (Best algo to implement)

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
𝜆s =−15(𝑇GMT −12+𝐸min /60), (5)<br>
𝑆𝑥 = cos𝜙𝑠 sin(𝜆𝑠−𝜆𝑜),(6)<br>
𝑆𝑦 = cos𝜙𝑜 sin𝜙𝑠 − sin𝜙𝑜 cos𝜙𝑠 cos(𝜆𝑠 −𝜆𝑜), (7)<br>
𝑆𝑧 = sin𝜙𝑜 sin𝜙𝑠 + cos𝜙𝑜 cos𝜙𝑠 cos(𝜆𝑠−𝜆𝑜). (8)

It can be shown that there exists 𝑆x2 + 𝑆y2 + 𝑆z2 = 1. Sproul (2007) used vector analysis to derive the x-, y- and z-components of 𝑺, and they are exactly the same as the 𝑆𝑥, 𝑆𝑦 and 𝑆𝑧 here, noticing that 𝜆𝑠 − 𝜆𝑜 differs from the hour angle, 𝜔, by only a negative sign.

The solar zenith angle is now simply:<br>
𝑍 = cos−1 𝑆𝑧, (9)

and the solar azimuth angle following the South-Clockwise convention is:<br>
𝛾s = atan2(−𝑆x , −𝑆y ). (10)

Eq. (10) gives an unambiguous solar azimuth angle and it is final, and it works everywhere from pole to pole. In other words, the solar azimuth angle is in the right quadrant. The standard atan2(y, x) function which follows the East-Clockwise convention is available in programming/scripting languages Fortran, Python, etc. and it gives the angle in the range [-𝜋, 𝜋] which can be converted to [-180°, 180°].

### FORTRAN 90

```fortran
Appendix A: Subroutine in Fortran 90
! 2019-12-26 !Solar Geometry using subsolar point and atan2.
! by Taiping Zhang.
! Input variables:
! inyear: 4-digit year, e.g., 1998, 2020;
! inmon: month, in the range of 1 - 12;
! inday: day, in the range 1 - 28/29/30/31;
! gmtime: GMT in decimal hour, e.g., 15.2167;
! xlat: latitude in decimal degree, positive in Northern Hemisphere;
! xlon: longitude in decimal degree, positive for East longitude. !
! Output variables:
! solarz: solar zenith angle in deg;
! azi: solar azimuth in deg the range -180 to 180, South-Clockwise ! Convention.
!
! Note: The user may modify the code to output other variables.

Subroutine sunpos_ultimate_azi_atan2(inyear, inmon, inday, gmtime, xlat, xlon, solarz, azi)

  implicit none

  integer:: inyear, inmon, inday, nday(12), julday(0:12), xleap, i, dyear, dayofyr
  real:: gmtime, xlat, xlon
  real:: n, L, g, lambda, epsilon, alpha, delta, R, EoT
  real:: solarz, azi, toadwn
  real, parameter:: rpd = acos(-1.0)/180
  real:: sunlat, sunlon, PHIo, PHIs, LAMo, LAMs, Sx, Sy, Sz
  data nday / 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 /

  if((mod(inyear, 100)/=0 .and. mod(inyear, 4)==0) .or. (mod(inyear, 100)==0.and.mod(inyear, 400)==0)) then
    nday(2)=29
  else
    nday(2)=28
  endif

  julday(0)=0
  do i=1, 12
    julday(i)=julday(i-1)+nday(i)
  enddo
  ! Note: julday(12) is equal to either 365 or 366.

  dyear=inyear-2000
  dayofyr=julday(inmon-1)+inday
  if(dyear<=0) then
    xleap=int(real(dyear)/4) !xleap has the SAME SIGN as dyear
  else
    xleap=int(real(dyear)/4)+1 !Since 2000 is a leap year
  endif

  ! --- Astronomical Almanac for the Year 2019, Page C5 ---
  n=-1.5+dyear*365.0+xleap*1.0+dayofyr+gmtime/24
  L=modulo(280.460+0.9856474*n, 360.0)
  g=modulo(357.528+0.9856003*n, 360.0)
  lambda=modulo(L+1.915*sin(g*rpd)+0.020*sin(2*g*rpd), 360.0)
  epsilon=23.439-0.0000004*n
  alpha=modulo(atan2(cos(epsilon*rpd)*sin(lambda*rpd), cos(lambda*rpd))/rpd, 360.0) !alpha in the same quadrant as lambda
  delta=asin(sin(epsilon*rpd)*sin(lambda*rpd))/rpd
  R=1.00014-0.01671*cos(g*rpd)-0.00014*cos(2*g*rpd)
  EoT=modulo((L-alpha)+180.0, 360.0)-180.0 !In deg

  ! --- Solar geometry ---
  sunlat=delta !In deg
  sunlon=-15.0*(gmtime-12.0+EoT*4/60)


  PHIo=xlat*rpd
  PHIs=sunlat*rpd
  LAMo=xlon*rpd
  LAMs=sunlon*rpd
  Sx=cos(PHIs)*sin(LAMs-LAMo)
  Sy=cos(PHIo)*sin(PHIs)-sin(PHIo)*cos(PHIs)*cos(LAMs-LAMo)
  Sz=sin(PHIo)*sin(PHIs)+cos(PHIo)*cos(PHIs)*cos(LAMs-LAMo)

  solarz=acos(Sz)/rpd !In deg
  azi=atan2(-Sx, -Sy)/rpd !In deg. South-Clockwise Convention
Endsubroutine sunpos_ultimate_azi_atan2
```

```Python
import numpy as np

def sunpos_ultimate_azi_atan2(inyear, inmon, inday, gmtime, xlat, xlon):
  """
  Parameters
  ----------
  inyear : int
  inmon  : int
  inday  : int
  gmtime : float   # hours UTC
  xlat   : float   # degrees
  xlon   : float   # degrees

  Returns
  -------
  solarz : float   # solar zenith angle (deg)
  azi    : float   # azimuth (deg), South-Clockwise convention
  """

  rpd = np.arccos(-1.0) / 180.0  # radians per degree

  # Days per month
  nday = np.array([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31])

  # Leap year check
  if ((inyear % 100 != 0 and inyear % 4 == 0) or
      (inyear % 100 == 0 and inyear % 400 == 0)):
    nday[1] = 29
  else:
    nday[1] = 28

  # Julian day lookup
  julday = np.zeros(13, dtype=int)
  for i in range(1, 13):
    julday[i] = julday[i - 1] + nday[i - 1]

  dyear = inyear - 2000
  dayofyr = julday[inmon - 1] + inday

  if dyear <= 0:
    xleap = int(dyear / 4)
  else:
    xleap = int(dyear / 4) + 1  # 2000 is a leap year

  # --- Astronomical Almanac (Page C5) ---
  n = -1.5 + dyear * 365.0 + xleap + dayofyr + gmtime / 24.0

  L = np.mod(280.460 + 0.9856474 * n, 360.0)
  g = np.mod(357.528 + 0.9856003 * n, 360.0)
  lambd = np.mod(
    L + 1.915 * np.sin(g * rpd) + 0.020 * np.sin(2.0 * g * rpd),
    360.0
  )

  epsilon = 23.439 - 0.0000004 * n
  some_y = np.cos(epsilon * rpd) * np.sin(lambd * rpd)
  some_x = np.cos(lambd * rpd)
  some_atan = np.arctan2(some_y, some_x)

  alpha = np.mod(some_atan / rpd, 360.0)
  delta = np.arcsin(np.sin(epsilon * rpd) * np.sin(lambd * rpd)) / rpd

  R = 1.00014 - 0.01671 * np.cos(g * rpd) - 0.00014 * np.cos(2.0 * g * rpd)

  EoT = np.mod((L - alpha) + 180.0, 360.0) - 180.0  # degrees

  # --- Solar geometry ---
  sunlat = delta
  sunlon = -15.0 * (gmtime - 12.0 + EoT * 4.0 / 60.0)

  PHIo = xlat * rpd
  PHIs = sunlat * rpd
  LAMo = xlon * rpd
  LAMs = sunlon * rpd

  Sx = np.cos(PHIs) * np.sin(LAMs - LAMo)
  Sy = np.cos(PHIo) * np.sin(PHIs) - np.sin(PHIo) * np.cos(PHIs) * np.cos(LAMs - LAMo)
  Sz = np.sin(PHIo) * np.sin(PHIs) + np.cos(PHIo) * np.cos(PHIs) * np.cos(LAMs - LAMo)

  solarz = np.degrees(np.arccos(Sz))
  azi_south = np.degrees(np.arctan2(-Sx, -Sy))  # South–Clockwise convention
  azi = (azi_south + 180.0) % 360.0

  return solarz, azi
```

## Research Gate

https://www.researchgate.net/post/How_to_calculate_the_solar_azimuth_angle_and_solar_altitude_angle_of_a_place

Solar angles are solely dependent upon the location (latitude and longitude) and time.

Thus, it is straightforward to calculate solar angles. The hour angle (h) is defined as the longitude of the sun, which is calculated as:

ℎ = − (𝑡 − 12) / 12

where t is the frational GMT time (e.g., for hh:mm:ss then t = hh + mm/60. + ss/3600).

Solar zenith angle (θo) is calculated as:<br>
cos 𝜃𝑜 = sin𝜑 sin 𝛿 + cos𝜑 cos 𝛿 cos ℎ

Where δ is the solar declination angle and varies from -23.45 deg to +23.45 deg through the year and can be approximated as:<br>
𝛿 = −23.45 cos ( 2𝜋𝐽 /365 + 20𝜋 /365)

and J is the day of the year.

The solar azimuth angle (φo) is calculated as:<br>
sin𝜙𝑜 = sin(ℎ − 𝜆) sin 𝛽𝑜

Where: cos𝛽𝑜 = cos(𝜑) cos(𝜆 − 𝜆𝑠)

## Wikipedia

https://en.wikipedia.org/wiki/Solar_azimuth_angle

### Conventional Trigonometric Formulas

${\displaystyle \sin \phi _{\mathrm {s} }={\frac {-\sin h\cos \delta }{\sin \theta _{\mathrm {s} }}}}$

${\displaystyle {\cos \phi _{\mathrm {s} } ={\frac {\sin \delta \cos \Phi -\cos h\cos \delta \sin \Phi }{\sin \theta _{\mathrm {s} }}}}}$

${\displaystyle {\cos \phi _{\mathrm {s} } ={\frac {\sin \delta -\cos \theta _{\mathrm {s} }\sin \Phi }{\sin \theta _{\mathrm {s} }\cos \Phi }}}}$


${\displaystyle {\text{compass }}\phi _{\mathrm {s} }=360-\phi _{\mathrm {s} }}$

The formulas use the following terminology:

- ${\displaystyle \phi _{\mathrm {s} }}$ is the solar azimuth angle
- ${\displaystyle \theta _{\mathrm {s} }}$ is the [solar zenith angle](https://en.wikipedia.org/wiki/Solar_zenith_angle)
- ${\displaystyle h}$ is the [hour angle](https://en.wikipedia.org/wiki/Hour_angle), in the local [solar time](https://en.wikipedia.org/wiki/Solar_time)
- ${\displaystyle \delta }$ is the current [sun declination](https://en.wikipedia.org/wiki/Position_of_the_Sun)
- ${\displaystyle \Phi }$ is the local [latitude](https://en.wikipedia.org/wiki/Latitude)

### Formula based on the subsolar point and the atan2 function

- ${\displaystyle \phi _{s} =\delta}$
- ${\displaystyle \lambda _{s} =-15(T_{\mathrm {GMT} }-12+E_{\mathrm {min} }/60)}$
- ${\displaystyle \\S_{x} =\cos \phi _{s}\sin(\lambda _{s}-\lambda _{o})}$
- ${\displaystyle \\S_{y} =\cos \phi _{o}\sin \phi _{s}-\sin \phi _{o}\cos \phi _{s}\cos(\lambda _{s}-\lambda _{o})}$
- ${\displaystyle \\S_{z} =\sin \phi _{o}\sin \phi _{s}+\cos \phi _{o}\cos \phi _{s}\cos(\lambda _{s}-\lambda _{o})}$


where

- ${\displaystyle \delta }$ is the declination of the Sun,
- ${\displaystyle \phi _{s}}$ is the latitude of the subsolar point,
- ${\displaystyle \lambda _{s}}$ is the longitude of the subsolar point,
- ${\displaystyle T_{\mathrm {GMT} }}$ is the Greenwich Mean Time or UTC,
- ${\displaystyle E_{\mathrm {min} }}$ is the [equation of time](https://en.wikipedia.org/wiki/Equation_of_time) in minutes,
- ${\displaystyle \phi _{o}}$ is the latitude of the observer,
- ${\displaystyle \lambda _{o}}$ is the longitude of the observer,
- ${\displaystyle S_{x},S_{y},S_{z}}$ are the x-, y- and z-components, respectively, of the unit vector pointing toward the Sun. The x-, y- and z-axises of the coordinate system point to East, North and upward, respectively.

It can be shown that 

${\displaystyle S_{x}^{2}+S_{y}^{2}+S_{z}^{2}=1}$. With the above mathematical setup, the solar zenith angle and solar azimuth angle are simply:

- ${\displaystyle Z=\mathrm {acos} (S_{z})}$
- ${\displaystyle \gamma _{s}=\mathrm {atan2} (-S_{x},-S_{y})}$ (South-Clockwise Convention)

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


## PV Education

https://www.pveducation.org/pvcdrom/properties-of-sunlight/the-suns-position

The (LSTM) is calculated according to the equation:

LSTM = 15° ∙ ΔTGMT

where ΔTGMT is the difference of the Local Time (LT) from Greenwich Mean Time (GMT) in hours.

Equation of Time (EoT)

The equation of time (EoT) (in minutes) is an empirical equation that corrects for the eccentricity of the Earth's orbit and the Earth's axial tilt.


EoT = 9.87 sin(2B) - 7.53 cos(B) - 1.5 sin(B)

where:<br>
B = (360/365) (d - 81)

in degrees and d is the number of days since the start of the year.

Time Correction Factor (TC)

The net Time Correction Factor (in minutes) accounts for the variation of the Local Solar Time (LST) within a given time zone due to the longitude variations within the time zone and also incorporates the EoT above.

TC = 4(Longitude - LSTM) + EoT

The factor of 4 minutes comes from the fact that the Earth rotates 1° every 4 minutes.

Local Solar Time (LST)

The Local Solar Time (LST) can be found by using the previous two corrections to adjust the local time (LT).

LST = LT + TC/60

Hour Angle (HRA)

The Hour Angle converts the local solar time (LST) into the number of degrees which the sun moves across the sky. By definition, the Hour Angle is 0° at solar noon. Since the Earth rotates 15° per hour, each hour away from solar noon corresponds to an angular motion of the sun in the sky of 15°. In the morning the hour angle is negative, in the afternoon the hour angle is positive.

HRA = 15° (LST - 12)

Declination

The declination angle has been previously given as:

δ = 23.45° ∙ sin[ (360/365) (d - 81)]

Where d is the number of days since the start of the year.


Elevation and Azimuth

The elevation, α, is described on page: https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle

alpha = sin-1(sinδ sinφ + cosδ cosφ cos(HRA))

Azimuth = cos-1((sinδ cosφ - cosδ sinφ cos(HRA)) / cos(alpha))

where φ is the latitude

## PSA es

https://www.psa.es/sdg/sunpos.htm

```c
// Declaration of some constants 
#define pi    3.14159265358979323846
#define twopi (2*pi)
#define rad   (pi/180)
#define dEarthMeanRadius     6371.01	// In km
#define dAstronomicalUnit    149597890	// In km

struct cTime
{
	int iYear;
	int iMonth;
	int iDay;
	double dHours;
	double dMinutes;
	double dSeconds;
};

struct cLocation
{
	double dLongitude;
	double dLatitude;
};

struct cSunCoordinates
{
	double dZenithAngle;
	double dAzimuth;
};

void sunpos(cTime udtTime, cLocation udtLocation, cSunCoordinates *udtSunCoordinates);
```

```cpp
// This file is available in electronic form at http://www.psa.es/sdg/sunpos.htm

#include <math.h>

void sunpos(cTime udtTime,cLocation udtLocation, cSunCoordinates *udtSunCoordinates) {
	// Main variables
	double dElapsedJulianDays;
	double dDecimalHours;
	double dEclipticLongitude;
	double dEclipticObliquity;
	double dRightAscension;
	double dDeclination;

	// Auxiliary variables
	double dY;
	double dX;

	// Calculate difference in days between the current Julian Day 
	// and JD 2451545.0, which is noon 1 January 2000 Universal Time
	{
		double dJulianDate;
		long int liAux1;
    long int liAux2A;
    long int liAux2B;
    long int liAux2C;
		long int liAux3;
  
    // Calculate time of the day in UT decimal hours
		dDecimalHours = udtTime.dHours + (udtTime.dMinutes + udtTime.dSeconds / 60.0 ) / 60.0;

		// Calculate current Julian Day
		liAux1 = (udtTime.iMonth-14)/12;

    liAux2A = (1461*(udtTime.iYear + 4800 + liAux1))/4;
    liAux2B = (367*(udtTime.iMonth - 2 - 12*liAux1))/12;
    liAux2C = (3*((udtTime.iYear + 4900 + liAux1)/100))/4;

		liAux3 = liAux2A + liAux2B - liAux2C + udtTime.iDay-32075;

    dJulianDate=(double)(liAux3)-0.5+dDecimalHours/24.0;

    // Calculate difference between current Julian Day and JD 2451545.0 
		dElapsedJulianDays = dJulianDate-2451545.0;
	}

	// Calculate ecliptic coordinates (ecliptic longitude and obliquity of the 
	// ecliptic in radians but without limiting the angle to be less than 2*Pi 
	// (i.e., the result may be greater than 2*Pi)
	{
		double dMeanLongitude;
		double dMeanAnomaly;
		double dOmega;

		dOmega=2.1429-0.0010394594*dElapsedJulianDays;
		dMeanLongitude = 4.8950630+ 0.017202791698*dElapsedJulianDays; // Radians
		dMeanAnomaly = 6.2400600+ 0.0172019699*dElapsedJulianDays;
		dEclipticLongitude = dMeanLongitude + 0.03341607*sin( dMeanAnomaly ) + 0.00034894*sin( 2*dMeanAnomaly ) - 0.0001134 - 0.0000203*sin(dOmega);
		dEclipticObliquity = 0.4090928 - 6.2140e-9*dElapsedJulianDays + 0.0000396*cos(dOmega);
	}

	// Calculate celestial coordinates ( right ascension and declination ) in radians 
	// but without limiting the angle to be less than 2*Pi (i.e., the result may be 
	// greater than 2*Pi)
	{
		double dSin_EclipticLongitude;
		dSin_EclipticLongitude= sin( dEclipticLongitude );
		dY = cos( dEclipticObliquity ) * dSin_EclipticLongitude;
		dX = cos( dEclipticLongitude );
		dRightAscension = atan2( dY,dX );
		if( dRightAscension < 0.0 ) dRightAscension = dRightAscension + twopi;
		dDeclination = asin( sin( dEclipticObliquity )*dSin_EclipticLongitude );
	}

	// Calculate local coordinates ( azimuth and zenith angle ) in degrees
	{
		double dGreenwichMeanSiderealTime;
		double dLocalMeanSiderealTime;
		double dLatitudeInRadians;
		double dHourAngle;
		double dCos_Latitude;
		double dSin_Latitude;
		double dCos_HourAngle;
		double dParallax;

    dGreenwichMeanSiderealTime = 6.6974243242 + 0.0657098283*dElapsedJulianDays + dDecimalHours;
		dLocalMeanSiderealTime = (dGreenwichMeanSiderealTime*15 + udtLocation.dLongitude)*rad;
		dHourAngle = dLocalMeanSiderealTime - dRightAscension;
		dLatitudeInRadians = udtLocation.dLatitude*rad;
		dCos_Latitude = cos( dLatitudeInRadians );
		dSin_Latitude = sin( dLatitudeInRadians );
		dCos_HourAngle= cos( dHourAngle );
		udtSunCoordinates->dZenithAngle = (acos( dCos_Latitude*dCos_HourAngle*cos(dDeclination) + sin( dDeclination )*dSin_Latitude));
		dY = -sin( dHourAngle );
		dX = tan( dDeclination )*dCos_Latitude - dSin_Latitude*dCos_HourAngle;

    udtSunCoordinates->dAzimuth = atan2( dY, dX );

    if ( udtSunCoordinates->dAzimuth < 0.0 ) 
			udtSunCoordinates->dAzimuth = udtSunCoordinates->dAzimuth + twopi;
		udtSunCoordinates->dAzimuth = udtSunCoordinates->dAzimuth/rad;

    // Parallax Correction
		dParallax=(dEarthMeanRadius/dAstronomicalUnit)*sin(udtSunCoordinates->dZenithAngle);
		udtSunCoordinates->dZenithAngle=(udtSunCoordinates->dZenithAngle + dParallax)/rad;
	}
}
```

## Navy

https://aa.usno.navy.mil/faq/sun_approx

Given below is a simple algorithm for computing the Sun's angular coordinates to an accuracy of about 1 arcminute within two centuries of 2000. The algorithm's accuracy degrades gradually beyond its four-century window of applicability. This accuracy is quite adequate for computing, for example, the times of sunrise and sunset, or solar transit. For navigational purposes it would provide about 1 nautical mile accuracy. The algorithm requires only the Julian date of the time for which the Sun's coordinates are needed (Julian dates are a form of Universal Time.)

First, compute D, the number of days and fraction (+ or –) from the epoch referred to as "J2000.0", which is 2000 January 1.5, Julian date 2451545.0:

D = JD – 2451545.0

where JD is the Julian date of interest. Then compute

Mean anomaly of the Sun:<br>
g = 357.529 + 0.98560028 D

Mean longitude of the Sun:<br>
q = 280.459 + 0.98564736 D

Geocentric apparent ecliptic longitude of the Sun (adjusted for aberration):<br>
L = q + 1.915 sin g + 0.020 sin 2g

where all the constants (therefore g, q, and L) are in degrees. It may be necessary or desirable to reduce g, q, and L to the range 0° to 360°.

The Sun's ecliptic latitude, b, can be approximated by b=0. The distance of the Sun from the Earth, R, in astronomical units (AU), can be approximated by:<br>
R = 1.00014 – 0.01671 cos g – 0.00014 cos 2g

Once the Sun's apparent ecliptic longitude, L, has been computed, the Sun's right ascension and declination can be obtained. First compute the mean obliquity of the ecliptic, in degrees:<br>
e = 23.439 – 0.00000036 D

Then the Sun's right ascension, RA, and declination, d, can be obtained from:<br>

tan RA = cos e sin L / cos L<br>
sin d = sin e sin L

RA is always in the same quadrant as L. If the numerator and denominator on the right side of the expression for RA are used in a double-argument arctangent function (e.g., "atan2"), the proper quadrant will be obtained. If RA is obtained in degrees, it can be converted to hours simply by dividing by 15. RA is conventionally reduced to the range 0h to 24h.

Other quantities can also be obtained. The Equation of Time, EqT, apparent solar time minus mean solar time, can be computed from:<br>
EqT = q/15 – RA

where Eqt and RA are in hours and q is in degrees. The angular semidiameter of the Sun, SD, in degrees, is simply:<br>
SD = 0.2666 / R

## NASA SPICE

- https://naif.jpl.nasa.gov/naif/index.html
- https://naif.jpl.nasa.gov/naif/aboutspice.html
- https://naif.jpl.nasa.gov/naif/toolkit.html
- https://naif.jpl.nasa.gov/naif/links.html
- https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/index.html
- https://github.com/tomreddell/cppSpice

