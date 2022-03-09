export const ErrorMessages = [
  { code: "missing:value", message: "There is a value missing!" },
  { code: "short:value", message: "There is a value too short in length!" },
  {
    code: "existing:username",
    message:
      "There is already a user with that username! Please try another one.",
  },
  {
    code: "existing:email",
    message: "There is already a user with that email! Please try another one.",
  },
  {
    code: "existing:card",
    message: "Card with given number already exists! Cannot add duplicates.",
  },
  {
    code: "create:failed",
    message: "Account creation went wrong! Please try again.",
  },
  {
    code: "invalid:user",
    message: "Something went wrong, user was not found!",
  },
  {
    code: "invalid:email",
    message: "Invalid e-mail address! Please try again.",
  },
  {
    code: "invalid:amount",
    message:
      "You can select minimum 1 or maximum 1000 items of the same type, or maximum available items in stock!",
  },
];
