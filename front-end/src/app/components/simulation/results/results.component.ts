import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/simulation']).then(r => {}); // Adjust the route as needed
  }
}

