import { Component, EffectRef, OnDestroy, effect } from '@angular/core';
import { Chat } from '../../model/classes/chat';
import { CChatService } from '../../services/c-chat.service';
import { FormsModule } from '@angular/forms';
import { AddUserFormComponent } from "../add-user-form/add-user-form.component";
import { ChatMembersListComponent } from "../chat-members-list/chat-members-list.component";
import { WebSocketService } from '../../services/web-socket.service';
import { Message } from '../../model/classes/message';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.css',
  imports: [FormsModule, AddUserFormComponent, ChatMembersListComponent]
})
export class ChatAreaComponent implements OnDestroy{

  selectedChat: Chat = new Chat();

  private selectedChatEffectRef: EffectRef;
  private messageEffectRef: EffectRef;
  public messages: Message[] = [];

  inputText: string = '';

  constructor(
    public cchatService: CChatService,
    private webSocketService: WebSocketService
  ) {
    this.selectedChatEffectRef = effect(() => {
      this.messages = [];
      this.webSocketService.disconnect();
      this.selectedChat = cchatService.selectedChat();
      if (this.selectedChat.name) {
        this.webSocketService.connect(this.selectedChat.chatId);
      }
    });
    this.messageEffectRef = effect(() => {
      const message = webSocketService.message()
      if (message.author) {
        this.messages.push(message)
      }
    });
  }

  public ngOnDestroy(): void {
    this.selectedChatEffectRef.destroy();
    this.messageEffectRef.destroy()
    this.webSocketService.disconnect();
  }

  public sendMessage(): void {
    if (this.inputText.trim() !== '') {
      this.webSocketService.sendMessage(this.inputText);
      this.inputText = '';
    }
  }
}
