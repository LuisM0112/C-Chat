import { Component, OnInit } from '@angular/core';
import { Chat } from '../../model/classes/chat';
import { CChatService } from '../../services/c-chat.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AddUserFormComponent } from "../add-user-form/add-user-form.component";

@Component({
    selector: 'app-chat-area',
    standalone: true,
    templateUrl: './chat-area.component.html',
    styleUrl: './chat-area.component.css',
    imports: [FormsModule, AddUserFormComponent]
})
export class ChatAreaComponent implements OnInit{

  selectedChat: Chat = new Chat();
  chatSubscription: Subscription | undefined;

  inputText: string = '';

  constructor(public cchatService: CChatService) { }

  public ngOnInit(): void {
    this.chatSubscription = this.cchatService.selectedChat.subscribe(chat => {
      this.selectedChat = chat;
    });
  }

  public ngOnDestroy(): void {
    this.chatSubscription?.unsubscribe();
  }

}
