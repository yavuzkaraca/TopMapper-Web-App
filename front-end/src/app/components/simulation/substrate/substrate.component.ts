import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-substrate',
  standalone: true,
  imports: [],
  templateUrl: './substrate.component.html',
  styleUrl: './substrate.component.scss'
})
export class SubstrateComponent {
  @Output() closeDialog = new EventEmitter<void>();

  close() {
    this.closeDialog.emit();
  }

}
