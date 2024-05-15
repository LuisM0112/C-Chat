import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMembersListComponent } from './chat-members-list.component';

describe('ChatMembersListComponent', () => {
  let component: ChatMembersListComponent;
  let fixture: ComponentFixture<ChatMembersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMembersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
