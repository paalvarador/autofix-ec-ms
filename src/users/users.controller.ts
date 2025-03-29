import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { ExcludePasswordInterceptor } from 'src/exclude-password-interceptor/exclude-password-interceptor.interceptor';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'User successfully created',
    schema: {
      example: {
        message: 'User created successfully',
        user: {
          id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Missing or invalid fields',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid user data',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Unexpected server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Something went wrong, please try again later',
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @UseInterceptors(ExcludePasswordInterceptor)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @UseInterceptors(ExcludePasswordInterceptor)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @UseInterceptors(ExcludePasswordInterceptor)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @UseInterceptors(ExcludePasswordInterceptor)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
