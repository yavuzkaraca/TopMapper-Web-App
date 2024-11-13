import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardService} from '../../../services/dashboard.service';
import {JsonPipe, NgForOf, NgIf} from '@angular/common';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-user-result',
  standalone: true,
  imports: [
    JsonPipe,
    MatProgressBar,
    NgForOf,
    NgIf
  ],
  templateUrl: './user-result.component.html',
  styleUrls: ['./user-result.component.scss', '../../simulation/results/results.component.scss']
})
export class UserResultComponent implements OnInit{
  summaryData: any;
  resultImages: { [key: string]: string } = {};

  resultImageMetadata = [
    {key: 'growth_cones_pre', name: 'Growth Cones Pre', position: 1},
    {key: 'substrate', name: 'Substrate Overview', position: 2},
    {key: 'substrate_separate', name: 'Substrate Separate', position: 3},
    {key: 'growth_cones_post', name: 'Growth Cones Post', position: 4},
    {key: 'projection_linear', name: 'Projection Linear', position: 5},
    {key: 'adaptation', name: 'History', position: 9},
    {key: 'results_on_substrate', name: 'Results on Substrate', position: 6},
    {key: 'trajectory_on_substrate', name: 'Trajectory on Substrate', position: 7},
    {key: 'trajectories', name: 'Trajectories', position: 8}
  ];

  isModalOpen = false;
  currentImageSrc = '';

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getResultById()
  }

  openImageModal(src: string): void {
    this.currentImageSrc = src;
    this.isModalOpen = true;
  }

  closeImageModal(): void {
    this.isModalOpen = false;
    this.currentImageSrc = '';
  }

  goBack() {
    this.router.navigate(['/dashboard']).then(() => {
    }); // Adjust the route as needed
  }

  getResultById() {
    const resultId = Number(this.route.snapshot.paramMap.get('resultId'));

    if (resultId) {
      // Fetch result details
      this.dashboardService.getResultById(resultId).subscribe(
        (result) => {
          this.summaryData = result.summary
          this.resultImages = result.images
        },
        (error) => {
          console.error('Error fetching result:', error);
        }
      );
    }
  }
}
