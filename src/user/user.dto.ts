import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({
    message: "This Field is Required"
  })
  @IsString()
  public firstName: string;

  @IsNotEmpty({
    message: "This Field is Required"
  })
  @IsString()
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsNotEmpty({
    message: "This Field is Required"
  })
  public password: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty({
    message: "This Field is Required"
  })
  public password: string;
}
