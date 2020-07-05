import { Integer, Text } from "@keystonejs/fields";
import Car from "./Car";
// OrderItems shares the same fields as Cars
// For this reason, WE COPY IT!
export default {
  ...Car,
  fields: {
    ...Car.fields,
    quantity: { type: Integer, isRequired: true },
    image: { type: Text },
  },
};
