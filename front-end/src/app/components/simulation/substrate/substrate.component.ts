import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-substrate',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './substrate.component.html',
  styleUrl: './substrate.component.scss'
})
export class SubstrateComponent {

  constructor(public dialogRef: MatDialogRef<SubstrateComponent>) {}

  // Method to close the dialog
  close(): void {
    this.dialogRef.close();
  }
}
