import { IsNotEmpty } from "class-validator";
export class updateReceiptDTO {
    @IsNotEmpty()
    paid: boolean;

}