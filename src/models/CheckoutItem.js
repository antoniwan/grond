import { Integer, Relationship } from "@keystonejs/fields";
import { graphql } from "graphql";
import { byTracking, atTracking } from "@keystonejs/list-plugins";
import { userIsAdminOrOwner } from "../utils/access";

export default {
  labelResolver: async (CheckoutItem, args, context, { schema }) => {
    console.log(CheckoutItem);
    const query = `
      query getCar($carId: ID!) {
        Car(where: { id: $carId }) {
          name
        }
      }
    `;
    const variables = { carId: checkoutItem.car.toString() };
    const { data } = await graphql(schema, query, null, context, variables);
    console.log(data);
    return `🛒 ${checkoutItem.quantity} of ${data.Car.name}`;
  },
  fields: {
    quantity: { type: Integer, isRequired: true, defaultValue: 1 },
    car: {
      type: Relationship,
      ref: "Car",
      isRequired: true,
    },
    user: {
      type: Relationship,
      ref: "User.checkout",
      isRequired: true,
    },
  },
  access: {
    create: userIsAdminOrOwner,
    read: userIsAdminOrOwner,
    update: userIsAdminOrOwner,
    delete: userIsAdminOrOwner,
  },
  plugins: [atTracking(), byTracking()],
};
