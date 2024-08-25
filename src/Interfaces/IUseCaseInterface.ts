import { UserInterface } from "./interface";

export interface IUseCaseInterface {
  register(data:UserInterface ): Promise<{ status: number; message: string } | null>;
    
  }