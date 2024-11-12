import { Component } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../login/login.component.scss']
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.email, this.password).subscribe((success) => {
      if (success) {
        console.log('Registration successful!');
        this.router.navigate(['/login']);
      } else {
        console.log('Something went wrong');
      }
    });
  }
}
