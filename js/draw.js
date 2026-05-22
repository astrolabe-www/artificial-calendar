function drawElevationRings(p) {
  return (rad) => {
    p.push();
    p.noFill();
    p.stroke(0, 255);
    p.ellipse(0, 0, 2 * rad, 2 * rad);

    for (let deg = 15; deg < 90; deg += 15) {
      p.stroke(0, 32);
      p.noFill();
      // const mRadius = rad * Math.cos(d2a(deg));
      const mRadius = rad - rad * (deg / 90);
      p.ellipse(0, 0, 2 * mRadius, 2 * mRadius);

      p.noStroke();
      p.fill(0, 32);
      p.textSize(14);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text(`${deg}°`, 0, -mRadius);
    }

    for (let deg = 0; deg < 360; deg += 15) {
      p.stroke(0, 32);
      p.line(10, 0, rad + 10, 0);
      if (deg % 90 != 0) {
        p.push();
        p.translate(rad + 20, 0);
        p.rotate(-deg);
        p.noStroke();
        p.fill(0, 32);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(`${(deg + 90) % 360}°`, 0, 0);
        p.pop();
      }
      p.rotate(15);
    }

    p.noStroke();
    p.fill(0, 32);
    p.textSize(32);

    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("N", 0, -rad - 20);

    p.textAlign(p.LEFT, p.CENTER);
    p.text("E", rad + 20, 0);

    p.textAlign(p.CENTER, p.TOP);
    p.text("S", 0, rad + 20);

    p.textAlign(p.RIGHT, p.CENTER);
    p.text("W", -rad - 20, 0);

    p.pop();
  };
}

const d2a = (d) => d * Math.PI / 180.0;

function azel2xy(az, el, rad) {
  // const r = rad * Math.cos(d2a(el));
  const r = rad - rad * (el / 90);
  const theta = az - 90;
  const x = r * Math.cos(d2a(theta));
  const y = r * Math.sin(d2a(theta));
  return { x, y };
};

function drawPath(p) {
  return (path, diam, c, rad) => {
    p.push();
    p.noFill();
    p.stroke(c);
    p.strokeWeight(diam);
    p.beginShape();
    path.path.forEach(({ azimuth, elevation }) => {
      const { x, y } = azel2xy(azimuth, elevation, rad);
      p.vertex(x, y);
    });
    p.endShape();
    p.pop();
  };
}

function drawNames(p) {
  return (names, rad) => {
    p.push();

    names.forEach(({ name, loc, color }, idx) => {
      p.fill(color);
      const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);
      if (idx % 3 == 1) {
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(name, x - 10, y - 10);
      } else {
        p.textAlign(p.CENTER, p.TOP);
        p.text(name, x - 10, y + 10);
      }
    });
    p.pop();
  };
}

