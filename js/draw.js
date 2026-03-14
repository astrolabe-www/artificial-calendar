function drawElevationRings(rad) {
  push();
  stroke(0, 255);
  ellipse(0, 0, 2 * rad, 2 * rad);

  stroke(0, 32);
  for (let deg = 15; deg < 90; deg += 15) {
    // const mRadius = rad * Math.cos(deg/180 * Math.PI);
    const mRadius = map(deg, 0, 90, rad, 0);
    ellipse(0, 0, 2 * mRadius, 2 * mRadius);
  }

  for (let deg = 0; deg < 360; deg += 15) {
    line(10, 0, rad+10, 0);
    rotate(15);
  }

  pop();
}

function azel2xy(az, el, rad) {
  // const r = rad * Math.cos(el / 180 * Math.PI);
  const r = map(el, 0, 90, rad, 0);
  const theta = az - 90;
  const x = r * cos(theta);
  const y = r * sin(theta);
  return { x, y };
};

function drawPath(path, diam, c, rad) {
  push();
  noFill();
  stroke(c);
  strokeWeight(diam);
  beginShape();
  path.path.forEach(({ azimuth, elevation }) => {
    const { x, y } = azel2xy(azimuth, elevation, rad);
    vertex(x, y);
  });
  endShape();
  pop();
}

function drawName(path, name, c, rad) {
  const { azimuth, elevation } = path.path[0];
  const { x, y } = azel2xy(azimuth, elevation, rad);
  push();
  if (x > 0) {
    textAlign(LEFT, TOP);
    text(name+"\n"+path.start, x+10, y);
  } else {
    textAlign(RIGHT, TOP);
    text(name+"\n"+path.start, x-10, y);
  }
  pop();
}

function drawNames(names, rad) {
  push();

  names.forEach(({ name, loc, date, color }, idx) => {
    fill(color);
    const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);
    if (idx % 3 == 1) {
      textAlign(CENTER, BOTTOM);
      text(name, x - 10, y - 10);
    } else {
      textAlign(CENTER, TOP);
      text(name, x - 10, y + 10);
    }
  });
  pop();
}

function drawLabels(labels, rad) {
  const tr = labels.filter(({ loc }) => loc.azimuth < 90 ).toSorted((a,b) => a.loc.azimuth - b.loc.azimuth);
  const br = labels.filter(({ loc }) => loc.azimuth > 90 && loc.azimuth < 180 ).toSorted((a,b) => b.loc.azimuth - a.loc.azimuth);
  const bl = labels.filter(({ loc }) => loc.azimuth > 180 && loc.azimuth < 270 ).toSorted((a,b) => a.loc.azimuth - b.loc.azimuth);
  const tl = labels.filter(({ loc }) => loc.azimuth > 270 ).toSorted((a,b) => b.loc.azimuth - a.loc.azimuth);

  push();
  textAlign(RIGHT, BOTTOM);
  tr.forEach(({ name, loc, date, color }, idx) => {
    const labelText = `${name}: ${date.replace("\n", " ")}`;
    const labelWidth = -textWidth(labelText) - 2;
    const tx = width/2 - 2;
    const ty = -height/2 + idx * 32 + 12 + 14;
    const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

    color.setAlpha(255);
    fill(color);
    noStroke();
    text(labelText, tx, ty);

    color.setAlpha(128);
    stroke(color);
    line(tx + 0.75*labelWidth, ty + 2, tx + labelWidth, ty + 2);
    line(tx + labelWidth, ty + 2, x, y);
  });
  pop();

  push();
  textAlign(RIGHT, BOTTOM);
  br.forEach(({ name, loc, date, color }, idx) => {
    const labelText = `${name}: ${date.replace("\n", " ")}`;
    const labelWidth = -textWidth(labelText) - 2;
    const tx = width/2 - 2;
    const ty = height/2 - idx * 32 - 12;
    const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

    color.setAlpha(255);
    fill(color);
    noStroke();
    text(labelText, tx, ty);

    color.setAlpha(128);
    stroke(color);
    line(tx + 0.75*labelWidth, ty + 2, tx + labelWidth, ty + 2);
    line(tx + labelWidth, ty + 2, x, y);
  });
  pop();

  push();
  textAlign(LEFT, BOTTOM);
  bl.forEach(({ name, loc, date, color }, idx) => {
    const labelText = `${name}: ${date.replace("\n", " ")}`;
    const labelWidth = textWidth(labelText) + 2;
    const tx = -(width/2 - 2);
    const ty = height/2 - idx * 32 - 12;
    const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

    color.setAlpha(255);
    fill(color);
    noStroke();
    text(labelText, tx, ty);

    color.setAlpha(128);
    stroke(color);
    line(tx + 0.75*labelWidth, ty + 2, tx + labelWidth, ty + 2);
    line(tx + labelWidth, ty + 2, x, y);
  });
  pop();

  push();
  textAlign(LEFT, BOTTOM);
  tl.forEach(({ name, loc, date, color }, idx) => {
    const labelText = `${name}: ${date.replace("\n", " ")}`;
    const labelWidth = textWidth(labelText) + 2;
    const tx = -(width/2 - 2);
    const ty = -height/2 + idx * 32 + 12 + 14;
    const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

    color.setAlpha(255);
    fill(color);
    noStroke();
    text(labelText, tx, ty);

    color.setAlpha(128);
    stroke(color);
    line(tx + 0.75*labelWidth, ty + 2, tx + labelWidth, ty + 2);
    line(tx + labelWidth, ty + 2, x, y);
  });
  pop();
}
