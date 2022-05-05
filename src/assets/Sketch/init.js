function drawline(context, start, end, color) {
  context.save();
  context.lineWidth = 2;
  context.strokeStyle = color;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.closePath();
  context.stroke();
}

export default drawline;
