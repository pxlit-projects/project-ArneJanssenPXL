import { CanDeactivateFn } from '@angular/router';
import { AddPostComponent } from './add-post/add-post.component';

export const confirmLeaveAddPostGuard: CanDeactivateFn<AddPostComponent> = (component, currentRoute, currentState, nextState) => {
  if(component.postForm.dirty){
    return window.confirm("Are you sure you want to leave this page?");
  }
  else{
    return true;
  }
};
