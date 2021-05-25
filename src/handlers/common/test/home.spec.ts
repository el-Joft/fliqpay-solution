import supertest from "supertest";
const baseUrl = "/api/v1";

import app from "../../../app";
const request = supertest(app);

describe("Test Home Route", () => {
  it("should return 404 for visiting a random endpoint on the app", async function(done) {
    const res = await request.get(`${baseUrl}/dummy`);
    expect(res.status).toEqual(404);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual(
      "Route not found, Kindly check the documentation"
    );
    done();
  });

  it("should return success on hitting the home route", async function(done) {
    const res = await request.get("/");
    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.data.message).toEqual(
      "Welcome to Fliqpay assessment solution"
    );

    done();
  });
});
