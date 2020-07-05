import { promisify } from "util";
import { randomBytes } from "crypto";
import { transport, makeANiceEmail } from "../src/mail";

export async function requestReset(parent, args, ctx, info, { query }) {
  const response = await query(
    `query {
      allUsers(where: { email: "${args.email}" }) {
        email
        id
      }
    }`
  );

  const [user] = response.data.allUsers;
  if (!user) {
    throw new Error(`No user found for: ${args.email}`);
  }
  const resetToken = (await promisify(randomBytes)(20)).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
  const updateResponse = await query(`mutation {
    updateUser(
      id: "${user.id}",
      data: { resetToken: "${resetToken}", resetTokenExpiry: "${resetTokenExpiry}" },
    ) {
      email
      resetToken
      resetTokenExpiry
    }
  }`);

  const mailRes = await transport.sendMail({
    from: "grond@carbuckets.com",
    to: user.email,
    subject: "Your Password Reset Token",
    html: makeANiceEmail(`Password Reset
      \n\n
      <a href="${process.env.FRONTEND_URL}/password-reset?resetToken=${resetToken}">Click here to reset your password</a>`),
  });

  // 4. Return the message
  return { message: "Check your email to reset your password" };
}
