import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";
import { PostItemComponent } from "./post-item.component";
import { Post } from "../shared/models/post.model";

describe('PostItemComponent', () => {
    let component: PostItemComponent;
    let fixture: ComponentFixture<PostItemComponent>;
    const mockPost: Post = {
      id: 1,
      title: 'Post Title 1',
      content: 'Post Content 1',
      category: 'Tech',
      postStatus: 'CONCEPT',
      author: 'John Doe',
      authorId: 1,
      dateCreated: new Date(),
      datePublished: new Date(),
    };
  
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
