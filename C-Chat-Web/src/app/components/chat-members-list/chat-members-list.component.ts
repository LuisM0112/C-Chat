import { Component, EffectRef, EventEmitter, OnDestroy, OnInit, Output, effect } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { User } from '../../model/classes/user';

@Component({
  selector: 'app-chat-members-list',
  standalone: true,
  imports: [],
  templateUrl: './chat-members-list.component.html',
  styleUrl: './chat-members-list.component.css'
})
export class ChatMembersListComponent implements OnInit, OnDestroy{

  private effectRef: EffectRef;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  protected memberList: User[] = []

  constructor(public cchatService: CChatService) {
    this.effectRef = effect(() => {
      this.memberList = cchatService.memberList();
    });
  }

  public ngOnInit(): void {
    this.cchatService.getUsersInChat();
  }

  public leaveChat(): void {
    this.cchatService.deleteLeaveChat();
  }
  
  public closeModal(): void {
    this.closeDialog.emit();
  }

  public ngOnDestroy(): void {
    this.effectRef.destroy();
  }
}
