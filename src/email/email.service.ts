import { Injectable } from '@nestjs/common';
import { CreateEmail } from './email.typings';
import { createTransport } from 'nodemailer';
import { parseEmailTemplate } from './email.parser';

@Injectable()
export class EmailService {
  async sendEmail(data: CreateEmail) {
    const { host, user, pass } = data;

    const transport = createTransport({
      host: host ?? process.env.EMAIL_HOST,
      port: 25,
      secure: false,
      auth: {
        user: user ?? process.env.EMAIL_USER,
        pass: pass ?? process.env.EMAIL_PASS,
      },
    });

    return await transport.sendMail({
      from: data.from ?? process.env.EMAIL_USER,
      to: data.to,
      html:
        data.content ??
        (await parseEmailTemplate(data.template, data.data ?? {})),
      subject: data.subject ?? '',
      ...(data.cc ? { cc: data.cc } : {}),
      ...(data.attachments ? { attachments: data.attachments } : {}),
    });
  }
}
