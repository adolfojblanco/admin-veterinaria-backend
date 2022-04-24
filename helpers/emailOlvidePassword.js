import nodemailer from 'nodemailer';

export const emailOlvidePassword = async (datos) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const { email, nombre, token } = datos;
  const info = await transport.sendMail({
    from: 'APV - Administrador de Veterinaria',
    to: email,
    subject: 'Restablece tu contraseña en APV',
    text: 'Restablece tu contraseña',
    html: `<p>Hola ${nombre}, has solicitado restablecer tu contraseña.</p>
      <p>Sigue el siguente enlace para generar un nuevo password siguiente enlace: 
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer cuenta</a></p>

      <p> Si tu no creaste esta cuenta puedes ignorar este mensaje.</p>
    `,
  });
};
