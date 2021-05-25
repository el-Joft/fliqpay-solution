import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class CreateSupportDto {
  @IsNotEmpty({
    message: "This Field is Required"
  })
  @IsString()
  public title: string;

  @IsNotEmpty({
    message: "This Field is Required"
  })
  @IsString()
  public description: string;
}

export class UpdateSupportDto {
  @IsOptional()
  public title: string;

  @IsOptional()
  public description: string;
}
