import appBcrypt from 'bcrypt';
const saltRounds = 10;

// Encripta la contraseña de un guerrero
export const encryptPassword = async (password) => {
  try {
    const hashedPassword = await appBcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error){
    console.error('Error al encriptar la contraseña del guerrero:', error);
    throw error;
  }
};

// Compara la contraseña ingresada con la contraseña hasheada del guerrero
export const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await appBcrypt.compare(password, hashedPassword);
    return match;
  } catch (error){
    console.error('Error al comparar la contraseña del guerrero con el hash:', error);
    throw error;
  }
};