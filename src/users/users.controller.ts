import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  @ApiNotFoundResponse({
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
  @ApiOperation({ summary: 'Find a list of users' })
  @ApiCreatedResponse({
    description: 'Users found successfully',
    schema: {
      example: {
        message: 'Users found successfully',
        user: [
          {
            id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@email.com',
            phone: '0987817811',
            role: 'CUSTOMER',
            createdAt: '2025-03-29T06:39:31.161Z',
            updatedAt: '2025-03-29T06:39:31.161Z',
          },
        ],
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
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by id' })
  @ApiCreatedResponse({
    description: 'User found successfully',
    schema: {
      example: {
        message: 'User found successfully',
        user: {
          id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@email.com',
          phone: '0987817811',
          role: 'CUSTOMER',
          createdAt: '2025-03-29T06:39:31.161Z',
          updatedAt: '2025-03-29T06:39:31.161Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User wit ID 1d95a1ba-fa4a-4e79-926b-df28cb571d6e not found',
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
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by Id ' })
  @ApiCreatedResponse({
    description: 'User updated successfully',
    schema: {
      example: {
        message: 'User updated successfully',
        user: {
          id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@email.com',
          phone: '0987817811',
          role: 'CUSTOMER',
          createdAt: '2025-03-29T06:39:31.161Z',
          updatedAt: '2025-03-29T06:39:31.161Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with ID 1d95a1ba-fa4a-4e79-926b-df28cb571d6e not found',
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
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by Id' })
  @ApiCreatedResponse({
    description: 'User deleted successfully',
    schema: {
      example: {
        message: 'User deleted successfully',
        user: {
          id: '1d95a1ba-fa4a-4e79-926b-df28cb571d6e',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: `User with ID 1d95a1ba-fa4a-4e79-926b-df28cb571d6e not found`,
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
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
