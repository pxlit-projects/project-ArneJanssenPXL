import { CanDeactivateFn } from '@angular/router';
import { UpdatePostComponent } from './update-post/update-post.component';

export const confirmLeaveUpdatePostGuard: CanDeactivateFn<UpdatePostComponent> = (component, currentRoute, currentState, nextState) => {
  if (component.updateForm.dirty){
    return window.confirm("Are you sure you want to leave this page?");
  }
  else{
    return true;
  }
};
