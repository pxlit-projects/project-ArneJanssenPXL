import { Component, EventEmitter, Output } from '@angular/core';
import { Filter } from '../shared/models/filter.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-filter.component.html',
  styleUrl: './post-filter.component.css'
})
export class PostFilterComponent {
  filter: Filter = {content: '', author: '',  datePublished: null}

  @Output() filterChanged = new EventEmitter<Filter>();

  onSubmit(form: any) {
    if (form.valid) {
      this.filter.content = this.filter.content.toLowerCase();
      this.filter.author = this.filter.author.toLowerCase();
      if (this.filter.datePublished && typeof this.filter.datePublished === 'string') {
        this.filter.datePublished = new Date(this.filter.datePublished);
      }
      this.filterChanged.emit(this.filter);
    }
  }
}
