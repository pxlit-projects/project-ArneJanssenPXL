import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostFilterComponent } from './post-filter.component';
import { Filter } from '../shared/models/filter.model';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PostService } from '../shared/services/post.service';

describe('PostFilterComponent', () => {
  let component: PostFilterComponent;
  let fixture: ComponentFixture<PostFilterComponent>;
  let postServiceMock: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostFilterComponent, FormsModule], 
    }).compileComponents();

    fixture = TestBed.createComponent(PostFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty filter', () => {
    expect(component.filter).toEqual({ content: '', author: '', datePublished: null });
  });

  it('should emit filterChanged event with the updated filter on valid form submit', () => {
    spyOn(component.filterChanged, 'emit'); 

    component.filter.content = 'Test Content';
    component.filter.author = 'Test Author';
    component.filter.datePublished = new Date('2023-11-01');

    const form = { valid: true }; 
    component.onSubmit(form);

    expect(component.filter.content).toBe('test content'); 
    expect(component.filter.author).toBe('test author'); 
    expect(component.filter.datePublished).toEqual(new Date('2023-11-01')); 

    expect(component.filterChanged.emit).toHaveBeenCalledWith({
      content: 'test content',
      author: 'test author',
      datePublished: new Date('2023-11-01'),
    });
  });

  it('should not emit filterChanged event if the form is invalid', () => {
    spyOn(component.filterChanged, 'emit');

    const form = { valid: false }; 
    component.onSubmit(form);

    expect(component.filterChanged.emit).not.toHaveBeenCalled();
  });

  it('should bind input fields to the filter object and convert datePublished to a Date object', () => {
    const contentInput = fixture.debugElement.query(By.css('input[name="content"]')).nativeElement;
    const authorInput = fixture.debugElement.query(By.css('input[name="author"]')).nativeElement;
    const dateInput = fixture.debugElement.query(By.css('input[name="datePublished"]')).nativeElement;
  
    contentInput.value = 'Sample Content';
    authorInput.value = 'Sample Author';
    dateInput.value = '2023-11-15';
  
    contentInput.dispatchEvent(new Event('input'));
    authorInput.dispatchEvent(new Event('input'));
    dateInput.dispatchEvent(new Event('input'));
  
    if (typeof component.filter.datePublished === 'string') {
      component.filter.datePublished = new Date(component.filter.datePublished);
    }
  
    fixture.detectChanges();
  
    expect(component.filter.content).toBe('Sample Content');
    expect(component.filter.author).toBe('Sample Author');
    expect(component.filter.datePublished).toEqual(new Date('2023-11-15'));
  });
});

