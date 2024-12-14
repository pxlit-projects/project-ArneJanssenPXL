import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListSubmittedComponent } from './post-list-submitted.component';

describe('PostListSubmittedComponent', () => {
  let component: PostListSubmittedComponent;
  let fixture: ComponentFixture<PostListSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListSubmittedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
