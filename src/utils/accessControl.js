export function userIsAdmin({ authentication: { item: user } }) {
  return Boolean(user && user.permissions === "ADMIN");
}

export function userIsUser({ authentication: { item: user } }) {
  return user && { id: user.id };
}

export function userCanAccessUsers(auth) {
  const isAdmin = userIsAdmin(auth);
  const isThemselves = userIsUser(auth);
  return isAdmin || isThemselves;
}
