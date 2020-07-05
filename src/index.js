import "dotenv/config";
import { Keystone } from "@keystonejs/keystone";
import Auth from "@keystonejs/auth-password";
import { GraphQLApp } from "@keystonejs/app-graphql";
import { AdminUIApp } from "@keystonejs/app-admin-ui";
import { MongooseAdapter as Adapter } from "@keystonejs/adapter-mongoose";
import expressSession from "express-session";
import MongoStoreMaker from "connect-mongo";
import Car from "./models/Car";
import User from "./models/User";
import CheckoutItem from "./models/CheckoutItem";
import OrderCar from "./models/OrderCar";
import Order from "./models/Order";
import * as mutations from "./mutations";

const MongoStore = MongoStoreMaker(expressSession);

const PROJECT_NAME = "grond";

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(),
  secureCookies: false,
  // 🚨 Persist logins when Grond restarts!
  sessionStore: new MongoStore({ url: process.env.DATABASE_URL }),
  async onConnect() {
    if (process.argv.includes("--dummy")) {
      console.log("🚨🚨🚨INSERTING DUMMY DATA🚨🚨🚨");
      const { cars } = await import("./src/dummy.js");
      const Item = keystone.adapters.MongooseAdapter.mongoose.model("Car");
      await Item.insertMany(items);
      console.log(
        "🚨🚨🚨DUMMY DATA ADDED! Start the process with `yarn dev`🚨🚨🚨"
      );
      process.exit();
    }
  },
});

keystone.createList("User", User);
// keystone.createList("Car", Car);
//keystone.createList("CheckoutItem", CheckoutItem);
//keystone.createList("OrderCar", OrderCar);
//keystone.createList("Order", Order);

const authStrategy = keystone.createAuthStrategy({
  type: Auth.PasswordAuthStrategy,
  list: "User",
});

keystone.extendGraphQLSchema({
  types: [{ type: "type Message { message: String }" }],
  queries: [
    {
      schema: "me: User",
      resolver(parent, args, ctx, info) {
        return ctx.authedItem;
      },
    },
  ],
  mutations: [
    // {
    //   schema: "addToCheckout(id: ID): CheckoutItem",
    //   resolver: mutations.addToCart,
    // },
    // {
    //   schema: "checkout(token: String!): Order",
    //   resolver: mutations.checkout,
    // },
    {
      schema: "requestReset(email: String!): Message",
      resolver: mutations.requestReset,
    },
    {
      schema:
        "resetPassword(resetToken: String!, password: String!, confirmPassword: String!): Message",
      resolver: mutations.resetPassword,
    },
  ],
});

const apps = [new GraphQLApp(), new AdminUIApp({ authStrategy })];

const configureExpress = (app) => {
  app.set("trust proxy", 1);
};

export { keystone, apps, configureExpress };
