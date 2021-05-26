import dotenv from "dotenv";
dotenv.config();
import dbConnection from "../config/db_connection";
import faker from "faker";
import { hashPassword } from "../utils/password";

import User from "../user/user.model";
import Support from "../support/support.model";
import Comment from "../comment/comment.model";

async function seedDB() {
  console.log("Connected correctly to server");
  try {
    dbConnection().then(async () => {
      await User.deleteMany({});
      await Support.deleteMany({});
      await Comment.deleteMany({});

      console.log("Commencing Data Seed");

      let userData = [];
      for (let i = 0; i < 5; i++) {
        const data = {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: await hashPassword(faker.internet.password()),
          isAdmin: faker.datatype.boolean(),
          createdAt: faker.datatype.datetime()
        };
        userData.push(data);
      }
      await User.insertMany(userData);
      userData.map(async item => {
        const support = new Support({
          title: faker.lorem.text(),
          description: faker.lorem.sentence(),
          createdBy: await User.findOne({ email: item.email })
        });
        const createdSupport = await support.save();
        const comment = new Comment({
          comment: faker.lorem.sentence(),
          createdBy: await User.findOne({ email: item.email })
        });
        const createdComment = await comment.save();
        createdSupport.comments!.push(createdComment);
      });
      console.log("Seed Completed");
    });

    // client.close();
  } catch (err) {
    console.log(err.stack);
  }
}
seedDB();
