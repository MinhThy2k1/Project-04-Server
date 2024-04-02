import { Allow, IsEmail, IsNotEmpty } from "class-validator";

export class UpdateAddressDTO {
    @Allow()
    address: string;
}