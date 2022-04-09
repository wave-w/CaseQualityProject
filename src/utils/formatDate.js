export default function formatDate(time) {
  const date = new Date(Number(time));
  const YY = date.getFullYear();
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const DD = date.getDate().toString().padStart(2, '0');
  const HH = date.getHours().toString().padStart(2, '0');
  const FF = date.getMinutes().toString().padStart(2, '0');
  const SS = date.getSeconds().toString().padStart(2, '0');

  return `${YY}-${MM}-${DD} ${HH}:${FF}:${SS}`;
}
