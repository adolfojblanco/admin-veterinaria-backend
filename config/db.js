import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Conectado a la base de datos`);
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit();
  }
};

export default conectarDB;
