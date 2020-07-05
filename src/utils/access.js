export function userIsAdmin({ authentication: { item: user } }) {
  return Boolean(user && user.permissions === "ADMIN");
}

export function userOwnsItem({ authentication: { item: user } }) {
  if (!user) {
    return false;
  }
  // 🚨 Returns a GraphQL `Where` object, Not a boolean
  return { user: { id: user.id } };
}

export function userIsUser({ authentication: { item: user } }) {
  return user && { id: user.id };
}

export function userIsAdminOrOwner(auth) {
  const isAdmin = userIsAdmin(auth);
  const isOwner = userOwnsItem(auth);
  return isAdmin || isOwner;
}

export function userCanAccessUsers(auth) {
  const isAdmin = userIsAdmin(auth);
  const isThemselves = userIsUser(auth);
  return isAdmin || isThemselves;
}

export function userCanUpdateItem(payload) {
  const isOwner = userOwnsItem(payload);
  const isCool = ["ADMIN", "EDITOR"].includes(
    payload.authentication.item.permissions
  );
  return isCool || isOwner || userOwnsItem(payload);
}
