import { Component } from '@angular/core';
import { MainViewComponent } from "./views/main-view/main-view.component";
import { AuthViewComponent } from "./views/auth-view/auth-view.component";
import { CChatService } from './services/c-chat.service';

@Component({ selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [MainViewComponent, AuthViewComponent],
  })
export class AppComponent {
  title = 'C-Chat';

  constructor(public cchatservice: CChatService){}

  onChange(language: any) {
    this.cchatservice.setLanguage(language.target.value);
  }

}
