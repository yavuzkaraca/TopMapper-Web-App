import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimulationService } from '../../../services/simulation.service';
import {TitleCasePipe, KeyValuePipe, NgForOf, NgIf} from '@angular/common';
import { SimulationResult } from '../../../models/simulation-result.model';


@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    TitleCasePipe,
    KeyValuePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  summaryData: any;
  resultImages: { [key: string]: string } = {};  // Store images as a dictionary with names as keys

  constructor(
    private router: Router,
    private simulationService: SimulationService
  ) {}

  ngOnInit() {
    this.fetchResults();
  }

  fetchResults() {
    this.simulationService.getSimulationResults().subscribe(
      (data: any) => {
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
    this.router.navigate(['/simulation']).then(() => {}); // Adjust the route as needed
  }
}
