import { Component } from '@angular/core';
import { ToastService, Toast } from '../toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  constructor(public toastService: ToastService) { }

  remove(id: number | undefined) {
    if (id !== undefined) {
      this.toastService.remove(id);
    }
  }
}
