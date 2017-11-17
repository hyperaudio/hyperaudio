import * as uuid from 'uuid';
import * as urlSafeBase64 from 'urlsafe-base64';
import * as jwt from 'jsonwebtoken';
import * as mandrill from 'mandrill-api/mandrill';

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

  // async create(createAccountDto: CreateAccountDto): Promise<Account> {
  //   const createdAccount = new this.accountModel(createAccountDto);
  //   createdAccount._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));
  //
  //   return await createdAccount.save();
  // }

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
    if (! user) return { error: 'loginFormError' };

    const authenticated = await new Promise((resolve, reject) => {
      user.authenticate(password, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    if (! authenticated) return { error: 'loginFormError' };

    const expiresIn = 3600 * 24 * 30;
    const secretOrKey = process.env.JWT_SECRET;
    const payload = { user: username, id: user._id };
    const token = jwt.sign(payload, secretOrKey, { expiresIn });
    return { exp: expiresIn, token, user: username, id: user._id };
  }

  async updateEmail(email, password, id, namespace) {
    if (await this.accountModel.findOne({ email }).exec()) {
      return { error: 'changeEmailError'};
    }

    const account = await this.accountModel.findById(id).exec();
    const authenticated = await new Promise((resolve, reject) => {
      account.authenticate(password, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    if (! authenticated) return { error: 'changeEmailError' };

    const expiresIn = 3600 * 24 * 2;
    const secretOrKey = process.env.JWT_SECRET;
    const payload = { id, email, user: account.username };
    const token = jwt.sign(payload, secretOrKey, { expiresIn });

    let domain = process.env.DOMAIN;
    if (namespace) domain = `${namespace}.${domain}`;

    const mandrillClient = new mandrill.Mandrill(process.env.MANDRILL);
    const message = {
        html: `<p>
                Hello. You are receiving this email because somebody (hopefully you) told us they wished to change their email. If you did not, please feel free to ignore this communication.
               </p>
               <p>
                <a href="https://${domain}/token/${token}">Click here to confirm that this is your new email address.</a>
               </p>
               <p>The Hyperaud.io Team</p>`,
        text: `Hello. You are receiving this email because somebody (hopefully you) told us they wished to change their email. If you did not, please feel free to ignore this communication.
               Click here to confirm that this is your new email address https://${domain}/token/${token}
               The Hyperaud.io Team`,
        subject: 'Hyperaud.io email validation',
        from_email: 'mark+email@hyperaud.io',
        from_name: 'Hyperaud.io',
        to: [{
          email: account.email,
          name: account.username,
          type: 'to'
        }],
        headers: { "Reply-To": "mark+email@hyperaud.io" },
        important: false,
        track_opens: null,
        track_clicks: null,
        auto_text: null,
        auto_html: null,
        inline_css: null,
        url_strip_qs: null,
        preserve_recipients: null,
        view_content_link: null,
        tracking_domain: null,
        signing_domain: null,
        return_path_domain: null,
        merge: false,
        tags: [ 'password-resets' ]
      };

    mandrillClient.messages.send({"message": message, "async": false, "ip_pool": "Main Pool"}, result => {
      console.log(result);
      return result;
    }, error => {
      console.log(error);
      return { error };
    });
  }

  async updateEmailToken(token) {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return { error: 'invalid token' };
    }

    const account = await this.accountModel.findById(decoded.id).exec();
    account.email = decoded.email;
    return await account.save();
  }

  async resetPassword(email, namespace) {
    const account = await this.accountModel.findOne({ email }).exec();
    if (! account) return { error: 'passwordFormError' };

    const expiresIn = 3600 * 24 * 2;
    const secretOrKey = process.env.JWT_SECRET;
    const payload = { id: account._id, user: account.username };
    const token = jwt.sign(payload, secretOrKey, { expiresIn });

    let domain = process.env.DOMAIN;
    if (namespace) domain = `${namespace}.${domain}`;

    const mandrillClient = new mandrill.Mandrill(process.env.MANDRILL);
    const message = {
      html: `<p>
              Hello. You are receiving this email because somebody (hopefully you) told us they had forgotten their password. If you did not, please feel free to ignore this communication.
             </p>
             <p>
              <a href='https://${domain}/token/${token}'>Click here to choose a new password.</a>
             </p>
             <p>The Hyperaud.io Team</p>
             <p>PS Your username is ${account.username}</p>`,
      text: `Hello. You are receiving this email because somebody (hopefully you) told us they had forgotten their password. If you did not, please feel free to ignore this communication.
             Click here to choose a new password https://${domain}/token/${token}
             The Hyperaud.io Team
             PS Your username is ${account.username}`,
      subject: 'Hyperaud.io password',
      from_email: 'mark+password@hyperaud.io',
      from_name: 'Hyperaud.io',
      to: [{
        email: account.email,
        name: account.username,
        type: 'to'
      }],
      headers: { "Reply-To": "mark+password@hyperaud.io" },
      important: false,
      track_opens: null,
      track_clicks: null,
      auto_text: null,
      auto_html: null,
      inline_css: null,
      url_strip_qs: null,
      preserve_recipients: null,
      view_content_link: null,
      tracking_domain: null,
      signing_domain: null,
      return_path_domain: null,
      merge: false,
      tags: [ 'password-resets' ]
    };

    mandrillClient.messages.send({"message": message, "async": false, "ip_pool": "Main Pool"}, result => {
      console.log(result);
      return result;
    }, error => {
      console.log(error);
      return { error };
    });
  }

  async register(username, email, namespace) {
    if (await this.accountModel.findOne({ email }).exec()) {
      return { error: 'registerEmailError'};
    }
    if (await this.accountModel.findOne({ username }).exec()) {
      return { error: 'registerUsernameError'};
    }

    const account = new this.accountModel();
    account._id = urlSafeBase64.encode(uuid.v4(null, new Buffer(16), 0));
    account.username = username;
    account.email = email;
    await account.save();

    const expiresIn = 3600 * 24 * 2;
    const secretOrKey = process.env.JWT_SECRET;
    const payload = { id: account._id, user: account.username };
    const token = jwt.sign(payload, secretOrKey, { expiresIn });

    let domain = process.env.DOMAIN;
    if (namespace) domain = `${namespace}.${domain}`;

    const mandrillClient = new mandrill.Mandrill(process.env.MANDRILL);
    const message = {
      html: `<p>
              Hello. You are receiving this email because somebody (hopefully you) submitted your address using the Hyperaud.io sign-up page. If you did not, please feel free to ignore this communication.
             </p>
             <p>
              <a href='https://${domain}/token/${token}'>Here's your magic activation link.</a>
             </p>
             <p>(Not really magic.)</p>
             <p>The Hyperaud.io Team</p>`,
      text: `Hello. You are receiving this email because somebody (hopefully you) submitted your address using the Hyperaud.io sign-up page. If you did not, please feel free to ignore this communication.
             Here's your magic activation link https://${domain}/token/${token}
             (Not really magic.)
             The Hyperaud.io Team`,
      subject: 'Hyperaud.io registration',
      from_email: 'mark+registration@hyperaud.io',
      from_name: 'Hyperaud.io',
      to: [{
        email: account.email,
        name: account.username,
        type: 'to'
      }],
      headers: { "Reply-To": "mark+registration@hyperaud.io" },
      important: false,
      track_opens: null,
      track_clicks: null,
      auto_text: null,
      auto_html: null,
      inline_css: null,
      url_strip_qs: null,
      preserve_recipients: null,
      view_content_link: null,
      tracking_domain: null,
      signing_domain: null,
      return_path_domain: null,
      merge: false,
      tags: [ 'password-resets' ]
    };

    mandrillClient.messages.send({ "message": message, "async": false, "ip_pool": "Main Pool" }, result => {
      console.log(result);
      return result;
    }, error => {
      console.log(error);
      return { error };
    });
  }

  async updatePassword(password, id) {
    const account = await this.accountModel.findById(id).exec();

    return await new Promise((resolve, reject) => {
      account.setPassword(password, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }
}
