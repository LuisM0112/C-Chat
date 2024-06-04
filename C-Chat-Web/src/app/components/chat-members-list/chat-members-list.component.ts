import { Component, EffectRef, EventEmitter, OnDestroy, OnInit, Output, effect } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { User } from '../../model/classes/user';
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { ConfirmationPromptComponent } from "../confirmation-prompt/confirmation-prompt.component";

@Component({
  selector: 'app-chat-members-list',
  standalone: true,
  templateUrl: './chat-members-list.component.html',
  styleUrl: './chat-members-list.component.css',
  imports: [SearchBarComponent, ConfirmationPromptComponent]
})
export class ChatMembersListComponent implements OnInit, OnDestroy{

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  
  private effectRef: EffectRef;
  protected filter: string = '';

  protected memberList: User[] = []

  constructor(public cchatService: CChatService) {
    this.effectRef = effect(() => {
      this.memberList = cchatService.memberList();
    });
  }

  public ngOnInit(): void {
    this.cchatService.getUsersInChat();
  }

  public updateFilter(event: string): void {
    this.filter = event;    
  }

  public leaveChat = (): Promise<void> => {
    return this.cchatService.deleteLeaveChat();
  }
  
  public closeModal(): void {
    this.closeDialog.emit();
  }

  public ngOnDestroy(): void {
    this.effectRef.destroy();
  }
}
