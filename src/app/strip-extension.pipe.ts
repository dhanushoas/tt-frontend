import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stripExtension'
})
export class StripExtensionPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';

        // If it's a comma-separated list, clean each item
        if (value.includes(',')) {
            return value.split(',')
                .map(item => item.trim().replace(/\.[^/.]+$/, ""))
                .join(', ');
        }

        // Trim and remove the last extension robustly (case-insensitive)
        return value.trim().replace(/\.[^/.]+$/, "");
    }
}
