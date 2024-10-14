import {Component, OnInit} from '@angular/core';
import {SimulationService} from "../../services/simulation.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-simulation',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.scss'
})
export class SimulationComponent implements OnInit{
  isAdvancedSettings: boolean = false;

  defaultConfig: any;
  currentConfig: any;

  configTypes = [
    { id: 'CONTINUOUS_GRADIENTS', name: 'Continuous Gradients' },
    { id: 'WEDGES', name: 'Wedges' },
    { id: 'STRIPE', name: 'Stripe' },
    { id: 'GAP', name: 'Gap' }
  ];

  selectedConfigType: string = 'CONTINUOUS_GRADIENTS';

  basicSettingsForm: FormGroup = new FormGroup({});
  advancedSettingsForm: FormGroup = new FormGroup<any>({});
  switchesForm: FormGroup = new FormGroup<any>({});
  adaptationForm: FormGroup = new FormGroup<any>({});

  constructor(
    private simulationService: SimulationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getDefaultConfig();
  }

  startSimulation() {
    const mergedValues = {
      ...this.basicSettingsForm.value,
      ...this.advancedSettingsForm.value,
      ...this.switchesForm.value,
      ...this.adaptationForm.value
    };

    // Update currentConfig with merged values
    Object.keys(mergedValues).forEach(key => {
      if (this.currentConfig.hasOwnProperty(key)) {
        this.currentConfig[key] = mergedValues[key];
      }
    });

    console.log('Updated Current Config:', this.currentConfig);

    this.simulationService.startSimulation(this.currentConfig).subscribe(response => {
      console.log(response);
    }, error => {
      console.error('Error:', error);
    });
  }

  onConfigTypeChange() {
    if (this.defaultConfig && this.selectedConfigType) {
      this.currentConfig = this.defaultConfig[this.selectedConfigType];
    }

    this.initForm();
  }

  onAdvancedClick() {
    this.isAdvancedSettings = !this.isAdvancedSettings;
  }

  private getDefaultConfig() {
    this.simulationService.getDefaultConfig().subscribe((data: any) => {
      this.defaultConfig = data;
      this.currentConfig = data[this.selectedConfigType || 'CONTINUOUS_GRADIENTS'];
      this.initForm();
    });
  }

  private initForm() {
    this.basicSettingsForm = this.fb.group({
      gc_count: [this.currentConfig?.gc_count],
      gc_size: [this.currentConfig?.gc_size],
      step_size: [this.currentConfig?.step_size],
      step_num: [this.currentConfig?.step_num]
    });

    this.advancedSettingsForm = this.fb.group({
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
    })

    this.adaptationForm = this.fb.group({
      adaptation_enabled: [this.currentConfig?.adaptation_enabled],
      adaptation_mu: [this.currentConfig?.adaptation_mu],
      adaptation_lambda: [this.currentConfig?.adaptation_lambda],
      adaptation_history: [this.currentConfig?.adaptation_history],
    })
  }
}
