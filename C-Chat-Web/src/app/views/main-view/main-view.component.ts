import { Component } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { LogInComponent } from "../../components/log-in/log-in.component";
import { SignUpComponent } from "../../components/sign-up/sign-up.component";
import { ChatListComponent } from "../../components/chat-list/chat-list.component";

@Component({
    selector: 'app-main-view',
    standalone: true,
    templateUrl: './main-view.component.html',
    styleUrl: './main-view.component.css',
    imports: [LogInComponent, SignUpComponent, ChatListComponent]
})
export class MainViewComponent {

  constructor(public cchatservice: CChatService){}
  
}
