const deg2rad = (d) => d * Math.PI / 180.0;
const rad2deg = (r) => r * 180.0 / Math.PI;

const sinDeg = (d) => Math.sin(deg2rad(d));
const cosDeg = (d) => Math.cos(deg2rad(d));

// ----------------------------
// Solar azimuth/elevation (NOAA-style)
// Returns azimuth_deg (0=N,90=E,180=S,270=W) and elevation_deg
// ----------------------------
const hygor = {
  solarAzimuthElevation: (localDate, localTime, latDeg, lonDeg, tzOffsetHours) => {
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

    const { year, month, day } = localDate;
    const { hour, minute, second } = localTime;

    const utcHour = hour - tzOffsetHours;
    const dtUtc = new Date(Date.UTC(year, month - 1, day, utcHour, minute, second, 0));
    const jd = satellite.jday(dtUtc);
    const T = (jd - 2451545.0) / 36525.0;

    const L0 = (280.46646 + T * (36000.76983 + 0.0003032 * T)) % 360.0;
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);

    const Mrad = deg2rad(M);
    const C =
      Math.sin(Mrad) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
      Math.sin(2 * Mrad) * (0.019993 - 0.000101 * T) +
      Math.sin(3 * Mrad) * 0.000289;

    const trueLong = L0 + C;
    const omega = 125.04 - 1934.136 * T;
    const lambdaApp = trueLong - 0.00569 - 0.00478 * Math.sin(deg2rad(omega));

    const eps0 = 23.0 + (26.0 + (21.448 - T * (46.815 + T * (0.00059 - 0.001813 * T))) / 60.0) / 60.0;
    const eps = eps0 + 0.00256 * Math.cos(deg2rad(omega));

    const epsRad = deg2rad(eps);
    const lamRad = deg2rad(lambdaApp);
    const decl = Math.asin(Math.sin(epsRad) * Math.sin(lamRad));

    const y = Math.pow(Math.tan(epsRad / 2.0), 2);
    const L0rad = deg2rad(L0);
    const eqTime = 4.0 * rad2deg(
      y * Math.sin(2 * L0rad) -
      2 * e * Math.sin(Mrad) +
      4 * e * y * Math.sin(Mrad) * Math.cos(2 * L0rad) -
      0.5 * y * y * Math.sin(4 * L0rad) -
      1.25 * e * e * Math.sin(2 * Mrad)
    );

    const timeInMinutes = hour * 60.0 + minute + (second / 60.0);
    const timeOffset = eqTime + 4.0 * lonDeg - 60.0 * tzOffsetHours;
    const tst = (timeInMinutes + timeOffset) % 1440.0;

    let ha = tst / 4.0 - 180.0;
    if (ha < -180.0) ha += 360.0;

    const latRad = deg2rad(latDeg);
    const haRad = deg2rad(ha);

    let cosZenith = Math.sin(latRad) * Math.sin(decl) + Math.cos(latRad) * Math.cos(decl) * Math.cos(haRad);
    cosZenith = clamp(cosZenith, -1.0, 1.0);
    const zenith = Math.acos(cosZenith);
    const elevation = 90.0 - rad2deg(zenith);

    const azimuth = (rad2deg(Math.atan2(
      Math.sin(haRad),
      Math.cos(haRad) * Math.sin(latRad) - Math.tan(decl) * Math.cos(latRad)
    )) + 180.0) % 360.0;

    return { azimuth, elevation };
  }
}

// ----------------------------
// Solar azimuth/elevation (NOAA-style)
// Returns azimuth_deg (0=N,90=E,180=S,270=W) and elevation_deg
// ----------------------------
const ultimate = {
  // https://www.sciencedirect.com/science/article/pii/S0960148121004031
  solarAzimuthElevation: (localDate, localTime, latDeg, lonDeg, tzOffsetHours) => {
    const { year, month, day } = localDate;
    const { hour, minute, second } = localTime;

    const utcHour = hour - tzOffsetHours;
    const utcInHour = utcHour + minute / 60.0 + second / 3600.0;
    const lat_r = deg2rad(latDeg);
    const lon_r = deg2rad(lonDeg);

    const dtUtc = new Date(Date.UTC(year, month - 1, day, utcHour, minute, second, 0));
    const jd = satellite.jday(dtUtc);
    const days = jd - 2451545.0;

    // Mean longitude of the Sun
    const L = (280.460 + 0.9856474 * days) % 360.0;

    // Sun's right ascension and declination
    const { rtasc, decl } = satellite.sunPos(jd);
    const alpha = rad2deg(rtasc);
    const dec_r = decl;

    // Equation of Time, apparent solar time minus mean solar time
    const Emin = (L - alpha) * 4.0;

    // Longitude of the subsolar point
    const lambda_s = -15.0 * (utcInHour - 12.0 + Emin / 60.0);
    const lambda_s_r = deg2rad(lambda_s);

    // Vector from observer to center of sun
    const Sx = Math.cos(dec_r) * Math.sin(lambda_s_r - lon_r);
    const Sy = Math.cos(lat_r) *  Math.sin(dec_r) - Math.sin(lat_r) * Math.cos(dec_r) * Math.cos(lambda_s_r - lon_r);
    const Sz = Math.sin(lat_r) * Math.sin(dec_r) + Math.cos(lat_r) * Math.cos(dec_r) * Math.cos(lambda_s_r - lon_r);

    const azimuth_r = Math.atan2(Sx, Sy);
    const zenith_r = Math.acos(Sz);

    const azimuth = rad2deg(azimuth_r);
    const zenith = rad2deg(zenith_r);
    const elevation = 90.0 - zenith;

    return { azimuth, elevation };
  }
}

