import { Component, EffectRef, OnDestroy, OnInit, effect } from '@angular/core';
import { Chat } from '../../model/classes/chat';
import { CChatService } from '../../services/c-chat.service';
import { CreateChatFormComponent } from "../create-chat-form/create-chat-form.component";
import { SearchBarComponent } from "../search-bar/search-bar.component";

@Component({
  selector: 'app-chat-list',
  standalone: true,
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
  imports: [CreateChatFormComponent, SearchBarComponent]
})
export class ChatListComponent implements OnInit, OnDestroy {

  private effectRef: EffectRef;
  protected chatList: Chat[] = []
  protected filter: string = '';

  constructor(public cchatService: CChatService) {
    this.effectRef = effect(() => {
      this.chatList = cchatService.chatList();
    });
  }
  
  public ngOnInit(): void {
    this.cchatService.getUserChatList();
  }

  public updateFilter(event: string): void {
    this.filter = event;    
  }

  public selectChat(chat: Chat) {
    this.cchatService.selectedChat.set(chat);
    this.cchatService.getUsersInChat();
  }
  public ngOnDestroy(): void {
    this.effectRef.destroy();
  }
}
