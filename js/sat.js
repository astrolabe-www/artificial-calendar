/* 
// IN HTML
<script src="https://cdn.jsdelivr.net/npm/satellite.js@6.0.2/dist/satellite.min.js">
</script>
*/

// Sample TLE
const tleLine1 = "1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992";
const tleLine2 = "2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442";

// Initialize a satellite record
const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

//  Propagate satellite using time since epoch (in minutes).
const positionAndVelocity = satellite.sgp4(satrec, timeSinceTleEpochMinutes);
//  Or you can use a JavaScript Date
// const positionAndVelocity = satellite.propagate(satrec, new Date());

// The positionAndVelocity result is a pair of ECI coordinates.
// These are the base results from which all other coordinates are derived.
const positionEci = positionAndVelocity.position;
const velocityEci = positionAndVelocity.velocity;

// Set the Observer at 122.03 West by 36.96 North, in RADIANS
const observerGd = {
  longitude: satellite.degreesToRadians(-122.0308),
  latitude: satellite.degreesToRadians(36.9613422),
  height: 0.370
};

// You will need GMST for some of the coordinate transforms.
// http://en.wikipedia.org/wiki/Sidereal_time#Definition
const gmst = satellite.gstime(new Date());

// You can get ECF, Geodetic, Look Angles, and Doppler Factor.
const positionEcf = satellite.eciToEcf(positionEci, gmst);
const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);

// Look Angles may be accessed by `azimuth`, `elevation`, `rangeSat` properties.
const azimuth   = lookAngles.azimuth;
const elevation = lookAngles.elevation;
const rangeSat = lookAngles.rangeSat;
