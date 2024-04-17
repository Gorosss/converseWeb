import { createClient } from '@supabase/supabase-js';

class GroupMsgModel {
  constructor() {
    // Configurar el cliente Supabase con las credenciales de tu proyecto
    this.supabase = createClient('https://trdtclxixupyonmhfpbx.supabase.co', 'YOUR_SUPABASE_KEY');
  }

  async addGroup(groupName) {
    try {
      const { data, error } = await this.supabase.from('groups').insert([{ name: groupName }]);
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error al agregar grupo:', error);
      throw error;
    }
  }

  async joinGroup(userId, groupId) {
    try {
      const { data, error } = await this.supabase.from('group_members').insert([{ user_id: userId, group_id: groupId }]);
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error al unirse al grupo:', error);
      throw error;
    }
  }
}

export default GroupMsgModel;
