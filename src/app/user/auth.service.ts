
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    User,
    UserCredential
} from 'firebase/auth';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private app: any;
    private auth: any;

    constructor() {
        this.app = initializeApp(environment.firebase);
        this.auth = getAuth(this.app);
    }

    /**
     * Sign up with Email and Password
     * Sends verification email automatically
     */
    async signUpWithEmail(email: string, password: string): Promise<User> {
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            // Send verification email
            await sendEmailVerification(userCredential.user);

            return userCredential.user;
        } catch (error: any) {
            console.error('Firebase Sign Up Error', error);
            throw error;
        }
    }

    /**
     * Sign in with Email and Password
     * Checks if email is verified
     */
    async signInWithEmail(email: string, password: string): Promise<User | null> {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            const user = userCredential.user;

            // Check if email is verified
            if (!user.emailVerified) {
                // Send verification email again
                await sendEmailVerification(user);
                throw new Error('Please verify your email. A new verification link has been sent.');
            }

            // Store user info in localStorage
            localStorage.setItem('userEmail', user.email || '');
            localStorage.setItem('userId', user.uid);

            return user;
        } catch (error: any) {
            console.error('Firebase Sign In Error', error);
            throw error;
        }
    }

    /**
     * Sign in with Google
     */
    async signInWithGoogle(): Promise<User | null> {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(this.auth, provider);
            const user = result.user;

            // Store user info
            localStorage.setItem('userEmail', user.email || '');
            localStorage.setItem('userId', user.uid);

            return user;
        } catch (error: any) {
            console.error('Firebase Google Auth Error', error);
            throw error;
        }
    }

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    /**
     * Sign out
     */
    async signOut(): Promise<void> {
        try {
            await this.auth.signOut();
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
        } catch (error) {
            console.error('Sign out error', error);
            throw error;
        }
    }
}
