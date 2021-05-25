import supertest from "supertest";
import Comment from "../comment.model";
import Support from "../../support/support.model";
import User from "../../user/user.model";
import mongoose from "mongoose";
import { userData } from "../../handlers/common/test/userMockData";
import { supportData } from "../../handlers/common/test/supportMockData";
import {
  commentData,
  inValidCommentData
} from "../../handlers/common/test/commentMockData";

const baseUrl = "/api/v1";

import app from "../../app";
const request = supertest(app);

describe("Support Test", () => {
  let user1Token: string;
  let user2Token: string;
  let adminStaffToken: string;
  let support3: any;
  let support2: any;
  beforeAll(async function(done) {
    await User.deleteMany({});
    await Support.deleteMany({});
    await Comment.deleteMany({});
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

  describe("Test Create implementation on Comment", function() {
    it("It should return 201 on sucessfully creating a new comment", async function(done) {
      const supportId = support2.body.support._id;
      const response = await request
        .post(`${baseUrl}/user/support/${supportId}/comment`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${adminStaffToken}`)
        .send(commentData.comment1);
      expect(response.status).toEqual(201);
      expect(response.body.success).toEqual(true);
      expect(response.body.message).toEqual("Comment Created Successfully");
      expect(response.body).toHaveProperty("comment");
      done();
    });
    it("should return error when comment field is invalid", async done => {
      const supportId = support2.body.support._id;
      const response = await request
        .post(`${baseUrl}/user/support/${supportId}/comment`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${adminStaffToken}`)
        .send(inValidCommentData.invalidComment);
      expect(response.status).toEqual(422);
      expect(response.body.errors[0].message).toBe("This Field is Required");
      expect(response.body.success).toBe(false);
      done();
    });
    it("should return error when support id does not exist", async done => {
      const response = await request
        .post(`${baseUrl}/user/support/60a8df0f6bea876e2131ffe0/comment`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)
        .send(commentData.comment2);
      expect(response.status).toEqual(404);
      expect(response.body.message).toBe(
        "Support with this ID 60a8df0f6bea876e2131ffe0 does not exists"
      );
      done();
    });
    it("should return error for support that the user did not create", async done => {
      const supportId = support2.body.support._id;
      const response = await request
        .post(`${baseUrl}/user/support/${supportId}/comment`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user2Token}`)
        .send(commentData.comment2);
      expect(response.status).toEqual(403);
      expect(response.body.message).toBe(
        "You are not allowed to comment on this Support"
      );
      done();
    });

    it("should return error when no admin has commented", async done => {
      const supportId = support3.body.support._id;
      const response = await request
        .post(`${baseUrl}/user/support/${supportId}/comment`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${user1Token}`)
        .send(commentData.comment3);
      expect(response.status).toEqual(400);
      expect(response.body.message).toBe(
        "No admin has commented on this support"
      );
      done();
    });
    it("should throw error for a closed support", async done => {
      const data = {
        title: "testy",
        description: "Nemoer"
      };
      const toCloseSupport = await request
        .post(`${baseUrl}/support`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${adminStaffToken}`)
        .send(data);
      const id = toCloseSupport.body.support._id;
      await Support.findOneAndUpdate({ _id: id }, { status: "CLOSED" });

      const response = await request
        .post(`${baseUrl}/user/support/${id}/comment`)
        .set("Content-Type", "application/json")
        .set("authorization", `Bearer ${adminStaffToken}`)
        .send(commentData.comment4);
      expect(response.status).toEqual(400);
      expect(response.body.message).toBe(
        "You cannot comment on a closed Support"
      );
      done();
    });
  });
});
