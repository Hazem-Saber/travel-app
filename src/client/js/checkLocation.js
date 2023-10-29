function checkLocation(value) {
  const letters = /^[A-Za-z]+$/;
  if(value.match(letters)) return true;
  else return false;
}

export { checkLocation }