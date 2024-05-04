import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainViewComponent } from "./views/main-view/main-view.component";
import { HttpClientModule } from '@angular/common/http';
import { AuthViewComponent } from "./views/auth-view/auth-view.component";
import { CChatService } from './services/c-chat.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, MainViewComponent, HttpClientModule, AuthViewComponent]
})
export class AppComponent {
  title = 'C-Chat';

  constructor(public cchatservice: CChatService){}

}
