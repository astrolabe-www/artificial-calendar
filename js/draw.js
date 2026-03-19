function drawElevationRings(rad) {
  push();
  noFill();
  stroke(0, 255);
  ellipse(0, 0, 2 * rad, 2 * rad);

  for (let deg = 15; deg < 90; deg += 15) {
    stroke(0, 32);
    noFill();
    // const mRadius = rad * Math.cos(deg/180 * Math.PI);
    const mRadius = map(deg, 0, 90, rad, 0);
    ellipse(0, 0, 2 * mRadius, 2 * mRadius);

    noStroke();
    fill(0, 32);
    textSize(14);
    textAlign(CENTER, BOTTOM);
    text(`${deg}°`, 0, -mRadius);
  }

  for (let deg = 0; deg < 360; deg += 15) {
    stroke(0, 32);
    line(10, 0, rad + 10, 0);
    if (deg % 90 != 0) {
      push();
      translate(rad + 20, 0);
      rotate(-deg);
      noStroke();
      fill(0, 32);
      textSize(14);
      textAlign(CENTER, CENTER);
      text(`${(deg+90)%360}°`, 0, 0);
      pop();
    }
    rotate(15);
  }

  noStroke();
  fill(0, 32);
  textSize(32);

  textAlign(CENTER, BOTTOM);
  text("N", 0, -rad - 20);

  textAlign(LEFT, CENTER);
  text("E", rad + 20, 0);

  textAlign(CENTER, TOP);
  text("S", 0, rad + 20);

  textAlign(RIGHT, CENTER);
  text("W", -rad - 20, 0);

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

function drawNames(names, rad) {
  push();

  names.forEach(({ name, loc, color }, idx) => {
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

  const ts = textSize();
  const lh = ts + 3;
  const ls = 8/3 * ts;

  push();
  textAlign(RIGHT, BOTTOM);
  tr.forEach(({ name, loc, date, color }, idx) => {
    const labelText = `${name}: ${date.replace("\n", " ")}`;
    const labelWidth = -textWidth(labelText) - 2;
    const tx = width/2 - 4;
    const ty = -height/2 + idx * ls + ts + lh;
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
    const tx = width/2 - 4;
    const ty = height/2 - idx * ls - ts;
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
    const tx = -(width/2 - 4);
    const ty = height/2 - idx * ls - ts;
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
    const tx = -(width/2 - 4);
    const ty = -height/2 + idx * ls + ts + lh;
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

function drawCenterLabels(labels, rad) {
  const cr = labels.filter(({ loc }) => loc.azimuth < 180).toSorted((a, b) => a.loc.azimuth - b.loc.azimuth);
  const cl = labels.filter(({ loc }) => loc.azimuth >= 180).toSorted((a, b) => b.loc.azimuth - a.loc.azimuth);

  const ts = textSize();
  const lh = ts + 3;
  const ls = 16/3 * ts;

  push();
  textAlign(RIGHT, BOTTOM);
  cr.forEach(({ name, loc, date, color }, idx) => {
    const midx = idx - cr.length / 2;
    const labelText = `${name}\n${date}`;
    const labelWidth = -textWidth(labelText) - 2;
    const tx = width / 2 - 4;
    const ty = midx * ls + ts + lh;
    const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

    color.setAlpha(255);
    fill(color);
    noStroke();
    text(labelText, tx, ty);

    color.setAlpha(128);
    stroke(color);
    line(tx + 0.75 * labelWidth, ty + 2, tx + labelWidth, ty + 2);
    line(tx + labelWidth, ty + 2, x, y);
  });
  pop();

  push();
  textAlign(LEFT, BOTTOM);
  cl.forEach(({ name, loc, date, color }, idx) => {
    const midx = idx - cr.length / 2;
    const labelText = `${name}\n${date}`;
    const labelWidth = textWidth(labelText) + 2;
    const tx = -(width/2 - 4);
    const ty = midx * ls + ts + lh;
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
