import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DashboardService} from '../../services/dashboard.service';
import {Router} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  userId: number | null = null;
  results: any[] = []; // Store user results here

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get userId from AuthService
    this.userId = this.authService.getCurrentUserId();

    // Fetch results for the user
    if (this.userId) {
      this.dashboardService.getUserResults(this.userId).subscribe(
        (results) => {
          this.results = results;
        },
        (error) => {
          console.error('Error fetching user results:', error);
        }
      );
    }
  }

  viewResult(resultId: number): void {
    // Navigate to the result detail page
    this.router.navigate(['/result', resultId]);
  }

}
