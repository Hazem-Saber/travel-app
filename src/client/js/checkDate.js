function checkDate(currentDate, tripDate) {
  if (tripDate > currentDate) return true
  else return false
}

export { checkDate }