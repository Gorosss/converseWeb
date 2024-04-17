import UserModel from '../models/userModel.jsx';

export class UserController {
    static async signUp(username, password) {
    
    const userModel = new UserModel();
    try {
      const userId = await userModel.signUp(username, password);
      return userId;
    } catch (error) {
      throw error;
    }
  }

  static async login(username, password) {
    const userModel = new UserModel();
    try {
      // Aquí podrías implementar la lógica de autenticación,
      // por ejemplo, verificando las credenciales con la base de datos
      // Supongamos que tienes un método en tu modelo para verificar las credenciales
      const res = await userModel.authenticate(username, password);
      console.log(res)
      if (res.aut) {
        // Si las credenciales son válidas, podrías devolver algún tipo de token o identificador de sesión
        // Por simplicidad, aquí solo estamos devolviendo un mensaje de éxito
        return { userId: res.userId, success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Invalid username or password' };
      }
    } catch (error) {
      throw error;
    }
  }
}

