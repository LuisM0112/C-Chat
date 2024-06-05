import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CChatService } from '../../services/c-chat.service';
import * as strings from "../../../assets/data/strings.json";

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  strings: any = strings;

  @Output() filterText = new EventEmitter<string>();

  inputText = "";

  constructor(public cchatService: CChatService){}

  public sendFilter(): void {
    this.filterText.emit(this.inputText.toLowerCase())
  }
}
