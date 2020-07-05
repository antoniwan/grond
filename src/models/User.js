import {
  Text,
  Select,
  Password,
  Checkbox,
  Relationship,
} from "@keystonejs/fields";
import { byTracking, atTracking } from "@keystonejs/list-plugins";
import { DateTimeUtc } from "@keystonejs/fields-datetime-utc";
import { userIsAdmin, userCanAccessUsers } from "../utils/access";

export default {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: { type: Checkbox },
    password: {
      type: Password,
    },
    checkout: {
      type: Relationship,
      ref: "CheckoutItem.user",
      many: true,
    },
    permissions: {
      type: Select,
      defaultValue: "USER",
      options: ["ADMIN", "EDITOR", "USER"],
    },
    resetToken: { type: Text, unique: true },
    resetTokenExpiry: { type: DateTimeUtc, unique: true },
  },
  access: {
    create: true,
    // 🚨 Only Admins may see the full list of users!
    read: userCanAccessUsers,
    update: userCanAccessUsers,
    delete: userIsAdmin,
  },
  plugins: [atTracking(), byTracking()],
};
