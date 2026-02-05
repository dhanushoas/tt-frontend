import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mood-finder',
  templateUrl: './mood-finder.component.html',
  styleUrls: ['./mood-finder.component.css']
})
export class MoodFinderComponent {
  moods = [
    { id: 'temple', name: 'Spiritual', icon: 'bi-house-heart', color: '#ff6b6b', desc: 'Ancient temples & sacred vibes' },
    { id: 'mountain', name: 'Adventurous', icon: 'bi-mountain', color: '#4ecdc4', desc: 'Hills, treks & nature trails' },
    { id: 'honeymoon', name: 'Romantic', icon: 'bi-heart-fill', color: '#f783ac', desc: 'Scenic views & peaceful stays' },
    { id: 'education', name: 'Heritage', icon: 'bi-bank', color: '#fcc419', desc: 'History, museums & monuments' },
    { id: 'party', name: 'Relaxed', icon: 'bi-cup-straw', color: '#22b8cf', desc: 'Beaches, cafes & night life' }
  ];

  constructor(private router: Router) { }

  selectMood(moodId: string) {
    this.router.navigate(['/packages'], { queryParams: { category: moodId } });
  }
}
