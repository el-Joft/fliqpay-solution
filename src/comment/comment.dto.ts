import { IsNotEmpty } from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty({
    message: "This Field is Required"
  })
  public comment: string;
}
