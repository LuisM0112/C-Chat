import { Component, OnInit } from '@angular/core';
import { Chat } from '../../model/classes/chat';
import { CChatService } from '../../services/c-chat.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.css'
})
export class ChatAreaComponent implements OnInit{

  selectedChat: Chat = new Chat();
  chatSubscription: Subscription | undefined;

  inputText: string = '';

  constructor(private cchatService: CChatService) { }

  public ngOnInit(): void {
    this.chatSubscription = this.cchatService.selectedChat.subscribe(chat => {
      this.selectedChat = chat;
    });
  }

  ngOnDestroy(): void {
    this.chatSubscription?.unsubscribe();
  }

}
