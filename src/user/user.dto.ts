import { IsString, IsEmail } from "class-validator";

export class CreateUserDto {
  @IsString({
    message: "This Field is Required"
  })
  public firstName: string;

  @IsString({
    message: "This Field is Required"
  })
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsString({
    message: "This Field is Required"
  })
  public password: string;
}

export class LoginUserDto {
  @IsString({
    message: "This Field is Required"
  })
  @IsEmail()
  public email: string;

  @IsString({
    message: "This Field is Required"
  })
  public password: string;
}
