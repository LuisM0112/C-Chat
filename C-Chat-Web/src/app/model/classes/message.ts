export class Message {
  author: string = '';
  chatName: string = '';
  date: string = '';
  content: string = '';

  constructor(author: string, chatName: string, date: string, content: string){
    this.author = author;
    this.chatName = chatName;
    this.date = date;
    this.content = content;
  }
}
