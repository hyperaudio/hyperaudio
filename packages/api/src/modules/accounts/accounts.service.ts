import * as uuid from 'uuid';
import * as urlSafeBase64 from 'urlsafe-base64';
import * as jwt from 'jsonwebtoken';

import { Model, PassportLocalDocument } from 'mongoose';
// import * as passportLocalMongoose from 'passport-local-mongoose';
// import * as authenticate from 'passport-local-mongoose/authenticate';
import { Component, Inject } from '@nestjs/common';
import { Account } from './interfaces/account.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';


@Component()
export class AccountsService {
  constructor(
    @Inject('AccountModelToken') private readonly accountModel: Model<Account>) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createdAccount = new this.accountModel(createAccountDto);
    createdAccount._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));

    return await createdAccount.save();
  }

  async update(updateAccountDto: UpdateAccountDto): Promise<Account> {
    const updatedAccount = new this.accountModel(updateAccountDto);
    return await updatedAccount.save();
  }

  // async remove(id: String): Promise<any> {
  //   return await this.accountModel.findByIdAndRemove(id).exec();
  // }

  // async find(query: any): Promise<Account[]> {
  //   console.log(query);
  //   return await this.accountModel.find(query).select('-hash -salt -token').exec();
  // }

  async findById(id): Promise<Account> {
    return await this.accountModel.findById(id).select('-hash -salt -token').exec();
  }

  async createToken(username, password) {
    const user = await this.accountModel.findOne({ username }).exec();
    if (! user) return {};

    const authenticated = await new Promise((resolve, reject) => {
      user.authenticate(password, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    if (! authenticated) return {};

    const expiresIn = 60 * 60, secretOrKey = process.env.JWT_SECRET;
    const payload = { user: username };
    const token = jwt.sign(payload, secretOrKey, { expiresIn });
    return { expiresIn, token, user: username };
  }
}
