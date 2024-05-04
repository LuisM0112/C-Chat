import { Component, OnInit } from '@angular/core';
import { Chat } from '../../model/classes/chat';
import { CChatService } from '../../services/c-chat.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent implements OnInit {

  chatList: Chat[] = []

  constructor(public cchatService: CChatService) {}
  
  public ngOnInit(): void {
    this.getChatList();
  }

  public async getChatList(): Promise<void> {
    this.chatList = await this.cchatService.getUserChatList();
    console.log(this.chatList);
  }
}
