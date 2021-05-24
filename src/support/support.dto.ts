import { IsString, IsOptional } from "class-validator";

export class CreateSupportDto {
  @IsString({
    message: "This Field is Required"
  })
  public title: string;

  @IsString({
    message: "This Field is Required"
  })
  public description: string;
}

export class UpdateSupportDto {
  @IsOptional()
  public title: string;

  @IsOptional()
  public description: string;
}
