import { IsInt, IsIn, IsNotEmpty } from 'class-validator';

export class VoteDto {
  @IsInt()
  @IsNotEmpty()
  @IsIn([1, -1])
  value: number;
}
