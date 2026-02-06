import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isBackgroundWhite: boolean = false;
  selectedPlaceCount: number = 0;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    // Check for selected places count in local storage
    this.updateCartCount();

    // Set initial language from local storage if exists
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      this.langService.setLanguage(storedLang);
    }

    // Listen for storage changes to update cart count
    window.addEventListener('storage', () => this.updateCartCount());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('storage', () => this.updateCartCount());
  }

  updateCartCount() {
    const places = JSON.parse(localStorage.getItem('selectedPlaces') || '[]');
    this.selectedPlaceCount = places.length;
  }

  setLanguage(lang: string) {
    this.langService.setLanguage(lang);
  }
}
