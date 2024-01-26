const users = [];

// adduser

export const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  // console.log(name , "is existing user");

  if (existingUser) {
    return { error: "Username is taken" };
  }

  
  // if existing user is not there
  
  const user = { id, name, room };
  // console.log("I am called and this is ", user);

  users.push(user);

  return user; 
};

//removeuser

export const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// getuser

export const getUser = (id) => users.find((user) => user.id === id);

// getusers in room

export const getUsersInRoom = (room) => {
  users.filter((user) => user.room === room);
  return users;
};
