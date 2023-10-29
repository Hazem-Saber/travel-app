function checkDate(date) {
  const inputDate = new Date(date); 
  const currentDate = new Date();

  if (inputDate > currentDate) return true;
  else return false;
}

export { checkDate }