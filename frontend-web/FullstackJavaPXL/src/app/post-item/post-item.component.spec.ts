import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";
import { PostItemComponent } from "./post-item.component";
import { Post } from "../shared/models/post.model";

describe('PostItemComponent', () => {
    let component: PostItemComponent;
    let fixture: ComponentFixture<PostItemComponent>;
    const mockPost: Post = new Post('John Doe', 'Post Content 1', new Date(), false, 'Post Title 1', 'Tech');
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PostItemComponent],
        providers: [
          provideRouter([])
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
    
      fixture = TestBed.createComponent(PostItemComponent);
      component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should render post title in the template', () => {
        component.post = mockPost;
        fixture.detectChanges();
        
        const debugElement = fixture.debugElement.query(By.css('h1'));
        expect(debugElement.nativeElement.textContent).toContain('Post Title 1');
    });
});
