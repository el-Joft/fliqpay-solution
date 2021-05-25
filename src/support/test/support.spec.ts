import supertest from "supertest";
import Support from "../support.model";
import User from "../../user/user.model";
import mongoose from "mongoose";

import {
  supportData,
  inValidSupportData,
  supportDataToUpdate
} from "../../handlers/common/test/supportMockData";
import { userData } from "../../handlers/common/test/userMockData";

const baseUrl = "/api/v1";

const fakeToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
  ".eyJpZCI6NCwiaWF0IjoxNTM5MDIxMjY1LCJleHAiOjE1Mzk2MjYwNjV9" +
  ".ErGsV_EppHmfSdvAGBkmVwL_BjGdujyLh7k1wkG_vXo";

import app from "../../app";
const request = supertest(app);

describe("Support Test", () => {
  let user1Token: string;
  let user2Token: string;
  let adminStaffToken: string;
  let support3: any;
  let support4: any;
  let support2: any;
  beforeAll(async function(done) {
    await User.deleteMany({});
    await Support.deleteMany({});
    const user1 = await request.post(`${baseUrl}/signup`).send(userData.user1);

    user1Token = user1.body.token.token;

    const user2 = await request.post(`${baseUrl}/signup`).send(userData.user2);

    user2Token = user2.body.token.token;

    await request.post(`${baseUrl}/signup`).send(userData.agent1);

    await User.findOneAndUpdate(
      { email: userData.agent1.email },
      { isAdmin: true }
    );

    const agent1Login = await request.post(`${baseUrl}/login`).send({
      email: userData.agent1.email,
      password: userData.agent1.password
    });

    adminStaffToken = agent1Login.body.tokenData.token;

    support3 = await request
      .post(`${baseUrl}/support`)
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${user1Token}`)

      .send(supportData.support3);

    support4 = await request
      .post(`${baseUrl}/support`)
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${user1Token}`)

      .send(supportData.support4);

    support2 = await request
      .post(`${baseUrl}/support`)
      .set("Content-Type", "application/json")
      .set("authorization", `Bearer ${user1Token}`)
      .send(supportData.support2);

    done();
  });

  afterAll(async function() {
    await User.deleteMany({});
    await Support.deleteMany({});
    await mongoose.connection.close();
  });

  describe("Test Create implementation on Support", function() {
    it("It should return 201 on sucessfully creating a new support", async function(done) {
      const response = await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)

        .send(supportData.support1);
      expect(response.status).toEqual(201);
      expect(response.body.success).toEqual(true);
      expect(response.body.message).toEqual("Support Created Successfully");
      expect(response.body).toHaveProperty("support");
      done();
    });

    it("It should return 400 when a token is not passed", async function(done) {
      const response = await request
        .post(`${baseUrl}/support`)
        .send(supportData.support1);
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual(
        "You did not provide any token, please enter token, then retry"
      );
      done();
    });

    it("should return error when title field is invalid", async done => {
      const response = await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user2Token}`)
        .send(inValidSupportData.invalidTitle);
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toBe("This Field is Required");
      expect(response.body.success).toBe(false);
      done();
    });

    it("should return error when description field is empty", async done => {
      const response = await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${adminStaffToken}`)
        .send(inValidSupportData.emptyDescription);
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toBe("This Field is Required");
      expect(response.body.success).toBe(false);
      done();
    });

    it("should return when all fields are empty", async done => {
      const response = await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${adminStaffToken}`)
        .send(inValidSupportData.emptyFields);
      expect(response.status).toEqual(422);
      expect(response.body.errors).toHaveLength(2);
      expect(response.body.success).toBe(false);
      done();
    });
  });

  describe("Test Get implementation on Support", function() {
    it("should return all support by the authenticated user", async done => {
      await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)

        .send(supportData.support2);

      const response = await request
        .get(`${baseUrl}/user/supports`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(200);
      expect(response.body.support.length).toBeGreaterThan(0);
      expect(response.body.success).toBe(true);
      done();
    });

    it("should throw error if fake token is passed", async done => {
      await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)

        .send(supportData.support2);

      const response = await request
        .get(`${baseUrl}/user/supports`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${fakeToken}`);
      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual("Invalid Token");
      done();
    });

    it("should throw error if when no bearer token is passed", async done => {
      await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)

        .send(supportData.support2);

      const response = await request
        .get(`${baseUrl}/user/supports`)
        .set("Content-Type", "application/json")
        .set("authorization", "");
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual(
        "You did not provide any token, please enter token, then retry"
      );
      done();
    });

    it("should return single support", async done => {
      const supportId = support3.body.support._id;
      const response = await request
        .get(`${baseUrl}/user/support/${supportId}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty("support");
      expect(response.body.success).toBe(true);
      done();
    });

    it("should prevent a user from view support that is not his", async done => {
      const supportId = support3.body.support._id;
      const response = await request
        .get(`${baseUrl}/user/support/${supportId}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user2Token}`);
      expect(response.status).toEqual(403);
      expect(response.body.message).toBe(
        "You are not allowed to view this Support"
      );
      done();
    });

    it("should return error for support that does not exist", async done => {
      const response = await request
        .get(`${baseUrl}/user/support/60a8df0f6bea876e2131ffe0`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe(
        "Support with this ID 60a8df0f6bea876e2131ffe0 does not exists"
      );
      done();
    });

    it("should test invalid MongoID", async done => {
      const response = await request
        .get(`${baseUrl}/user/support/60a8df0f6bea876e2131ffe0rre3`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(400);
      expect(response.body.message).toBe("ID passed is Invalid");
      done();
    });
  });
  describe("Test Delete implementation on Support", function() {
    it("should return error for support that does not exist", async done => {
      const response = await request
        .delete(`${baseUrl}/user/support/60a8df0f6bea876e2131ffe0`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe(
        "Support with this ID 60a8df0f6bea876e2131ffe0 does not exists"
      );
      done();
    });

    it("should return error for support that the user did not create", async done => {
      const supportId = support4.body.support._id;
      const response = await request
        .delete(`${baseUrl}/user/support/${supportId}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user2Token}`);
      expect(response.status).toEqual(403);
      expect(response.body.message).toBe(
        "You are not allowed to delete this Support"
      );
      done();
    });
    it("should return success upon delete by the authenticated user", async done => {
      const supportId = support4.body.support._id;
      const response = await request
        .delete(`${baseUrl}/user/support/${supportId}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(200);
      expect(response.body.success).toBe(true);
      done();
    });
  });

  describe("Test Close implementation on Support", function() {
    it("should return error for support that does not exist", async done => {
      const response = await request
        .get(`${baseUrl}/user/support/close/60a8df0f6bea876e2131ffe0`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe(
        "Support with this ID 60a8df0f6bea876e2131ffe0 does not exists"
      );
      done();
    });

    it("should return error for support that the user did not create", async done => {
      const supportId = support2.body.support._id;
      const response = await request
        .get(`${baseUrl}/user/support/close/${supportId}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user2Token}`);
      expect(response.status).toEqual(403);
      expect(response.body.message).toBe(
        "You are not allowed to close this Support"
      );
      done();
    });
    it("should return success on closing by the authenticated user or admin", async done => {
      const supportId = support2.body.support._id;
      const response = await request
        .get(`${baseUrl}/user/support/close/${supportId}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(200);
      expect(response.body.success).toBe(true);
      done();
    });
    it("should throw error for a closed support", async done => {
      const supportId = support2.body.support._id;
      const response = await request
        .get(`${baseUrl}/user/support/close/${supportId}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(400);
      expect(response.body.message).toBe("You cannot close, a CLOSED support");
      done();
    });
  });

  describe("Test Update implementation on Support", function() {
    it("should return error for support that does not exist", async done => {
      const response = await request
        .patch(`${baseUrl}/user/support/60a8df0f6bea876e2131ffe0`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe(
        "Support with this ID 60a8df0f6bea876e2131ffe0 does not exists"
      );
      done();
    });

    it("should return error for support that the user did not create", async done => {
      const supportId = support3.body.support._id;
      const response = await request
        .patch(`${baseUrl}/user/support/${supportId}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user2Token}`);
      expect(response.status).toEqual(403);
      expect(response.body.message).toBe(
        "You are not allowed to update this Support"
      );
      done();
    });

    it("should return success upon update", async done => {
      const supportId = support3.body.support._id;
      const response = await request
        .patch(`${baseUrl}/user/support/${supportId}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)
        .send(supportDataToUpdate.support1);
      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty("support");
      done();
    });
    it("should throw error for a closed support", async done => {
      const data = {
        title: "test",
        description: "Nemo"
      };
      const toCloseSupport = await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)
        .send(data);
      const id = toCloseSupport.body.support._id;
      await Support.findOneAndUpdate({ _id: id }, { status: "CLOSED" });

      const response = await request
        .patch(`${baseUrl}/user/support/${id}`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(400);
      expect(response.body.message).toBe(
        "You are not allowed to update this Support"
      );
      done();
    });
    it("should user does not exist token", async done => {
      const userDetails = {
        firstName: "Fake",
        lastName: "fake",
        email: "fake@fake.com",
        password: "1232434"
      };
      const notExistUser = await request
        .post(`${baseUrl}/signup`)
        .send(userDetails);
      const nonExistToken = notExistUser.body.token.token;
      const id = notExistUser.body.user._id;
      await User.deleteOne({ _id: id });
      const response = await request
        .get(`${baseUrl}/user/supports`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${nonExistToken}`)

        .send(supportData.support2);

      expect(response.status).toEqual(401);
      expect(response.body.message).toBe("User does not exist");
      done();
    });
  });
  describe("Test Get All implementation on Support By Admin", function() {
    it("should return error if the user is not an admin", async done => {
      const response = await request
        .get(`${baseUrl}/supports/`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);
      expect(response.status).toEqual(403);
      expect(response.body.message).toBe(
        "You are not allowed to view Support, Permission Denied"
      );
      done();
    });
    it("should return all support by the admin user", async done => {
      await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)

        .send(supportData.support2);

      const response = await request
        .get(`${baseUrl}/supports`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${adminStaffToken}`);
      expect(response.status).toEqual(200);
      expect(response.body.support.length).toBeGreaterThan(0);
      expect(response.body.success).toBe(true);
      done();
    });
  });

  describe("Test Get CSV generation implementation on Support By Admin", function() {
    it("should return error if the user is not an admin", async done => {
      const response = await request
        .get(`${baseUrl}/download/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`);

      expect(response.status).toEqual(403);
      expect(response.body.message).toBe(
        "You are not allowed to view Support, Permission Denied"
      );
      done();
    });

    it("should return error for support that does not exist", async done => {
      const response = await request
        .get(
          `${baseUrl}/download/support/?startDate=1845-05-05&endDate=1945-07-01`
        )
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${adminStaffToken}`);

      expect(response.status).toEqual(404);
      expect(response.body.message).toBe(
        "No Closed Support within the time frame selected"
      );
      done();
    });
    it("should return success for generating report support", async done => {
      const toCloseSupport = await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)
        .send(supportData.support6);
      const id = toCloseSupport.body.support._id;
      await Support.findOneAndUpdate({ _id: id }, { status: "CLOSED" });
      const response = await request
        .get(`${baseUrl}/download/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${adminStaffToken}`);

      expect(response.status).toEqual(200);

      done();
    });
  });
});
