// TODO:
// options: { dayStep, secondStep, tle }
function allVisible(year, month, nDays, location, toAzEl, dayStep=1, secondStep=60, tle=null) {
  const paths = [];

  const localTime = { hour: 0, minute: 0, second: 0 };
  const localDate = { year: year, month: month, day: 1 };

  let cPath = null;
  let pElevation = -1;

  for (let day = 1; day <= nDays; day += dayStep) {
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
  return paths;
}
