export async function addToCheckout(parent, args, ctx, info, { query }) {
  // 1. Make sure they are signed in
  const { id: userId } = ctx.authedItem;
  if (!userId) {
    throw new Error("You must be signed in soooon");
  }
  // 2. Query the users current cart
  const {
    data: { allCheckoutItems },
  } = await query(`
    query {
      allCheckoutItems(where: {
          user: { id: "${userId}" },
          car: { id: "${args.id}" },
      }) {
        id
        quantity
      }
    }
  `);

  const [existingCheckoutItem] = allCheckoutItems;

  // 3. Check if that item is already in their cart and increment by 1 if it is
  if (existingCheckoutItem) {
    console.log(
      `There are already ${existingCheckoutItem.quantity} of these cars in their cart`
    );
    const res = await query(
      `
      mutation {
        updateCheckoutItem(
          id: "${existingCheckoutItem.id}",
          data: { quantity: ${existingCheckoutItem.quantity + 1}}
        ) {
          id
          quantity
        }
      }
    `,
      { context: ctx }
    );
    return res.data.updateCheckoutItem;
  }
  // 4. If its not, create a fresh CartItem for that user!
  const CREATE_CHECKOUT_ITEM_MUTATION = `
    mutation {
      createCheckoutItem(data: {
        car: { connect: { id: "${args.id}" }},
        user: { connect: { id: "${userId}" }}
      }) {
        id
        quantity
      }
    }
  `;
  const res = await query(CREATE_CHECKOUT_ITEM_MUTATION, {
    context: ctx,
  });
  return res.data.createCheckoutItem;
}
