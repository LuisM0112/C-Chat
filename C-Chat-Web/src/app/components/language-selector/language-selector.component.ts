import { Component } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css',
  imports: [FormsModule],
})
export class LanguageSelectorComponent {
  selectedLanguage: string;

  constructor(public cchatservice: CChatService){
    this.selectedLanguage = this.cchatservice.getLanguage();
  }
  
  onChange(language: any) {
    this.cchatservice.setLanguage(language.target.value);
  }
}
