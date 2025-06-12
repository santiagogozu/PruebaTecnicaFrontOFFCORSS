import UserModel from "../models/UserModel.js";

class UserService {
  async create(user) {
    return (await UserModel.create(user)).toJSON();
  }

  async getAll() {
    return UserModel.findAll();
  }

  async getById(id) {
    return (await UserModel.findOne({where: {id: id}})).toJSON();
  }
}

export default new UserService();
