import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AesService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor() {
    const secretKey = process.env.AES_SECRET_KEY ?? '';
    const ivValue = process.env.AES_IV ?? '';

    this.key = Buffer.from(secretKey, 'utf-8');
    this.iv = Buffer.from(ivValue, 'utf-8');
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}
