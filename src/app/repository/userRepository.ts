import UserModel from "../../entities/user";
import { UserInterface } from "../../Interfaces/interface";
import { IUserRepo } from "../../Interfaces/IUserRepo";

export default class UserRepository implements IUserRepo{
    findUser = async (email: string): Promise<UserInterface | null> => {
        try {
            const user = await UserModel.findOne({ email }).exec();
            return user as UserInterface | null;
        } catch (error) {
            console.error("Error finding user:", error);
            return null;
        }
    }
}
