// generate random number using limit
function getRanNum(limit: number) {
  return Math.floor(Math.random() * limit);
}

// generate random alphabate
function getRanAlp(char: string) {
  return String.fromCharCode(char.charCodeAt(0) + getRanNum(26));
}

// generate random string and number together
function generateRandom() {
  return `${getRanAlp("A")}${getRanNum(10)}${getRanAlp("A")}${getRanAlp(
    "a"
  )}${getRanNum(10)}`;
}

type Role = "resident" | "guard" | "admin";

// generate dynamically Society-Id for all type users
function genSelfIdForSociety(
  role: Role,
  firstName: string,
  lastName: string,
  societyName: string
) {
  const societyArr = societyName.split(" ");
  const AprtName = societyArr[0][0] + societyArr[1][0];

  const slot = {
    resident: "RSDT",
    guard: "GRD",
    admin: "ADMIN",
  };

  const shortName = firstName[0] + lastName[0];
  const ranStr = generateRandom();

  return `${AprtName.toUpperCase()}-${
    slot[role]
  }-${shortName.toUpperCase()}-${ranStr}`;
}

// generate initial password when all typed user is created
function genInitialPass() {
  const symbl = "@#$&";
  let dummyPass = "";

  dummyPass = dummyPass + getRanAlp("A");

  for (let i = 0; i < 3; i++) {
    dummyPass += getRanAlp("a");
  }

  dummyPass += symbl[getRanNum(4)];

  for (let i = 0; i < 3; i++) {
    dummyPass += getRanNum(10).toString();
  }

  return dummyPass;
}

// generate verify token-(6 digit number) to change forgot password
function genVerifyToken() {
  let store = "";
  for (let i = 0; i < 6; i++) {
    store += Math.floor(Math.random() * 10).toString();
  }

  return store;
}

// exports
export { genSelfIdForSociety, genInitialPass, genVerifyToken };
