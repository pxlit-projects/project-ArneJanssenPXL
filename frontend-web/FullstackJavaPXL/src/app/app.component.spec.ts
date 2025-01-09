import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { RouterOutlet } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { NavbarComponent } from "./navbar/navbar.component";
import { WelcomeComponent } from "./welcome/welcome.component";

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({ 
        imports: [RouterTestingModule, RouterOutlet, NavbarComponent, WelcomeComponent, AppComponent] 
      }).compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create the app component', () => {
      expect(component).toBeTruthy();
    });
  
    it(`should have as title 'FullstackJavaPXL'`, () => {
      expect(component.title).toEqual('FullstackJavaPXL');
    });
});