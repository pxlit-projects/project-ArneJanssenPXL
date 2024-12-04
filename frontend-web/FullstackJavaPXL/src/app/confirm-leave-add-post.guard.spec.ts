import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { AddPostComponent } from './add-post/add-post.component';
import { confirmLeaveAddPostGuard } from './confirm-leave-add-post.guard';

describe('confirmLeaveAddPostGuard', () => {
  let guard: CanDeactivateFn<AddPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = confirmLeaveAddPostGuard;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
