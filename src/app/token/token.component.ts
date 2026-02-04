import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent {
  alertMessage: string = '';

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  verifyToken(): void {
    const tokenElement = document.getElementById('jwt-token') as HTMLInputElement;
    if (tokenElement) {
      const token = tokenElement.value;
      this.tokenService.verifySecretKey(token)
        .subscribe(
          response => {
            console.log('Secret key verified successfully:', response);
            this.alertMessage = 'Token verified successfully.';
            // Set flag indicating successful token verification
            this.tokenService.setVerified(true);
            // Navigate to the desired route after successful verification
            this.router.navigate(['/admin-signin']);
          },
          error => {
            console.error('Error verifying secret key:', error);
            this.alertMessage = 'Error verifying token. Please try again.';
          }
        );
    }
  }
}
