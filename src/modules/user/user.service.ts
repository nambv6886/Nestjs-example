import { Injectable, Inject } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UserRepository } from './user.repository';
import { UserRoleService } from '../user-role/user-role.service';
import { UserModel } from './user.model';
import { ResponseMessage } from '../../common/models/response-message';
import { ResponseCode } from '../../common/models/response-code';
import { UserRoleModel } from '../user-role/user-role.model';
import { ROLE_ID, ACTIVE_HASH_SALT, VERIFY_MAIL_SUBJECT, DOMAIN } from '../../config/environment';
import { ActiveCodePayload } from '../../common/models/ActiveCodePayload';
import { EmailService } from '../email/email.service';
import { RegisterRequest } from '../../common/models/user';
import logger from '../../common/utils/logger';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(UserRoleService) private readonly userRoleService: UserRoleService,
    @Inject(EmailService) private readonly emailService: EmailService
  ) { }

  public async create(user: RegisterRequest): Promise<ResponseMessage> {
    try {
      const { email } = user;
      const userFound = await this.userRepository.findByEmail(email);
      if (userFound) {
        return new ResponseMessage({
          status: ResponseCode.Invalid,
          message: 'Invalid'
        })
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(user.password, salt);
      const randomNumber = await bcrypt.genSalt();
      const newUser = new UserModel({
        email: user.email,
        password: hashPassword,
        salt,
        activeCode: randomNumber,
        name: user.name,
        is_confirm_email: 0
      })
      const userSave = await this.userRepository.create(newUser);
      if (!userSave) {
        return new ResponseMessage({
          status: ResponseCode.Fail,
          message: 'Account create fail'
        })
      }

      const newUserRole = new UserRoleModel({
        roleId: ROLE_ID,
        userId: userSave.id
      })
      const roleSave = await this.userRoleService.create(newUserRole);
      if (!roleSave) {
        return new ResponseMessage({
          status: ResponseCode.Fail,
          message: 'Role create fail'
        })
      }

      await this.sendEmailVerify(userSave, DOMAIN);

      return new ResponseMessage({
        status: ResponseCode.Success,
        message: 'Account created successfully'
      })
    } catch (err) {
      logger.error(`[UserService][CreateUser] Error: ${JSON.stringify(err)}`)
      return new ResponseMessage({
        status: ResponseCode.Fail,
        message: 'Common error'
      })
    }
  }

  public async findByEmail(email: string): Promise<UserModel> {
    return this.userRepository.findByEmail(email);
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public async findAll(user: UserModel): Promise<UserModel[]> {
    logger.info(`[UserService][FindAll]: ${user.email} do get all user`);
    return await this.userRepository.findAll();
  }

  public async findById(id: number): Promise<UserModel> {
    return await this.userRepository.findById(id);
  }

  public async update(user: UserModel): Promise<UserModel> {
    return await this.userRepository.update(user);
  }

  public async delete(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }

  private sendEmailVerify(user: UserModel, baseUrl) {
    const receiver = user.email;
    const subject = VERIFY_MAIL_SUBJECT;
    const verifyUrl = `${baseUrl}/verify-account?code=${user.activeCode}`;
    const content = `Please verify your email account ${verifyUrl}`;

    this.emailService.sendMail(receiver, subject, content);
  }
}
