import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';
import { AddPostComponent } from './add-post/add-post.component';
import { confirmLeaveAddPostGuard } from './confirm-leave-add-post.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('confirmLeaveAddPostGuard', () => {
  let guard: CanDeactivateFn<AddPostComponent>;
  let component: AddPostComponent;
  let confirmSpy: jasmine.Spy;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouterStateSnapshot: RouterStateSnapshot;
  let mockNextRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AddPostComponent,
      ],
    });
    component = TestBed.inject(AddPostComponent);
    guard = confirmLeaveAddPostGuard;

    confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

    mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = {} as RouterStateSnapshot;
    mockNextRouterStateSnapshot = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should prompt confirmation if the form is dirty', () => {
    component.postForm.markAsDirty();

    const result = guard(component, mockActivatedRouteSnapshot, mockRouterStateSnapshot, mockNextRouterStateSnapshot);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to leave this page?');
    expect(result).toBeTrue();
  });

  it('should return true if the form is not dirty', () => {
    component.postForm.markAsPristine();

    const result = guard(component, mockActivatedRouteSnapshot, mockRouterStateSnapshot, mockNextRouterStateSnapshot);

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('should return false if the user cancels the confirmation', () => {
    component.postForm.markAsDirty();
    confirmSpy.and.returnValue(false);

    const result = guard(component, mockActivatedRouteSnapshot, mockRouterStateSnapshot, mockNextRouterStateSnapshot);


    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to leave this page?');
    expect(result).toBeFalse();
  });
});
