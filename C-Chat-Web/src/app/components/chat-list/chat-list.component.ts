import { Component, OnInit } from '@angular/core';
import { Chat } from '../../model/classes/chat';
import { CChatService } from '../../services/c-chat.service';
import { CreateChatFormComponent } from "../create-chat-form/create-chat-form.component";

@Component({
    selector: 'app-chat-list',
    standalone: true,
    templateUrl: './chat-list.component.html',
    styleUrl: './chat-list.component.css',
    imports: [CreateChatFormComponent]
})
export class ChatListComponent implements OnInit {

  chatList: Chat[] = []

  constructor(public cchatService: CChatService) {}
  
  public ngOnInit(): void {
    this.getChatList();

    this.cchatService.chatCreated$.subscribe(() => {
      this.getChatList();
    });
  }

  public async getChatList(): Promise<void> {
    this.chatList = await this.cchatService.getUserChatList();
  }

  public toggleNewChatForm(open: boolean): void {
    const dialog = document.getElementById("dialog-new-chat") as HTMLDialogElement;
    open ? dialog.showModal() : dialog.close();
  }

  public selectChat(chat: Chat) {
    this.cchatService.setSelectedChat(chat);
  }
}
