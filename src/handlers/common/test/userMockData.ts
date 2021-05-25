export const userData = {
  agent1: {
    firstName: "Phoenix",
    lastName: "Davies",
    password: "223344",
    email: "phoenix.davies@example.com"
    // isAdmin: true
  },
  agent2: {
    firstName: "Paige",
    lastName: "Taylor",
    password: "54623",
    email: "paige.taylor@example.com"
    // isAdmin: true
  },
  user1: {
    firstName: "Jane",
    lastName: "Doe",
    password: "password",
    email: "janedoe@gmail.com"
  },
  user2: {
    firstName: "Cathy",
    lastName: "Hale",
    password: "cathy.hale@example.com",
    email: "cathy.hale@example.com"
  }
};

export const inValidRegisterUserData = {
  invalidEmail: {
    firstName: "Phoenix",
    lastName: "Davies",
    email: "phoenix.davies",
    password: "223344"
  },
  emptyFields: {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  },
  emptyFirstName: {
    firstName: "",
    lastName: "Davies",
    email: "phoenix.davies@example.com",
    password: "223344"
  },
  emptyLastName: {
    firstName: "Phoenix",
    lastName: "",
    email: "phoenix.davies@example.com",
    password: "223344"
  },
  emptyPassword: {
    firstName: "Phoenix",
    lastName: "Davies",
    email: "phoenix.davies@example.com",
    password: ""
  }
};

export const invalidLoginUserData = {
  invalidEmail: {
    email: "phoenix.davies",
    password: "223344"
  },
  emptyEmail: {
    email: "",
    password: "223344"
  },
  empytyFields: {
    email: "",
    password: ""
  },
  invalidPassword: {
    email: "phoenix.davies@example.com",
    password: ""
  },
  doesNotExistEmail: {
    email: "fliqpay@fliqpay.com",
    password: "23323232323"
  }
};
