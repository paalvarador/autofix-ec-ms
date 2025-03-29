import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

type UserWithoutPassword = Omit<User, 'password'>;

export class UserEntity implements UserWithoutPassword {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: Role = 'CUSTOMER';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
