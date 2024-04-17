import GroupMsgModel from '../models/groupMsgModel.jsx';

class GroupMsgController {
  static async addGroup(groupName) {
    const groupMsgModel = new GroupMsgModel();
    try {
      const data = await groupMsgModel.addGroup(groupName);
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async joinGroup(userId, groupId) {
    const groupMsgModel = new GroupMsgModel();
    try {
      const data = await groupMsgModel.joinGroup(userId, groupId);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default GroupMsgController;
