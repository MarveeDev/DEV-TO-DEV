import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
