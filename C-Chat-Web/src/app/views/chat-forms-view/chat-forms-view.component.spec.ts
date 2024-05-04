import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFormsViewComponent } from './chat-forms-view.component';

describe('ChatFormsViewComponent', () => {
  let component: ChatFormsViewComponent;
  let fixture: ComponentFixture<ChatFormsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatFormsViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatFormsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
