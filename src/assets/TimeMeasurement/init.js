function drawtext(context, start, length, unit) {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(start.x - 20, start.y - 30);
  context.setLineDash([5, 10]);
  context.stroke();
  context.font = '18px Arial';
  context.fillText(`${length} ${unit}`, start.x - 30, start.y - 30);
  context.setLineDash([1, 0]);
}

function drawRound(context, end) {
  context.beginPath();
  context.arc(end.x, end.y, 8, 0, 2 * Math.PI);
  context.stroke();
}

export default function drawline(context, start, end, length, unit, color) {
  context.save();
  context.setLineDash([1, 0]);
  context.lineWidth = 2;
  context.strokeStyle = color;
  context.fillStyle = color;
  context.beginPath();
  context.arc(start.x, start.y, 8, 0, 2 * Math.PI);
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
  drawRound(context, end);
  drawtext(context, start, length, unit);
}
