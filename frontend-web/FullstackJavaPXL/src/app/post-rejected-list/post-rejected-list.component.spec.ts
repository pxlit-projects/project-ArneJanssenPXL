import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRejectedListComponent } from './post-rejected-list.component';

describe('PostRejectedListComponent', () => {
  let component: PostRejectedListComponent;
  let fixture: ComponentFixture<PostRejectedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostRejectedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostRejectedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
