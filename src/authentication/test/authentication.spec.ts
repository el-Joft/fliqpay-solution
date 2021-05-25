import supertest from "supertest";
import User from "../../user/user.model";
import mongoose from "mongoose";
import {
  userData,
  inValidRegisterUserData,
  invalidLoginUserData
} from "../../handlers/common/test/userMockData";

const baseUrl = "/api/v1";

import app from "../../app";
const request = supertest(app);

describe("User Authentication Test", () => {
  beforeAll(async function() {
    await User.deleteMany({});
  });

  afterAll(async function() {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("User Registration", function() {
    it("It should return 201 on sucessfully creating a new user", async function(done) {
      const response = await request
        .post(`${baseUrl}/signup`)
        .send(userData.agent1);
      expect(response.status).toEqual(201);
      expect(response.body.success).toEqual(true);
      expect(response.body.message).toEqual("User Created Successfully");
      expect(response.body).toHaveProperty("token");
      done();
    });

    it("should return error if user enters an existing email", async done => {
      const response = await request
        .post(`${baseUrl}/signup`)
        .send(userData.agent1);
      expect(response.status).toEqual(400);
      expect(response.body.message).toBe(
        `User with this email ${userData.agent1.email} already exists`
      );
      done();
    });

    it("should return error when email field is invalid", async done => {
      const response = await request
        .post(`${baseUrl}/signup`)
        .send(inValidRegisterUserData.invalidEmail);
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toBe("email must be an email");
      expect(response.body.success).toBe(false);
      done();
    });

    it("should return error when firstName field is empty", async done => {
      const response = await request
        .post(`${baseUrl}/signup`)
        .send(inValidRegisterUserData.emptyFirstName);
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toBe("This Field is Required");
      expect(response.body.success).toBe(false);
      done();
    });

    it("should return error when lastName field is empty", async done => {
      const response = await request
        .post(`${baseUrl}/signup`)
        .send(inValidRegisterUserData.emptyLastName);
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toBe("This Field is Required");
      expect(response.body.success).toBe(false);
      done();
    });

    it("should return error when password field is empty", async done => {
      const response = await request
        .post(`${baseUrl}/signup`)
        .send(inValidRegisterUserData.emptyLastName);
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toBe("This Field is Required");
      expect(response.body.success).toBe(false);
      done();
    });

    it("should return when all fields are empty", async done => {
      const response = await request
        .post(`${baseUrl}/signup`)
        .send(inValidRegisterUserData.emptyFields);
      expect(response.status).toEqual(422);
      expect(response.body.errors).toHaveLength(4);
      expect(response.body.success).toBe(false);
      done();
    });
  });

  describe("User Login", function() {
    it("should return 200 on sucessfully login in a new user", async done => {
      const data = {
        email: userData.agent1.email,
        password: userData.agent1.password
      };
      const response = await request.post(`${baseUrl}/login`).send(data);
      expect(response.status).toEqual(200);
      expect(response.body.success).toEqual(true);
      expect(response.body.tokenData).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(userData.agent1.email);
      done();
    });

    it("should return error when user does not exist", async done => {
      const data = {
        email: invalidLoginUserData.doesNotExistEmail.email,
        password: invalidLoginUserData.doesNotExistEmail.password
      };
      const response = await request.post(`${baseUrl}/login`).send(data);
      expect(response.status).toEqual(400);
      expect(response.body.message).toBe("Invalid Login Details");
      done();
    });

    it("should return error when email field is invalid", async done => {
      const response = await request
        .post(`${baseUrl}/login`)
        .send(invalidLoginUserData.emptyEmail);
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toBe("email must be an email");
      expect(response.body.success).toBe(false);
      done();
    });
    it("should return error when email field is invalid", async done => {
      const response = await request
        .post(`${baseUrl}/login`)
        .send(invalidLoginUserData.invalidPassword);
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toBe("This Field is Required");
      expect(response.body.success).toBe(false);
      done();
    });
  });
});
