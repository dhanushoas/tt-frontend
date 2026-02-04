import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastService } from '../../toast.service';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
    status: 'verifying' | 'success' | 'error' = 'verifying';
    message: string = 'Verifying your email...';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        const token = this.route.snapshot.queryParams['token'];
        if (!token) {
            this.status = 'error';
            this.message = 'Invalid verification link (missing token).';
            return;
        }

        this.userService.verifyEmail(token).subscribe({
            next: (res) => {
                this.status = 'success';
                this.message = res.message || 'Email verified successfully!';
                this.toastService.show(this.message, 'success');
                // Redirect to Login after 3 seconds
                setTimeout(() => this.router.navigate(['/signin']), 3000);
            },
            error: (err) => {
                this.status = 'error';
                this.message = err.error?.message || 'Verification failed. Token may be invalid or expired.';
                this.toastService.show(this.message, 'danger');
            }
        });
    }
}
