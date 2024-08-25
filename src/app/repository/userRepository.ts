import UserModel from "../../entities/user";
import { UserData, UserInterface } from "../../Interfaces/interface";
import { IUserRepo } from "../../Interfaces/IUserRepo";
import { hashPassword } from "../../utils/passwordHashing";

export default class UserRepository implements IUserRepo{
    findUser = async (email: string): Promise<UserData | null> => {
        try {
            const user = await UserModel.findOne({ email }).exec();
            return user as UserData | null;
        } catch (error) {
            console.error("Error finding user:", error);
            return null;
        }
    }
    saveUser = async (data: UserInterface): Promise<UserData | null> => {
        try {
            const { otp, ...userWithoutOtp } = data;
            userWithoutOtp.password = await hashPassword(data.password);
            console.log(userWithoutOtp,"ithu pass");
            const user = new UserModel(userWithoutOtp);
            const savedUser = await user.save() as UserData
            return savedUser;
        } catch (error) {
            console.error("Error finding user:", error);
            return null;
        }
    }
}
