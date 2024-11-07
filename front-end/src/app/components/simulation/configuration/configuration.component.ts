import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { SimulationService } from "../../../services/simulation.service";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";

import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { SubstrateComponent } from '../substrate/substrate.component';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button'; // adjust path if needed



/**
 * Component for configuring and starting a simulation.
 */
@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    MatDialogModule,
    SubstrateComponent,
    RouterLink,
    MatButton,
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit {

  /** Toggle for advanced settings display */
  showAdvancedSettings: boolean = false;
  showDialog: boolean = false;

  /** Available simulation types */
  configTypes = [
    { id: 'CONTINUOUS_GRADIENTS', name: 'Continuous Gradients' },
    { id: 'WEDGES', name: 'Wedges' },
    { id: 'STRIPE', name: 'Stripe' },
    { id: 'GAP', name: 'Gap' }
  ];

  /** Selected configuration type */
  selectedConfigType: string = 'CONTINUOUS_GRADIENTS';

  /** Form groups for different configuration sections */
  basicSettingsForm: FormGroup;

  stepDecisionForm: FormGroup = new FormGroup<any>({});
  gcForm: FormGroup = new FormGroup<any>({});
  switchesForm: FormGroup = new FormGroup<any>({});
  adaptationForm: FormGroup = new FormGroup<any>({});

  /** Default settings from backend */
  private defaultConfig: any;

  /** Settings based on user inputs */
  private currentConfig: any;

  /**
   * Constructor injects necessary services.
   * @param simulationService Service to interact with backend simulation API.
   * @param fb FormBuilder to create reactive forms.
   * @param dialog
   * @param cdr
   */
  constructor(
    private simulationService: SimulationService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef here
  ) {

    this.basicSettingsForm = this.fb.group({
        gc_count: [null, { updateOn: 'blur' }],
        gc_size: [null, { updateOn: 'blur' }],
        step_size: [null, { updateOn: 'blur' }],
        step_num: [null, { updateOn: 'blur' }]
    });

    this.stepDecisionForm = this.fb.group({
        x_step_possibility: [null, { updateOn: 'blur' }],
        y_step_possibility: [null, { updateOn: 'blur' }],
        sigmoid_steepness: [null, { updateOn: 'blur' }],
        sigmoid_shift: [null, { updateOn: 'blur' }],
        sigmoid_height: [null, { updateOn: 'blur' }],
        sigma: [null, { updateOn: 'blur' }],
        force: [null, { updateOn: 'blur' }]
    });

    this.switchesForm = this.fb.group({
        forward_sig: [null, { updateOn: 'blur' }],
        reverse_sig: [null, { updateOn: 'blur' }],
        ff_inter: [null, { updateOn: 'blur' }],
        ft_inter: [null, { updateOn: 'blur' }]
    });

    this.adaptationForm = this.fb.group({
        adaptation_enabled: [null, { updateOn: 'blur' }],
        adaptation_mu: [null, { updateOn: 'blur' }],
        adaptation_lambda: [null, { updateOn: 'blur' }],
        adaptation_history: [null, { updateOn: 'blur' }]
    });



  }

  /** Lifecycle hook to initialize component and fetch default configuration */
  ngOnInit() {
    this.getDefaultConfig();
  }


  /** Initiates simulation with merged configuration values */
  startSimulation() {

    const mergedValues = this.getMergedFormValues();

    console.log(mergedValues)

    // Update currentConfig with merged values
    Object.keys(mergedValues).forEach(key => {
      if (this.currentConfig.hasOwnProperty(key)) {
        this.currentConfig[key] = mergedValues[key];
      }
    });

    this.simulationService.startSimulation(this.currentConfig).subscribe(
      response => console.log(response),
      error => console.error('Error:', error)
    );

  }

  /** Handles configuration type changes and reinitializes the form */
  onConfigTypeChange() {
    if (this.defaultConfig && this.selectedConfigType) {
      this.currentConfig = this.defaultConfig[this.selectedConfigType];
    }
    // this.initForm();
  }

  /** Toggles advanced settings visibility */
  onAdvancedClick() {
    this.showAdvancedSettings = !this.showAdvancedSettings;
  }

  openSubstrateDialog(): void {
  const dialogRef = this.dialog.open(SubstrateComponent, {
    width: '400px', // Set width as desired
    data: {} // Pass any data if necessary
  });

  // Optional: Handle dialog close event
  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog closed', result);
    // Perform actions after dialog closes, if needed
  });
}



  /** Combines all form values into a single configuration object */
  private getMergedFormValues() {

    console.log(this.basicSettingsForm.value)
    return {
      ...this.basicSettingsForm.value,
      ...this.stepDecisionForm.value,
      ...this.switchesForm.value,
      ...this.adaptationForm.value
    };
  }

  /** Fetches the default configuration from backend and initializes forms */
  private getDefaultConfig() {
    this.simulationService.getDefaultConfig().subscribe((data: any) => {
      this.defaultConfig = data;
      this.currentConfig = data[this.selectedConfigType || 'CONTINUOUS_GRADIENTS'];
      this.initForm()
    });
  }

  /** Initializes form groups with current configuration values */
// Use detectChanges in initForm() after patching values
  private initForm() {
      this.basicSettingsForm.patchValue({
          gc_count: this.currentConfig.gc_count,
          gc_size: this.currentConfig.gc_size,
          step_size: this.currentConfig.step_size,
          step_num: this.currentConfig.step_num
      });
      this.basicSettingsForm.updateValueAndValidity();

      this.stepDecisionForm.patchValue({
          x_step_possibility: this.currentConfig?.x_step_possibility,
          y_step_possibility: this.currentConfig?.y_step_possibility,
          sigmoid_steepness: this.currentConfig?.sigmoid_steepness,
          sigmoid_shift: this.currentConfig?.sigmoid_shift,
          sigmoid_height: this.currentConfig?.sigmoid_height,
          sigma: this.currentConfig?.sigma,
          force: this.currentConfig?.force
      });
      this.stepDecisionForm.updateValueAndValidity();

      this.switchesForm.patchValue({
          forward_sig: this.currentConfig?.forward_sig,
          reverse_sig: this.currentConfig?.reverse_sig,
          ff_inter: this.currentConfig?.ff_inter,
          ft_inter: this.currentConfig?.ft_inter,
      });
      this.switchesForm.updateValueAndValidity();

      this.adaptationForm.patchValue({
          adaptation_enabled: this.currentConfig?.adaptation_enabled,
          adaptation_mu: this.currentConfig?.adaptation_mu,
          adaptation_lambda: this.currentConfig?.adaptation_lambda,
          adaptation_history: this.currentConfig?.adaptation_history,
      });
      this.adaptationForm.updateValueAndValidity();

      // Trigger change detection to immediately update UI
      this.cdr.detectChanges();
  }
}
