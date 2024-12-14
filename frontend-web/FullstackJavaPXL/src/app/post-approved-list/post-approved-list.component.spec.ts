import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostApprovedListComponent } from './post-approved-list.component';

describe('PostApprovedListComponent', () => {
  let component: PostApprovedListComponent;
  let fixture: ComponentFixture<PostApprovedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostApprovedListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostApprovedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
