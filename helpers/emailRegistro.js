import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
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
    subject: 'Comprueba tu cuenta en APV',
    text: 'Comprueba tu cuenta',
    html: `<p>Hola ${nombre}, comprueba tu cuenta.</p>
      <p>Tu cuneta ya esta lista, solo debes confirmarla con el siguiente enlace: 
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a></p>

      <p> Si tu no creaste esta cuenta puedes ignorar este mensaje.</p>
    `,
  });
};
