import { UserInterface } from "./interface";

export interface IUserRepo {
  findUser(emai:String ): Promise<UserInterface | null>;

  }