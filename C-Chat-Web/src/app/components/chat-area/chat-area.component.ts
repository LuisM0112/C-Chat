import { Component, EffectRef, OnDestroy, OnInit, effect } from '@angular/core';
import { Chat } from '../../model/classes/chat';
import { CChatService } from '../../services/c-chat.service';
import { FormsModule } from '@angular/forms';
import { AddUserFormComponent } from "../add-user-form/add-user-form.component";
import { ChatMembersListComponent } from "../chat-members-list/chat-members-list.component";

@Component({
  selector: 'app-chat-area',
  standalone: true,
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.css',
  imports: [FormsModule, AddUserFormComponent, ChatMembersListComponent]
})
export class ChatAreaComponent implements OnDestroy{

  selectedChat: Chat = new Chat();

  private effectRef: EffectRef;

  inputText: string = '';

  constructor(public cchatService: CChatService) {
    this.effectRef = effect(() => {
      this.selectedChat = cchatService.selectedChat();
    });
  }

  public ngOnDestroy(): void {
    this.effectRef.destroy();
  }
}
