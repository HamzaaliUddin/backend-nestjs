export class UserResponseDto {
  id!: string;
  name!: string;
  email!: string;
  passwordHash!: string;
}
export type UserIdDto = UserResponseDto['id'];
