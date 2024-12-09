import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User, UserDocument } from '@schemas/users.schema';
import { Model } from 'mongoose';
import { MailtrapClient } from 'mailtrap';
import { CreateUserDto } from '@dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Create a new user.
   * @param createUserDto User data transfer object
   * @returns Newly created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    if (!email) throw new BadRequestException('Email is required');
    if (!password) throw new BadRequestException('Password is required');

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser)
      throw new ConflictException('User with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  /**
   * Retrieve all users.
   * @returns List of users
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * Validate a user's credentials.
   * @param email User email
   * @param password User password
   * @returns Validated user
   */
  async validateUser(email: string, password: string): Promise<User> {
    if (!email || !password)
      throw new BadRequestException('Email and password are required');

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Account does not exist');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Password is incorrect');

    return user;
  }

  /**
   * Generate a login token for a user.
   * @param user User object
   * @returns JWT access token
   */
  async login(user: User) {
    const payload = { email: user.email, sub: user["_id"] };
    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * Send a verification code to the user's email.
   * @param email User email
   * @returns Confirmation message
   */
  async getVerificationCode(email: string): Promise<{ message: string }> {
    if (!email) throw new BadRequestException('Email is required');

    const code = Math.floor(100000 + Math.random() * 900000);
    const codeAt = new Date();

    const user = await this.userModel
      .findOneAndUpdate(
        { email },
        { code, codeAt },
        { new: true, upsert: false },
      )
      .exec();

    if (!user) throw new NotFoundException('Account does not exist');

    const client = new MailtrapClient({ token: process.env.HOST_PASS });

    try {
      await client.send({
        from: {
          email: 'safetypro@adamocode.me',
          name: 'SafetyPro',
        },
        to: [{ email }],
        template_uuid: process.env.VERIFICATION_TEMPLATE_UUID,
        template_variables: {
          company_info_name: process.env.COMPANY_NAME,
          first_name: user.email,
          last_name: code.toString(),
          company_info_country: process.env.COMPANY_COUNTRY,
          company_info_phone: process.env.COMPANY_PHONE,
          email: process.env.COMPANY_EMAIL,
        },
      });
      return { message: 'Verification code sent' };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new BadRequestException('Failed to send verification code');
    }
  }

  /**
   * Verify the user's email using the code.
   * @param code Verification code
   * @param email User email
   * @returns Confirmation message
   */
  async verifyEmail(code: string, email: string): Promise<{ message: string }> {
    if (!code || !email)
      throw new BadRequestException('Code and email are required');

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('Account does not exist');

    if (user.codeAt) {
      const now = new Date();
      const codeAgeInMinutes =
        Math.abs(now.getTime() - user.codeAt.getTime()) / (1000 * 60);
      if (codeAgeInMinutes > 30)
        throw new BadRequestException('Code has expired');
    }

    if (user.code !== code) throw new BadRequestException('Code is invalid');

    await this.userModel
      .findByIdAndUpdate(
        user._id,
        {
          code: null,
          codeAt: null,
          verified: true,
          forgetPassword: true,
        },
        { new: true, upsert: false },
      )
      .exec();

    return { message: 'Code verified' };
  }

  /**
   * Reset the user's password.
   * @param email User email
   * @param password New password
   * @returns Confirmation message
   */
  async resetPassword(
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    if (!email || !password)
      throw new BadRequestException('Email and password are required');

    const user = await this.userModel.findOne({ email }).exec();
    if (!user || !user.forgetPassword)
      throw new BadRequestException('Invalid reset request');

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel
      .findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
          forgetPassword: false,
        },
        { new: true, upsert: false },
      )
      .exec();

    return { message: 'Password reset successful' };
  }
}