function drawLabels(p) {
  return (labels, rad) => {
    const tr = labels.filter(({ loc }) => loc.azimuth < 90).toSorted((a, b) => a.loc.azimuth - b.loc.azimuth);
    const br = labels.filter(({ loc }) => loc.azimuth > 90 && loc.azimuth < 180).toSorted((a, b) => b.loc.azimuth - a.loc.azimuth);
    const bl = labels.filter(({ loc }) => loc.azimuth > 180 && loc.azimuth < 270).toSorted((a, b) => a.loc.azimuth - b.loc.azimuth);
    const tl = labels.filter(({ loc }) => loc.azimuth > 270).toSorted((a, b) => b.loc.azimuth - a.loc.azimuth);

    const ts = p.textSize();
    const lh = ts + 3;
    const ls = 8 / 3 * ts;

    p.push();
    p.textAlign(p.RIGHT, p.BOTTOM);
    tr.forEach(({ name, loc, date, color }, idx) => {
      const labelText = `${name}: ${date.replace("\n", " ")}`;
      const labelWidth = -p.textWidth(labelText) - 2;
      const tx = p.width / 2 - 4;
      const ty = -p.height / 2 + idx * ls + ts + lh;
      const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

      p.fill(color);
      p.noStroke();
      p.text(labelText, tx, ty);

      color.setAlpha(128);
      p.stroke(color);
      p.line(tx + 0.75 * labelWidth, ty + 2, tx + labelWidth, ty + 2);
      p.line(tx + labelWidth, ty + 2, x, y);
      color.setAlpha(255);
    });
    p.pop();

    p.push();
    p.textAlign(p.RIGHT, p.BOTTOM);
    br.forEach(({ name, loc, date, color }, idx) => {
      const labelText = `${name}: ${date.replace("\n", " ")}`;
      const labelWidth = -p.textWidth(labelText) - 2;
      const tx = p.width / 2 - 4;
      const ty = p.height / 2 - idx * ls - ts;
      const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

      p.fill(color);
      p.noStroke();
      p.text(labelText, tx, ty);

      color.setAlpha(128);
      p.stroke(color);
      p.line(tx + 0.75 * labelWidth, ty + 2, tx + labelWidth, ty + 2);
      p.line(tx + labelWidth, ty + 2, x, y);
      color.setAlpha(255);
    });
    p.pop();

    p.push();
    p.textAlign(p.LEFT, p.BOTTOM);
    bl.forEach(({ name, loc, date, color }, idx) => {
      const labelText = `${name}: ${date.replace("\n", " ")}`;
      const labelWidth = p.textWidth(labelText) + 2;
      const tx = -(p.width / 2 - 4);
      const ty = p.height / 2 - idx * ls - ts;
      const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

      p.fill(color);
      p.noStroke();
      p.text(labelText, tx, ty);

      color.setAlpha(128);
      p.stroke(color);
      p.line(tx + 0.75 * labelWidth, ty + 2, tx + labelWidth, ty + 2);
      p.line(tx + labelWidth, ty + 2, x, y);
      color.setAlpha(255);
    });
    p.pop();

    p.push();
    p.textAlign(p.LEFT, p.BOTTOM);
    tl.forEach(({ name, loc, date, color }, idx) => {
      const labelText = `${name}: ${date.replace("\n", " ")}`;
      const labelWidth = p.textWidth(labelText) + 2;
      const tx = -(p.width / 2 - 4);
      const ty = -p.height / 2 + idx * ls + ts + lh;
      const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

      p.fill(color);
      p.noStroke();
      p.text(labelText, tx, ty);

      color.setAlpha(128);
      p.stroke(color);
      p.line(tx + 0.75 * labelWidth, ty + 2, tx + labelWidth, ty + 2);
      p.line(tx + labelWidth, ty + 2, x, y);
      color.setAlpha(255);
    });
    p.pop();
  };
}

function drawCenterLabels(p) {
  return (labels, rad) => {
    const cr = labels.filter(({ loc }) => loc.azimuth < 180).toSorted((a, b) => a.loc.azimuth - b.loc.azimuth);
    const cl = labels.filter(({ loc }) => loc.azimuth >= 180).toSorted((a, b) => b.loc.azimuth - a.loc.azimuth);

    const ts = p.textSize();
    const lh = ts + 3;
    const ls = 16 / 3 * ts;

    p.push();
    p.textAlign(p.RIGHT, p.BOTTOM);
    cr.forEach(({ name, loc, date, color }, idx) => {
      const midx = idx - cr.length / 2;
      const labelText = `${name}\n${date}`;
      const labelWidth = -p.textWidth(labelText) - 2;
      const tx = p.width / 2 - 4;
      const ty = midx * ls + ts + lh;
      const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

      p.fill(color);
      p.noStroke();
      p.text(labelText, tx, ty);

      color.setAlpha(128);
      p.stroke(color);
      p.line(tx + 0.75 * labelWidth, ty + 2, tx + labelWidth, ty + 2);
      p.line(tx + labelWidth, ty + 2, x, y);
      color.setAlpha(255);
    });
    p.pop();

    p.push();
    p.textAlign(p.LEFT, p.BOTTOM);
    cl.forEach(({ name, loc, date, color }, idx) => {
      const midx = idx - cr.length / 2;
      const labelText = `${name}\n${date}`;
      const labelWidth = p.textWidth(labelText) + 2;
      const tx = -(p.width / 2 - 4);
      const ty = midx * ls + ts + lh;
      const { x, y } = azel2xy(loc.azimuth, loc.elevation, rad);

      p.fill(color);
      p.noStroke();
      p.text(labelText, tx, ty);

      color.setAlpha(128);
      p.stroke(color);
      p.line(tx + 0.75 * labelWidth, ty + 2, tx + labelWidth, ty + 2);
      p.line(tx + labelWidth, ty + 2, x, y);
      color.setAlpha(255);
    });
    p.pop();
  };
}

export { azel2xy, drawElevationRings, drawPath, drawLabels, drawNames, drawCenterLabels };
