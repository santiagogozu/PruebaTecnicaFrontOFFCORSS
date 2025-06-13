import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "tu_clave_secreta"; // Usa una variable de entorno en producción

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
      // Retorna token y datos del usuario
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
          createDate: user.createDate,
        },
        SECRET,
        {expiresIn: "1h"}
      );
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
          createDate: user.createDate,
        },
      };
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
