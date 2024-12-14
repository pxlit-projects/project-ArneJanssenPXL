import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostConceptListComponent } from './post-concept-list.component';

describe('PostConceptListComponent', () => {
  let component: PostConceptListComponent;
  let fixture: ComponentFixture<PostConceptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostConceptListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostConceptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
