import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPostComponent } from './add-post.component';
import { provideHttpClient } from '@angular/common/http'; 

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPostComponent],
      providers: [provideHttpClient()] 
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});