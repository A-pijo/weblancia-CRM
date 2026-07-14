declare module "nodemailer" {
  interface SendMailOptions {
    from?: string
    to?: string | string[]
    cc?: string | string[]
    bcc?: string | string[]
    replyTo?: string
    subject?: string
    text?: string
    html?: string
    attachments?: Array<{
      filename?: string
      content?: string | Buffer
      path?: string
      contentType?: string
    }>
  }

  interface TransportOptions {
    host?: string
    port?: number
    secure?: boolean
    auth?: { user?: string; pass?: string }
    service?: string
    [key: string]: unknown
  }

  interface Transporter {
    sendMail(mailOptions: SendMailOptions): Promise<{ messageId: string; accepted: string[]; rejected: string[] }>
    verify(): Promise<true>
    close(): void
  }

  function createTransport(transport: TransportOptions | string, defaults?: Partial<TransportOptions>): Transporter

  export default { createTransport }
}
