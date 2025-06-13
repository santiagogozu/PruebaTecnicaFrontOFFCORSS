import User from "../models/user.js";
import bcrypt from "bcrypt";

const resolvers = {
  Query: {
    getUsers: async () => {
      return await User.findAll();
    },
    login: async (_, {username, password}) => {
      const user = await User.findOne({where: {username}});
      if (!user) throw new Error("Usuario no encontrado");
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Contraseña incorrecta");
      return "Login exitoso"; // Aquí podrías retornar un token JWT
    },
  },
  Mutation: {
    createUser: async (
      _,
      {username, name, lastName, email, userType, password}
    ) => {
      const hash = await bcrypt.hash(password, 10);
      return await User.create({
        username,
        name,
        lastName,
        email,
        userType,
        password: hash,
      });
    },
    updateUser: async (
      _,
      {id, username, name, lastName, email, userType, password}
    ) => {
      const user = await User.findByPk(id);
      if (!user) throw new Error("Usuario no encontrado");
      if (username) user.username = username;
      if (name) user.name = name;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (userType) user.userType = userType;
      if (password) user.password = await bcrypt.hash(password, 10);
      await user.save();
      return user;
    },
    deleteUser: async (_, {id}) => {
      const deleted = await User.destroy({where: {id}});
      return deleted > 0;
    },
  },
};

export default resolvers;
