import { Component, EffectRef, ElementRef, OnDestroy, ViewChild, effect } from '@angular/core';
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

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

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
        const wasAtBottom = this.isUserAtBottom();
        this.messages.push(message);
        if (wasAtBottom) {
          setTimeout(() => this.scrollToBottom(), 20);
        }
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { 
      console.error(err); 
    }
  }

  private isUserAtBottom(): boolean {
    const threshold = 30;
    const position = this.chatContainer.nativeElement.scrollTop + this.chatContainer.nativeElement.offsetHeight;
    const height = this.chatContainer.nativeElement.scrollHeight;
    return position > height - threshold;
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
