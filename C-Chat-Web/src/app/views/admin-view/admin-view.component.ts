import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../model/classes/user';
import { CChatService } from '../../services/c-chat.service';
import { Chat } from '../../model/classes/chat';
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import * as strings from "../../../assets/data/strings.json";

@Component({
    selector: 'app-admin-view',
    standalone: true,
    templateUrl: './admin-view.component.html',
    styleUrl: './admin-view.component.css',
    imports: [SearchBarComponent]
})
export class AdminViewComponent implements OnInit {
  strings: any = strings;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  protected userFilter: string = '';
  protected chatFilter: string = '';

  public userList: User[] = [];
  public chatList: Chat[] = [];

  constructor(public cchatService: CChatService) {}

  async ngOnInit(): Promise<void> {
    this.userList = await this.cchatService.getUsers();
    this.chatList = await this.cchatService.getChats();
  }

  public updateUserFilter(event: string): void {
    this.userFilter = event;    
  }

  public updateChatFilter(event: string): void {
    this.chatFilter = event;    
  }

  public closeForm(): void {
    this.closeDialog.emit();
  }
}
