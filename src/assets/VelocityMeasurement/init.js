function drawtext(context, end, length, unit) {
  context.beginPath();
  context.moveTo(end.x, end.y);
  context.lineTo(end.x - 20, end.y - 30);
  context.setLineDash([5, 10]);
  context.stroke();
  context.font = '18px Arial';
  context.fillText(`${length} ${unit}`, end.x - 30, end.y - 30);
  context.setLineDash([1, 0]);
}

function drawRound(context, end) {
  context.beginPath();
  context.arc(end.x, end.y, 10, 0, 2 * Math.PI);
  context.stroke();
}

export default function drawline(context, start, end, length, unit, color) {
  context.save();
  context.setLineDash([1, 0]);
  context.lineWidth = 2;
  context.strokeStyle = color;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(end.x, end.y);
  context.stroke();
  drawRound(context, end);
  drawtext(context, end, length, unit);
}
