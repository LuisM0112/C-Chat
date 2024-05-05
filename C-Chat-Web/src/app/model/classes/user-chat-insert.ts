export class UserChatInsert {
  chatId: string = '';
  userName: string = '';

  constructor(chatId: string, userName: string){
    this.chatId = chatId;
    this.userName = userName;
  }
}
