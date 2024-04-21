import { createClient } from '@supabase/supabase-js';




class UserModel {
    constructor() {
        this.supabase = createClient('https://trdtclxixupyonmhfpbx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZHRjbHhpeHVweW9ubWhmcGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyMTA0MzEsImV4cCI6MjAyODc4NjQzMX0.U1TENHOwGfLkFACA10tt6ujjX8Kqf-6qhJBKGdEQeV0');
    }

    async signUp(username, password) {

        try {
            const res = await this.supabase.from('users').insert([{ username, password }]);

            if (res.error) {
                return res.error;
            } else {
                const insertedUser = await this.supabase.from('users').select('id').eq('username', username).single();

                if (insertedUser.error) {
                    return insertedUser.error;
                } else {
                    const userId = insertedUser.data.id;
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
