import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListConceptComponent } from './post-list-concept.component';

describe('PostListConceptComponent', () => {
  let component: PostListConceptComponent;
  let fixture: ComponentFixture<PostListConceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListConceptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
