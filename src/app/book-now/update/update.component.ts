// update.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  book: Book = new Book();

  constructor(
    private bookService: BookService,
    private active: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBookByCustomId();
  }

  getBookByCustomId(): void {
    const customId = this.active.snapshot.params['customId'];

    if (customId) {
      this.bookService.getBookByCustomId(Number(customId)).subscribe(
        (book: Book) => {
          this.book = book;
        },
        (error: any) => {
          console.error(error);
        }
      );
    } else {
      console.error('Invalid or missing customId');
    }
  }

  goToUpdate(): void {
    this.bookService.updateBook(this.book.customId, this.book).subscribe(
      (res: Book) => {
        console.log(res);
      },
      (error: any) => {
        console.error(error);
      }
    );
    this.submit();
  }

  submit(): void {
    this.router.navigate(['getall']);
  }
}
