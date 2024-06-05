import { Component } from '@angular/core';
import { MainViewComponent } from "./views/main-view/main-view.component";
import { AuthViewComponent } from "./views/auth-view/auth-view.component";
import { CChatService } from './services/c-chat.service';
import { FormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";

@Component({ selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css', imports: [MainViewComponent, AuthViewComponent, FormsModule, LanguageSelectorComponent]
})
export class AppComponent {
  title = 'C-Chat';

  constructor(public cchatservice: CChatService){}
}
