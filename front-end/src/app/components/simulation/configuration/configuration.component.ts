import { Component, OnInit } from '@angular/core';
import { SimulationService } from "../../../services/simulation.service";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";

import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { SubstrateComponent } from '../substrate/substrate.component'; // adjust path if needed



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
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit {

  /** Toggle for advanced settings display */
  showAdvancedSettings: boolean = false;

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
  basicSettingsForm: FormGroup = new FormGroup({});
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
   */
  constructor(
    private simulationService: SimulationService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  /** Lifecycle hook to initialize component and fetch default configuration */
  ngOnInit() {
    this.getDefaultConfig();
  }

  validateValues(){

  }

  /** Initiates simulation with merged configuration values */
  startSimulation() {
    this.validateValues() // check if all values are valid

    const mergedValues = this.getMergedFormValues();

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
    this.initForm();
  }

  /** Toggles advanced settings visibility */
  onAdvancedClick() {
    this.showAdvancedSettings = !this.showAdvancedSettings;
  }



  onSubstrateClick(): void {
    this.dialog.open(SubstrateComponent, {
      width: '400px',  // adjust size as needed
      height: '300px', // adjust size as needed
    });
  }



  /** Combines all form values into a single configuration object */
  private getMergedFormValues() {
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
      this.initForm();
    });
  }

  /** Initializes form groups with current configuration values */
  private initForm() {
    this.basicSettingsForm = this.fb.group({
      gc_count: [this.currentConfig?.gc_count],
      gc_size: [this.currentConfig?.gc_size],
      step_size: [this.currentConfig?.step_size],
      step_num: [this.currentConfig?.step_num]
    });

    this.stepDecisionForm = this.fb.group({
      x_step_possibility: [this.currentConfig?.x_step_possibility],
      y_step_possibility: [this.currentConfig?.y_step_possibility],
      sigmoid_steepness: [this.currentConfig?.sigmoid_steepness],
      sigmoid_shift: [this.currentConfig?.sigmoid_shift],
      sigmoid_height: [this.currentConfig?.sigmoid_height],
      sigma: [this.currentConfig?.sigma],
      force: [this.currentConfig?.force]
    });

    this.switchesForm = this.fb.group({
      forward_sig: [this.currentConfig?.forward_sig],
      reverse_sig: [this.currentConfig?.reverse_sig],
      ff_inter: [this.currentConfig?.ff_inter],
      ft_inter: [this.currentConfig?.ft_inter],
    });

    this.adaptationForm = this.fb.group({
      adaptation_enabled: [this.currentConfig?.adaptation_enabled],
      adaptation_mu: [this.currentConfig?.adaptation_mu],
      adaptation_lambda: [this.currentConfig?.adaptation_lambda],
      adaptation_history: [this.currentConfig?.adaptation_history],
    });
  }
}
