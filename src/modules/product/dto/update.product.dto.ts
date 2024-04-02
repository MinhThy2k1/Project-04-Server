import { IsNotEmpty } from "class-validator";
export class updateProductDTO {
    @IsNotEmpty()
    hide: boolean;

}