import {
  Text,
  Select,
  Password,
  Checkbox,
  // Relationship,
} from "@keystonejs/fields";
import { byTracking, atTracking } from "@keystonejs/list-plugins";
import { DateTimeUtc } from "@keystonejs/fields-datetime-utc";

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
    permissions: {
      type: Select,
      defaultValue: "USER",
      options: ["ADMIN", "DEALER", "VIEWER", "USER"],
    },
    resetToken: { type: Text, unique: true },
    resetTokenExpiry: { type: DateTimeUtc, unique: true },
  },
  access: {
    create: true,
    // TODO: 🚨 Only Admins may see the full list of users!
    read: true,
    update: true,
    delete: true,
  },
  plugins: [atTracking(), byTracking()],
};
