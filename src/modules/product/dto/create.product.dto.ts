import { IsNotEmpty } from "class-validator";
export class createProductDTO {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    price: number;
    @IsNotEmpty()
    avatar: string;

}