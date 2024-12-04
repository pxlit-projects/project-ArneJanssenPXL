import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { UpdatePostComponent } from './update-post.component';

describe('UpdatePostComponent', () => {
  let component: UpdatePostComponent;
  let fixture: ComponentFixture<UpdatePostComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        params: {}  
      }
    };

    await TestBed.configureTestingModule({
      imports: [UpdatePostComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: activatedRouteMock }  
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();  
  });
});

