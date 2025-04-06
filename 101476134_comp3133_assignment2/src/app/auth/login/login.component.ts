import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    const values = form.value;
    const usernameOrEmail = values['login-username'];
    const password = values['login-password'];

    this.authService.login(usernameOrEmail, password).subscribe({
      next: (response) => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Login error:', error);
        
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          this.errorMessage = error.graphQLErrors[0].message;
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
        
        this.loading = false;
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
