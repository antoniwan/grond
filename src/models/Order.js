import { Text, Integer, Relationship, DateTime } from "@keystonejs/fields";
import { byTracking, atTracking } from "@keystonejs/list-plugins";
import formatMoney from "../utils/formatMoney.js";

export default {
  // We can generate the label on the fly
  labelResolver: (item) => {
    console.log(item);
    return `${formatMoney(item.total)}`;
  },
  // labelField: 'charge',
  fields: {
    total: { type: Integer },
    cars: {
      type: Relationship,
      ref: "CheckoutItem",
      many: true,
    },
    user: {
      type: Relationship,
      ref: "User",
    },
    charge: { type: Text },
    createdAt: {
      type: DateTime,
      format: "MM/DD/YYYY h:mm A",
      yearRangeFrom: 1901,
      yearRangeTo: 2018,
      yearPickerType: "auto",
    },
  },
  access: {
    create: true,
    read: true,
    update: true,
    delete: true,
  },
  plugins: [atTracking(), byTracking()],
};
