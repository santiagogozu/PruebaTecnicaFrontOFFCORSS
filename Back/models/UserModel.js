import {DataTypes} from "sequelize";
import db from "../config/database.js";

const UserModel = db.define(
  "UserModel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

export default UserModel;
