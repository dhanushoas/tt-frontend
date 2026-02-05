import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stripExtension'
})
export class StripExtensionPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';
        return value.replace(/\.(jpg|jpeg|png|gif|webp|bmp|JPG|JPEG|PNG|GIF|WEBP|BMP)$/, "") || value;
    }
}
