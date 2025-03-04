export function today() {
  const dateString = new Date().toLocaleDateString();
  const dateArr = dateString.split("/");
  const year = dateArr[2];
  const month = dateArr[1];
  const day = dateArr[0];
  return `${day}-${month}-${year}`;
}
