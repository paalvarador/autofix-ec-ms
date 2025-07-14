import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    // En producción, aquí integrarías con un servicio de email real
    // como SendGrid, Mailgun, AWS SES, etc.
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // Por ahora, solo logueamos el email (para desarrollo)
    this.logger.log(`
      ===========================================
      📧 EMAIL DE RESET DE CONTRASEÑA
      ===========================================
      Para: ${email}
      Token: ${resetToken}
      URL de Reset: ${resetUrl}
      
      ⚠️  En desarrollo: Este email no se envía realmente.
      ⚠️  En producción: Integrar con servicio de email real.
      ===========================================
    `);

    // Simular envío de email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.logger.log(`✅ Email de reset enviado exitosamente a: ${email}`);
  }

  async sendPasswordChangeConfirmation(email: string): Promise<void> {
    // Email de confirmación cuando la contraseña se cambia exitosamente
    this.logger.log(`
      ===========================================
      📧 CONFIRMACIÓN DE CAMBIO DE CONTRASEÑA
      ===========================================
      Para: ${email}
      Mensaje: Su contraseña ha sido cambiada exitosamente.
      Si no realizó este cambio, contacte soporte inmediatamente.
      ===========================================
    `);

    await new Promise(resolve => setTimeout(resolve, 500));
    this.logger.log(`✅ Email de confirmación enviado a: ${email}`);
  }
}