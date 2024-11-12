import { Component } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe((success) => {
      if (success) {
        console.log('Success')
        this.router.navigate(['/about']);
      } else {
        console.log('Invalid username or password');
      }
    });
  }
}