const omni = {
  // https://www.omnicalculator.com/physics/sun-angle
  solarAzimuthElevation: (localDate, localTime, latDeg, lonDeg, tzOffsetHours) => {
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

    const dayOfYear = (date) => Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );

    const { year, month, day } = localDate;
    const { hour, minute, second } = localTime;

    const utcHour = hour - tzOffsetHours;
    const hourFrac = utcHour + minute / 60.0 + second / 3600.0;

    const dt = new Date(Date.UTC(year, month - 1, day, utcHour, minute, second, 0));
    const d = dayOfYear(dt);

    const dec = -23.45 * cosDeg((360.0 / 365.0) * (d + 10.0));
    const la = 15.0 * (hourFrac - 12.0);

    const elevation_r = Math.asin(
      sinDeg(dec) * sinDeg(latDeg) + cosDeg(dec) * cosDeg(latDeg) * cosDeg(la)
    );
    const elevation = rad2deg(elevation_r);

    const azimuther = (sinDeg(dec) * cosDeg(latDeg) - cosDeg(dec) * sinDeg(latDeg) * cosDeg(la)) / cosDeg(elevation);
    const azimuth_r = Math.acos(clamp(azimuther, -1.0, 1.0));
    const azimuth = (la < 0) ? rad2deg(azimuth_r) : 360.0 - rad2deg(azimuth_r);

    return { azimuth, elevation };
  }
}

const gpt = {
  lunarAzimuthElevation: (localDate, localTime, latDeg, lonDeg, tzOffsetHours) => {
    const rad = Math.PI / 180;

    const { year, month, day } = localDate;
    const { hour, minute, second } = localTime;

    const utcHour = hour - tzOffsetHours;

    const dtUtc = new Date(Date.UTC(year, month - 1, day, utcHour, minute, second, 0));
    const jd = satellite.jday(dtUtc);
    const days = jd - 2451545.0;

    // mean longitude
    const L = (218.316 + 13.176396 * days) * rad;

    // mean anomaly
    const M = (134.963 + 13.064993 * days) * rad;

    // mean distance
    const F = (93.272 + 13.229350 * days) * rad;

    // mean elongation
    const D = (297.8501921 + 12.19074912 * days) * rad;

    // ecliptic longitude
    const lonEcl =
      L
      + (6.289 * rad) * Math.sin(M)
      + (1.274 * rad)  * Math.sin(2*D - M)
      + (0.658 * rad)  * Math.sin(2*D)
      + (0.214 * rad)  * Math.sin(2*M)
      + (0.110 * rad)  * Math.sin(D);

    // ecliptic latitude
    const latEcl =
      (5.128 * rad) * Math.sin(F)
      + (0.280 * rad) * Math.sin(M + F)
      + (0.277 * rad) * Math.sin(M - F)
      + (0.173 * rad) * Math.sin(2*D - F)
      + (0.055 * rad) * Math.sin(2*D + F - M)
      + (0.046 * rad) * Math.sin(2*D - F - M)
      + (0.033 * rad) * Math.sin(2*D + F)
      + (0.017 * rad) * Math.sin(2*M + F);

    // obliquity
    const e = (23.439291 - 0.0000004 * days) * rad; 

    // right ascension
    const ra = Math.atan2(
      Math.sin(lonEcl) * Math.cos(e) - Math.tan(latEcl) * Math.sin(e),
      Math.cos(lonEcl)
    );

    // declination
    const dec = Math.asin(
      Math.sin(latEcl) * Math.cos(e) +
      Math.cos(latEcl) * Math.sin(e) * Math.sin(lonEcl)
    );

    const lw = -lonDeg * rad;
    const phi = latDeg * rad;

    // sidereal time
    const H = ((280.16 + 360.9856235 * days) * rad - lw) - ra;

    const alt = Math.asin(
      Math.sin(phi) * Math.sin(dec) +
      Math.cos(phi) * Math.cos(dec) * Math.cos(H)
    );

    const az = Math.atan2(
      Math.sin(H),
      Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)
    );

    return {
      azimuth: az / rad + 180.0,
      elevation: alt / rad
    };
  }
};

const satjs = {
  satelliteAzimuthElevation: (localDate, localTime, latDeg, lonDeg, tzOffsetHours, tle) => {
    const { year, month, day } = localDate;
    const { hour, minute, second } = localTime;
    const [tleLine1, tleLine2] = tle;

    // observer
    const observerGd = {
      latitude: satellite.degreesToRadians(latDeg),
      longitude: satellite.degreesToRadians(lonDeg),
      height: 0
    };

    // local date time
    const utcHour = hour - tzOffsetHours;
    const dtUtc = new Date(Date.UTC(year, month - 1, day, utcHour, minute, second, 0));

    // GMST for some of the coordinate transforms
    const gmst = satellite.gstime(dtUtc);

    // Initialize a satellite record
    const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

    // Propagate satellite using js date
    const positionAndVelocity = satellite.propagate(satrec, dtUtc);

    // The positionAndVelocity result is a pair of ECI coordinates.
    const positionEci = positionAndVelocity.position;

    // ECF and  Look Angles
    const positionEcf = satellite.eciToEcf(positionEci, gmst);
    const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);

    return {
      azimuth: rad2deg(lookAngles.azimuth),
      elevation: rad2deg(lookAngles.elevation)
    };
  }
}
