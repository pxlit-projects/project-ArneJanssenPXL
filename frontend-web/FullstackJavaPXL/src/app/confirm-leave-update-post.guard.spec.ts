import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { confirmLeaveUpdatePostGuard } from './confirm-leave-update-post.guard';
import { UpdatePostComponent } from './update-post/update-post.component';

describe('confirmLeaveUpdatePostGuard', () => {
  let guard: CanDeactivateFn<UpdatePostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = confirmLeaveUpdatePostGuard;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
