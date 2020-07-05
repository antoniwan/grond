export async function resetPassword(parent, args, ctx, info, { query }) {
  console.log(args);
  console.info("Checking if passwords do match");
  if (args.password !== args.confirmPassword) {
    throw new Error("Passwords do NOT match");
  }
  console.info("Checking if token is valid");
  const userResponse = await query(`query {
    allUsers(where: {
      resetToken: "${args.resetToken}",
    }) {
      id
      resetTokenExpiry
    }
  }`);
  const [user] = userResponse.data.allUsers;
  if (!user) {
    throw new Error("Invalid token");
  }
  console.info("Check if user token is expired");
  const now = Date.now();
  const expiry = new Date(user.resetTokenExpiry).getTime();
  if (now - expiry > 3600000) {
    throw new Error("Expired token");
  }
  console.log(`Saving the new password`);
  const updatedUserResponse = await query(`
    mutation {
      updateUser(
        id: "${user.id}",
        data: {
          password: "${args.password}",
          resetToken: null,
          resetTokenExpiry: null,
        }
      ) {
        password_is_set
        name
      }
    }
  `);
  const { errors, data } = updatedUserResponse;
  if (errors) {
    throw new Error(errors);
  }
  console.info("Password succesffuly reset");
  return {
    message: "Your password has been reset",
  };
}
