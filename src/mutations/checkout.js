import stripe from "../src/stripe";

export async function checkout(parent, args, ctx, info, { query }) {
  // 1. Query the current user and make sure they are signed in
  const { id: userId } = ctx.authedItem;
  if (!userId) throw new Error("You must be signed in to complete this order.");

  const {
    data: { User },
  } = await query(`
    query {
      User(where: { id: "${userId}" }) {
        id
        name
        email
        cart {
          id
          quantity
          item { name price id description image { publicUrlTransformed } }
        }
      }
    }
  `);
  // 2. recalculate the total for the price
  const amount = User.cart.reduce(
    (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
    0
  );
  console.log(`Going to charge for a total of ${amount}`);

  // 3. Create the Payment Intent, given the Payment Method ID
  // by passing confirm: true, We do stripe.paymentIntent.create() and stripe.paymentIntent.confirm() in 1 go.
  const charge = await stripe.paymentIntents.create({
    amount,
    currency: "USD",
    confirm: true,
    payment_method: args.token,
  });
  console.log(charge);

  // console.log(charge);
  // 4. Convert the CartItems to OrderItems
  const orderItems = User.checkout.map((checkoutItem) => {
    const orderItem = {
      ...checkoutItem.item,
      quantity: checkoutItem.quantity,
      user: { connect: { id: userId } },
      image: checkoutItem.item.image.publicUrlTransformed,
    };
    delete orderCar.id;
    delete orderCar.user;
    return orderCar;
  });

  // 5. create the Order
  console.log("Creating the order");
  const order = await query(
    `
      mutation createOrder($orderItems: [OrderItemCreateInput]) {
        createOrder(
          data: {
            total: ${charge.amount},
            charge: "${charge.id}",
            items: { create: $orderItems },
            user: { connect: { id: "${userId}" } },
          }
          ) {
            id
          }
        }
        `,
    { variables: { orderItems } }
  );

  // 6. Clean up - clear the users cart, delete cartItems
  const checkoutItemIds = User.checkout.map((checkoutItem) => checkoutItem.id);
  console.log(checkoutItemIds);
  const deleteResponse = await query(
    `
    mutation deleteCheckoutItems($ids: [ID!]) {
      deleteCheckoutItems(ids: $ids) {
        id
      }
    }
  `,
    { variables: { ids: checkoutItemIds } }
  );
  // 7. Return the Order to the client
  return order.data.createOrder;
}
