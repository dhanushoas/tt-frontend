import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, search: string): string {
    if (!search || !value) {
      return value;
    }
    const pattern = new RegExp(search, 'gi');
    return value.replace(pattern, (match) => `<strong>${match}</strong>`);
  }

}
