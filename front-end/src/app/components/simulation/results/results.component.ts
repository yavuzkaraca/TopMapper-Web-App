import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SimulationService} from '../../../services/simulation.service';
import {TitleCasePipe, KeyValuePipe, NgForOf, NgIf, JsonPipe} from '@angular/common';
import {SimulationResult} from '../../../models/simulation-result.model';


@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    TitleCasePipe,
    KeyValuePipe,
    NgForOf,
    NgIf,
    JsonPipe
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  summaryData: any;
  resultImages: { [key: string]: string } = {};  // Store images as a dictionary with names as keys

  resultImageMetadata = [
    {key: 'growth_cones', name: 'Growth Cones', position: 1},
    {key: 'substrate', name: 'Substrate Overview', position: 2},
    {key: 'substrate_separate', name: 'Substrate Separate', position: 3},
    {key: 'projection_linear', name: 'Projection Linear', position: 4},
    {key: 'results_on_substrate', name: 'Results on Substrate', position: 5},
    {key: 'trajectory_on_substrate', name: 'Trajectory on Substrate', position: 6},
    {key: 'trajectories', name: 'Trajectories', position: 7},
    {key: 'adaptation', name: 'Adaptation', position: 8}
  ];

  isModalOpen = false;
  currentImageSrc = '';

  openImageModal(src: string): void {
    this.currentImageSrc = src;
    this.isModalOpen = true;
  }

  closeImageModal(): void {
    this.isModalOpen = false;
    this.currentImageSrc = '';
  }

  constructor(
    private router: Router,
    private simulationService: SimulationService
  ) {
  }

  ngOnInit() {
    this.fetchResults();
  }

  fetchResults() {
    this.simulationService.getSimulationResults().subscribe(
      (data: any) => {
        console.log(data)
        // Parse and assign data to display in the UI
        this.summaryData = data.summary;     // Assuming backend returns a summary section
        this.resultImages = data.images;     // Assuming backend returns a dictionary of base64 images
      },
      (error) => {
        console.error('Error fetching simulation results:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/simulation']).then(() => {
    }); // Adjust the route as needed
  }


}
