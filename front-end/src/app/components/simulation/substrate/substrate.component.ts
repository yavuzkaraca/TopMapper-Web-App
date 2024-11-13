import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-substrate',
  templateUrl: './substrate.component.html',
  styleUrls: ['./substrate.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class SubstrateComponent implements OnInit {
  substrateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SubstrateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string },
    private fb: FormBuilder
  ) {
    this.substrateForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  // Initialize form fields based on substrate type
  initializeForm() {
    // Common fields for all substrate types
    this.substrateForm = this.fb.group({
      ROWS: [100],
      COLS: [100]
    });

    // Add specific fields based on substrate type
    switch (this.data.type) {
      case 'CONTINUOUS_GRADIENTS':
        this.substrateForm.addControl('CONTINUOUS_SIGNAL_START', this.fb.control(0.01));
        this.substrateForm.addControl('CONTINUOUS_SIGNAL_END', this.fb.control(0.99));
        break;
      case 'WEDGES':
        this.substrateForm.addControl('WEDGE_NARROW_EDGE', this.fb.control(1));
        this.substrateForm.addControl('WEDGE_WIDE_EDGE', this.fb.control(12));
        break;
      case 'STRIPE':
        this.substrateForm.addControl('STRIPE_FWD', this.fb.control(true));
        this.substrateForm.addControl('STRIPE_REW', this.fb.control(true));
        this.substrateForm.addControl('STRIPE_CONC', this.fb.control(1));
        this.substrateForm.addControl('STRIPE_WIDTH', this.fb.control(12));
        break;
      case 'GAP':
        this.substrateForm.addControl('GAP_BEGIN', this.fb.control(0.5));
        this.substrateForm.addControl('GAP_END', this.fb.control(0.1));
        this.substrateForm.addControl('GAP_FIRST_BLOCK', this.fb.control('LIGAND'));
        this.substrateForm.addControl('GAP_SECOND_BLOCK', this.fb.control('RECEPTOR'));
        break;
    }
  }

  // Close dialog and pass form data back to parent component
  close(): void {
    this.dialogRef.close(this.substrateForm.value);
  }
}
