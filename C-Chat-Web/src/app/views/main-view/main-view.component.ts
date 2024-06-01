import { Component } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { ChatListComponent } from "../../components/chat-list/chat-list.component";
import { HeaderMenuComponent } from "../../components/header-menu/header-menu.component";
import { ChatAreaComponent } from "../../components/chat-area/chat-area.component";

@Component({
  selector: 'app-main-view',
  standalone: true,
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css',
  imports: [ChatListComponent, HeaderMenuComponent, ChatAreaComponent]
})
export class MainViewComponent {

  constructor(public cchatservice: CChatService){}

  async ngOnInit(): Promise<void> {
    await this.cchatservice.getAmIAdmin();
  }

}
