import { IsString } from "class-validator";

export class CreateCommentDto {
  @IsString({
    message: "This Field is Required"
  })
  public comment: string;
}
