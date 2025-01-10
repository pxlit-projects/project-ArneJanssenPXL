import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';
import { confirmLeaveUpdatePostGuard } from './confirm-leave-update-post.guard';
import { UpdatePostComponent } from './update-post/update-post.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('confirmLeaveUpdatePostGuard', () => {
  let guard: CanDeactivateFn<UpdatePostComponent>;
  let component: UpdatePostComponent;
    let confirmSpy: jasmine.Spy;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let mockRouterStateSnapshot: RouterStateSnapshot;
    let mockNextRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        UpdatePostComponent,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {}  
            },
          }
        }
      ],
    });
    component = TestBed.inject(UpdatePostComponent);
    guard = confirmLeaveUpdatePostGuard;

    confirmSpy = spyOn(window, 'confirm').and.returnValue(true);

    mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = {} as RouterStateSnapshot;
    mockNextRouterStateSnapshot = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should prompt confirmation if the form is dirty', () => {
    component.updateForm.markAsDirty();

    const result = guard(component, mockActivatedRouteSnapshot, mockRouterStateSnapshot, mockNextRouterStateSnapshot);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to leave this page?');
    expect(result).toBeTrue();
  });

  it('should return true if the form is not dirty', () => {
    component.updateForm.markAsPristine();

    const result = guard(component, mockActivatedRouteSnapshot, mockRouterStateSnapshot, mockNextRouterStateSnapshot);

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('should return false if the user cancels the confirmation', () => {
    component.updateForm.markAsDirty();
    confirmSpy.and.returnValue(false);

    const result = guard(component, mockActivatedRouteSnapshot, mockRouterStateSnapshot, mockNextRouterStateSnapshot);


    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to leave this page?');
    expect(result).toBeFalse();
  });
});
