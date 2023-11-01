import { checkLocation } from "../js/checkLocation"
  
describe("Testing the checkLocation functionality", () => {
  test("Testing the checkLocation() function", () => {
    expect(checkLocation("London")).toBeTruthy();
  })

  test("Testing the checkLocation() function", () => {
    expect(checkLocation("1233512")).toBeFalsy();
  })

  test("Testing the checkLocation() function", () => {
    expect(checkLocation("")).toBeFalsy();
  })

  test("Testing the checkLocation() function", () => {
    expect(checkLocation("https://www.google.com")).toBeFalsy();
  })
}); 