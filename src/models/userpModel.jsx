import { createClient } from '@supabase/supabase-js';




class UserModel {
    constructor() {
        // Configura tu cliente Supabase con las credenciales de tu proyecto
        this.supabase = createClient('https://trdtclxixupyonmhfpbx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZHRjbHhpeHVweW9ubWhmcGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyMTA0MzEsImV4cCI6MjAyODc4NjQzMX0.U1TENHOwGfLkFACA10tt6ujjX8Kqf-6qhJBKGdEQeV0');
    }

    async signUp(username, password) {
        console.log(username, password)

        try {
            // Realiza la inserción del nuevo usuario en la tabla 'users'
            const res = await this.supabase.from('users').insert([{ username, password }]);

            if (res.error) {
                // Manejar el error
            } else {
                // Hacer una consulta adicional para obtener la ID del usuario insertado
                const insertedUser = await this.supabase.from('users').select('id').eq('username', username).single();

                if (insertedUser.error) {
                    // Manejar el error
                } else {
                    // Obtener la ID del usuario insertado
                    const userId = insertedUser.data.id;
                    console.log('ID del usuario insertado:', userId);
                    return userId;
                }
            }
        } catch (error) {
            console.error('Error al insertar usuario:', error);
            throw error;
        }
    }

    async authenticate(username, password) {
        try {
            // Verificar si el usuario y la contraseña coinciden
            const user = await this.supabase.from('users').select('id').eq('username', username).eq('password', password).single();
            if (user.error) {
                // Manejar el error
            } else if (user.data) {
                // Usuario autenticado correctamente
                console.log('Usuario autenticado:', user.data.id);
                return { aut : true , userId: user.data.id };
            } else {
                // Las credenciales son incorrectas
                console.error('Credenciales incorrectas');
                return false;
            }
        } catch (error) {
            console.error('Error al autenticar usuario:', error);
            throw error;
        }
    }
}

export default UserModel;
