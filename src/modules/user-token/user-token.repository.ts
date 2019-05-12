import { Injectable } from '@nestjs/common';
import { UserToken } from './user-token.model';
import UserTokenEntity from './user-token.entity';

@Injectable()
export class UserTokenRepository {
  public async create(model: UserToken): Promise<UserToken> {
    const entity = this.toEntity(model);
    const result = await entity.save();
    return this.toModel(result);
  }

  public async deleteByUserId(id: number): Promise<any > {
    return await UserTokenEntity.destroy({ where: { userId: id }})
  }

  public async deleteByUserIdAndKey(id: number, key: string): Promise<any> {
    return await UserTokenEntity.destroy({
      where: {
        userId: id,
        key
      }
    })
  }

  public async findByUserId(userId: number): Promise<UserToken> {
    const result = await UserTokenEntity.findOne({ where: { userId }});
    if(result) {
      return this.toModel(result);
    }
    return null;
  }

  public async findByUserIdAndKey(userId: number, key: string): Promise<UserToken> {
    const result = await UserTokenEntity.findOne({ where: { userId, key }});
    if(result) {
      return this.toModel(result);
    }
    return null;
  }

  private toEntity(model: UserToken, entity?: UserTokenEntity) {
    if(!entity) {
      entity = new UserTokenEntity();
    }

    entity.id = model.id;
    entity.key = model.key;
    entity.token = model.token;
    entity.userId = model.userId;
    entity.createdAt = model.create;
    entity.expires = model.expires;
    
    return entity;
  }

  private toModel(entity: UserTokenEntity) {
    return new UserToken({
      id: entity.id,
      create: entity.create,
      expires: entity.expires,
      key: entity.key,
      token: entity.token,
      userId: entity.userId
    })
  }
}
