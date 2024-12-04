import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DetailPostComponent } from './detail-post.component';

describe('DetailPostComponent', () => {
  let component: DetailPostComponent;
  let fixture: ComponentFixture<DetailPostComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        params: {}  
      }
    };

    await TestBed.configureTestingModule({
      imports: [DetailPostComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: activatedRouteMock } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();  
  });
});
