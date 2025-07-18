import { ApiProperty } from '@nestjs/swagger';
import { UserRole, User } from '@prisma/client';

type UserWithoutPassword = Omit<User, 'password'>;

export class UserEntity implements UserWithoutPassword {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string | null;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  role: UserRole = 'CUSTOMER';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  workshopId: string | null;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedBy: string;

  @ApiProperty()
  workshopsId: string | null;

  @ApiProperty()
  resetPasswordToken: string | null;

  @ApiProperty()
  resetPasswordExpires: Date | null;
}
