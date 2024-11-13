import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SimulationService} from '../../../services/simulation.service';
import {TitleCasePipe, KeyValuePipe, NgForOf, NgIf, JsonPipe} from '@angular/common';
import {SimulationResult} from '../../../models/simulation-result.model';
import {interval, Subscription} from 'rxjs';
import {MatProgressBar} from '@angular/material/progress-bar';


@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    TitleCasePipe,
    KeyValuePipe,
    NgForOf,
    NgIf,
    JsonPipe,
    MatProgressBar
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  summaryData: any;
  resultImages: { [key: string]: string } = {};  // Store images as a dictionary with names as keys

  progress = 0;
  loading = true;
  progressCheckInterval: Subscription | undefined;

  resultImageMetadata = [
    {key: 'growth_cones_pre', name: 'Growth Cones Pre', position: 1},
    {key: 'substrate', name: 'Substrate Overview', position: 2},
    {key: 'substrate_separate', name: 'Substrate Separate', position: 3},
    {key: 'growth_cones_post', name: 'Growth Cones Post', position: 4},
    {key: 'projection_linear', name: 'Projection Linear', position: 5},
    {key: 'results_on_substrate', name: 'Results on Substrate', position: 6},
    {key: 'trajectory_on_substrate', name: 'Trajectory on Substrate', position: 7},
    {key: 'trajectories', name: 'Trajectories', position: 8},
    {key: 'adaptation', name: 'History', position: 9}
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
    private simulationService: SimulationService,
  ) {
  }

  ngOnInit() {
    this.checkProgress();
  }

  checkProgress() {
    // Poll for progress every 2 seconds
    this.progressCheckInterval = interval(500).subscribe(() => {
      this.simulationService.getProgress().subscribe(
        (progressData: any) => {
          this.progress = progressData.progress;
          if (this.progress >= 100) {
            // Progress is complete; stop interval and fetch results
            this.progressCheckInterval?.unsubscribe();
            this.fetchResults();
          }
        },
        (error) => {
          console.error('Error fetching simulation progress:', error);
        }
      );
    });
  }

  fetchResults() {
    this.simulationService.getSimulationResults().subscribe(
      (data: any) => {
        console.log(data)
        // Parse and assign data to display in the UI
        this.summaryData = data.summary;     // Assuming backend returns a summary section
        this.resultImages = data.images;
        this.loading = false;

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
