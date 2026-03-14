function dateToString(date) {
  const isoDate = date.toISOString().split(".")[0];
  return isoDate.replace("T", "\n");
}

function getVisiblePaths(year, month, location, toAzEl, options) {
  const paths = [];

  const localTime = { hour: 0, minute: 0, second: 0 };
  const localDate = { year: year, month: month, day: 1 };
  const { numDays = 28, dayStep = 1, secondStep:secondStep0 = 60, tle = null } = options;

  let secondStep = secondStep0;

  let cPath = null;
  let pElevation = -1;

  for (let day = 1; day <= numDays; day += dayStep) {
    localDate.day = day;

    for (let daySecond = 0; daySecond < 86400; daySecond += secondStep) {
      const fracMinutes = daySecond % 3600;
      localTime.hour = parseInt(daySecond / 3600);
      localTime.minute = parseInt(fracMinutes / 60);
      localTime.second = parseInt(fracMinutes % 60);

      const { azimuth, elevation } = toAzEl(localDate, localTime, location, tle);
      if (elevation >= 0) {
        if (secondStep > secondStep0) {
          daySecond -= secondStep;
          secondStep = secondStep0;
          continue;
        }

        if (pElevation < 0) {
          cPath = { path: [] };
          const startDate = new Date(localDate.year, localDate.month - 1, day, localTime.hour, localTime.minute, localTime.second, 0);
          cPath.start = dateToString(startDate);
        }
        cPath.path.push({ azimuth, elevation });
        const endDate = new Date(localDate.year, localDate.month - 1, day, localTime.hour, localTime.minute, localTime.second, 0);
        cPath.end = dateToString(endDate);
      } else {
        if (pElevation > 0) {
          paths.push(structuredClone(cPath));
          cPath = null;
          secondStep *= 15;
        }
      }
      pElevation = elevation;
    }
  }

  if (cPath) {
    paths.push(structuredClone(cPath));
    cPath = null;
  }

  return paths;
}

function getStationaryPath(year, month, location, toAzEl, options) {
  const visiblePaths = getVisiblePaths(year, month, location, toAzEl, options);

  visiblePaths.forEach(path => {
    const { sumAz, sumEl } = path.path.reduce((acc, loc) => ({ sumAz: acc.sumAz + loc.azimuth, sumEl: acc.sumEl + loc.elevation }), { sumAz: 0, sumEl: 0 });
    const avgAz = sumAz / path.path.length;
    const avgEl = sumEl / path.path.length;
    path.path = path.path.filter(loc => (Math.abs(loc.azimuth - avgAz) < 1) && (Math.abs(loc.elevation - avgEl) < 1))
  });

  const validPaths = visiblePaths.filter(path => path.path.length > 0);

  if (validPaths.length < 1) {
    return {};
  } else if (validPaths.length < 2) {
    return validPaths[0];
  } else {
    const combinedPaths = validPaths.reduce((acc, path) => ({ path: acc.path.concat(path.path), start: acc.start, end: acc.end }));
    return combinedPaths;
  }
}

function getHighestElevation(path) {
  return path.reduce((acc, azel) => max(acc, azel.elevation), 0);
}

function getHighestLowestPaths(paths) {
  paths.forEach(p => {
    p.high = getHighestElevation(p.path);
  });

  const highest = paths.reduce((acc, path) => path.high > acc.high ? path : acc);
  const lowest = paths.filter(path => path.high > 5).reduce((acc, path) => path.high < acc.high ? path : acc);

  return [highest, lowest];
}

function getMostVisited(sats) {
  const byPathCount = sats.toSorted((a, b) => b.paths.length - a.paths.length);
  return byPathCount[0];
}

function getMostVisitedHighestLowestPaths(year, month, location, tles, options) {
  const allSats = tles.map(s => {
    options["tle"] = s.tle;
    return {
      name: s.name,
      paths: getVisiblePaths(year, month, location, satjs.satelliteAzimuthElevation, options),
    };
  });

  const mostVisited = getMostVisited(allSats);
  const [mostVisitedHighest, mostVisitedLowest] = getHighestLowestPaths(mostVisited.paths);

  return { name: mostVisited.name, highestPath: mostVisitedHighest, lowestPath: mostVisitedLowest };
}
