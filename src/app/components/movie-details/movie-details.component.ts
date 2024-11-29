import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OmdbService } from '../../services/omdb.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnChanges {
  @Input() movieId: string | null = null;
  movieDetails: any = null;
  errorMessage: string = '';

  constructor(private omdbService: OmdbService) {}

  ngOnChanges(): void {
    if (this.movieId) {
      this.omdbService.getMovieDetails(this.movieId).subscribe({
        next: (details) => (this.movieDetails = details),
        error: (error) => (this.errorMessage = error),
      });
    }
  }
}
