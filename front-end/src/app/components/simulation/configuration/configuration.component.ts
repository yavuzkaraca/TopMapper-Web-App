import {Component, OnInit} from '@angular/core';
import {SimulationService} from "../../../services/simulation.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from '@angular/router';
import {TooltipDirective} from './tooltip.directive';
import {AuthService} from '../../../services/auth.service';


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
    RouterLink,
    TooltipDirective,
    NgClass
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit {

  userId: number = 0;

  /** Toggle for advanced settings display */
  showAdvancedSettings: boolean = false;
  showSubstrateSettings: boolean = false;
  showGcSettings: boolean = false;

  /** Available simulation types */
  configTypes = [
    {id: 'CONTINUOUS_GRADIENTS', name: 'Continuous Gradients'},
    {id: 'WEDGES', name: 'Wedges'},
    {id: 'STRIPE', name: 'Stripe'},
    {id: 'GAP', name: 'Gap'}
  ];

  /** Selected configuration type */
  selectedConfigType: string = 'CONTINUOUS_GRADIENTS';

  /** Form groups for different configuration sections */
  basicSettingsForm: FormGroup;

  substrateForm: FormGroup = new FormGroup<any>({});
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

   * @param authService
   */
  constructor(
    private simulationService: SimulationService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.substrateForm = this.fb.group({
      rows: [null],
      cols: [null]
    })

    this.configureSubstrateForm()

    this.basicSettingsForm = this.fb.group({
      gc_count: [null],
      gc_size: [null],
      step_size: [null],
      step_num: [null]
    });

    this.stepDecisionForm = this.fb.group({
      x_step_possibility: [null],
      y_step_possibility: [null],
      sigma: [null],
      force: [null]
    });

    this.gcForm = this.fb.group({
      ligand_min: [null],
      ligand_max: [null],
      ligand_steepness: [null],
      receptor_min: [null],
      receptor_max: [null],
      receptor_steepness: [null],

    })

    this.switchesForm = this.fb.group({
      forward_sig: [null],
      forward_strength: [null],
      reverse_sig: [null],
      reverse_strength: [null],
      ff_inter: [null],
      ft_inter: [null],
      sigmoid_steepness: [null],
      sigmoid_shift: [null],
      sigmoid_height: [null]
    });

    this.adaptationForm = this.fb.group({
      adaptation_enabled: [null],
      adaptation_mu: [null],
      adaptation_lambda: [null],
      adaptation_history: [null]
    });


  }

  /** Lifecycle hook to initialize component and fetch default configuration */
  ngOnInit() {
    this.getDefaultConfig();
    this.getUserId();
  }

  getUserId() {
    this.userId = this.authService.getCurrentUserId()
  }


  /** Initiates simulation with merged configuration values */
  startSimulation() {

    const mergedValues = this.getMergedFormValues();


    // Update currentConfig with merged values
    Object.keys(mergedValues).forEach(key => {
      if (this.currentConfig.hasOwnProperty(key)) {
        this.currentConfig[key] = mergedValues[key];
      }
    });

    this.simulationService.startSimulation(this.currentConfig, this.userId).subscribe(
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
    this.configureSubstrateForm()
    this.initSubstrateForm()
  }

  configureSubstrateForm() {
    switch (this.selectedConfigType) {
      case 'CONTINUOUS_GRADIENTS':
        this.substrateForm.addControl('continuous_signal_start', this.fb.control(null));
        this.substrateForm.addControl('continuous_signal_end', this.fb.control(null));
        break;
      case 'WEDGES':
        this.substrateForm.addControl('wedge_narrow_edge', this.fb.control(null));
        this.substrateForm.addControl('wedge_wide_edge', this.fb.control(null));
        break;
      case 'STRIPE':
        this.substrateForm.addControl('stripe_fwd', this.fb.control(null));
        this.substrateForm.addControl('stripe_rew', this.fb.control(null));
        this.substrateForm.addControl('stripe_conc', this.fb.control(null));
        this.substrateForm.addControl('stripe_width', this.fb.control(null));
        break;
      case 'GAP':
        this.substrateForm.addControl('gap_begin', this.fb.control(null));
        this.substrateForm.addControl('gap_end', this.fb.control(null));
        this.substrateForm.addControl('gap_first_block', this.fb.control(null));
        this.substrateForm.addControl('gap_second_block', this.fb.control(null));
        break;
    }
  }

  initSubstrateForm() {
    switch (this.selectedConfigType) {
      case 'CONTINUOUS_GRADIENTS':
        this.substrateForm.patchValue({
          rows: this.currentConfig.rows,
          cols: this.currentConfig.cols,
          continuous_signal_start: this.currentConfig.continuous_signal_start,
          continuous_signal_end: this.currentConfig.continuous_signal_end,
        });
        break;
      case 'WEDGES':
        this.substrateForm.patchValue({
          rows: this.currentConfig.rows,
          cols: this.currentConfig.cols,
          wedge_narrow_edge: this.currentConfig.wedge_narrow_edge,
          wedge_wide_edge: this.currentConfig.wedge_wide_edge,
        });
        break;
      case 'STRIPE':
        this.substrateForm.patchValue({
          rows: this.currentConfig.rows,
          cols: this.currentConfig.cols,
          stripe_fwd: this.currentConfig.stripe_fwd,
          stripe_rew: this.currentConfig.stripe_rew,
          stripe_conc: this.currentConfig.stripe_conc,
          stripe_width: this.currentConfig.stripe_width,
        });
        break;
      case 'GAP':
        this.substrateForm.patchValue({
          rows: this.currentConfig.rows,
          cols: this.currentConfig.cols,
          gap_begin: this.currentConfig.gap_begin,
          gap_end: this.currentConfig.gap_end,
          gap_first_block: this.currentConfig.gap_first_block,
          gap_second_block: this.currentConfig.gap_second_block,
        });
        break;
    }
  }

  /** Toggles advanced settings visibility */
  onAdvancedClick() {
    this.showAdvancedSettings = !this.showAdvancedSettings;
  }

  onSubstrateClick() {
    this.showSubstrateSettings = !this.showSubstrateSettings;
  }

  onGcClick() {
    this.showGcSettings = !this.showGcSettings;
  }


  /** Combines all form values into a single configuration object */
  private getMergedFormValues() {
    return {
      ...this.basicSettingsForm.value,
      ...this.stepDecisionForm.value,
      ...this.switchesForm.value,
      ...this.adaptationForm.value,
      ...this.substrateForm.value
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
    this.initSubstrateForm();

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
      sigma: this.currentConfig?.sigma,
      force: this.currentConfig?.force
    });
    this.stepDecisionForm.updateValueAndValidity();

    this.switchesForm.patchValue({
      forward_sig: this.currentConfig?.forward_sig,
      forward_strength: this.currentConfig?.forward_strength,
      reverse_sig: this.currentConfig?.reverse_sig,
      reverse_strength: this.currentConfig?.reverse_strength,
      ff_inter: this.currentConfig?.ff_inter,
      ft_inter: this.currentConfig?.ft_inter,
      sigmoid_steepness: this.currentConfig?.sigmoid_steepness,
      sigmoid_shift: this.currentConfig?.sigmoid_shift,
      sigmoid_height: this.currentConfig?.sigmoid_height,
    });
    this.switchesForm.updateValueAndValidity();

    this.adaptationForm.patchValue({
      adaptation_enabled: this.currentConfig?.adaptation_enabled,
      adaptation_mu: this.currentConfig?.adaptation_mu,
      adaptation_lambda: this.currentConfig?.adaptation_lambda,
      adaptation_history: this.currentConfig?.adaptation_history,
    });
    this.adaptationForm.updateValueAndValidity();

  }
}
