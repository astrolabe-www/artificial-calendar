async function getTlesFromUrl(url) {
  const tleRes = await fetch(url);
  const tleTxt = await tleRes.text();
  const tleLines = tleTxt.split("\n");

  const tles = [];

  for (let ln = 0; ln+2 < tleLines.length; ln += 3) {
    tles.push({
      name: tleLines[ln + 0].trim(),
      tle: [
        tleLines[ln + 1].trim(),
        tleLines[ln + 2].trim(),
      ]
    });
  }
  return tles;
}

function getVisiblePaths(year, month, location, toAzEl, options) {
  const paths = [];

  const localTime = { hour: 0, minute: 0, second: 0 };
  const localDate = { year: year, month: month, day: 1 };
  const { numDays=28, dayStep=1, secondStep=60, tle=null } = options;

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
        if (pElevation < 0) {
          cPath = { path: [] };
          cPath.start = new Date(localDate.year, localDate.month - 1, day, localTime.hour, localTime.minute, localTime.second, 0);
        }
        cPath.path.push({ azimuth, elevation });
        cPath.end = new Date(localDate.year, localDate.month - 1, day, localTime.hour, localTime.minute, localTime.second, 0);
      } else {
        if (pElevation > 0) {
          paths.push(structuredClone(cPath));
          cPath = null;
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

function getStationaryPaths(year, month, location, toAzEl, options) {
  const visiblePaths = getVisiblePaths(year, month, location, toAzEl, options);

  // TODO: average locations
  //       keep points close 1-std from average

  return visiblePaths;
}

function getHighestElevation(path) {
  return path.reduce((acc, azel) => min(acc, azel.elevation), 0);
}

function getHighestPath(paths) {
  return paths.reduce((acc, path) => getHighestElevation(path.path) > getHighestElevation(acc.path) ? path : acc);
}
