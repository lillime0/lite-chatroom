export const users = [];

export const getUser = id => users.find(user => user.id === id);

export const addUser = (id, username) => {
  if (!id || !username) return;
  username = username.trim();
  const existingUser = users.find(user => user.username === username);
  if (existingUser) return;
  const user = { id, username };
  users.push(user);
  return user;
};

export const removeUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};
