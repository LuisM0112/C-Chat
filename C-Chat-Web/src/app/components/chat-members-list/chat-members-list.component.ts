import { Component, EffectRef, EventEmitter, OnDestroy, OnInit, Output, effect } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { User } from '../../model/classes/user';
import { SearchBarComponent } from "../search-bar/search-bar.component";

@Component({
    selector: 'app-chat-members-list',
    standalone: true,
    templateUrl: './chat-members-list.component.html',
    styleUrl: './chat-members-list.component.css',
    imports: [SearchBarComponent]
})
export class ChatMembersListComponent implements OnInit, OnDestroy{

  private effectRef: EffectRef;
  private filter: string = '';
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

  public getMemberListFiltered(): User[] {
    return this.filter ? this.memberList.filter(member => member.name.toLowerCase().includes(this.filter)) : this.memberList;
  }

  public updateFilter(event: string): void {
    this.filter = event;    
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
