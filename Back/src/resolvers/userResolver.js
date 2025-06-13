import User from "../models/user.js";
import bcrypt from "bcrypt";

const resolvers = {
  Query: {
    getUsers: async () => {
      return await User.findAll();
    },
    login: async (_, {correo, password}) => {
      const user = await User.findOne({where: {correo}});
      if (!user) throw new Error("Usuario no encontrado");
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Contraseña incorrecta");
      return "Login exitoso"; // Aquí podrías retornar un token JWT
    },
  },
  Mutation: {
    createUser: async (_, {correo, password}) => {
      const hash = await bcrypt.hash(password, 10);
      return await User.create({correo, password: hash});
    },
    updateUser: async (_, {id, correo, password}) => {
      const user = await User.findByPk(id);
      if (!user) throw new Error("Usuario no encontrado");
      if (correo) user.correo = correo;
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
