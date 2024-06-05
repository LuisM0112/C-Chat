import { Component } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { ChatListComponent } from "../../components/chat-list/chat-list.component";
import { HeaderMenuComponent } from "../../components/header-menu/header-menu.component";
import { ChatAreaComponent } from "../../components/chat-area/chat-area.component";
import { AdminViewComponent } from '../admin-view/admin-view.component';
import { LanguageSelectorComponent } from "../../components/language-selector/language-selector.component";

@Component({
  selector: 'app-main-view',
  standalone: true,
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css',
  imports: [ChatListComponent, HeaderMenuComponent, ChatAreaComponent, AdminViewComponent, LanguageSelectorComponent]
})
export class MainViewComponent {

  constructor(public cchatService: CChatService){}

  async ngOnInit(): Promise<void> {
    await this.cchatService.getAmIAdmin();
  }

}
