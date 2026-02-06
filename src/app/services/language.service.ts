import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private currentLanguage = new BehaviorSubject<string>(localStorage.getItem('language') || 'en');
    currentLanguage$ = this.currentLanguage.asObservable();

    private translations: any = {
        'en': {
            'HOME': 'Home',
            'CONTACTS': 'Contacts',
            'ABOUT': 'About',
            'LANGUAGE': 'Language',
            'PLACES_TO_VISIT': 'Places to Visit',
            'EXPLORE_NAV': 'Explore',
            'SIGN_IN': 'Sign In',
            'SIGN_OUT': 'Sign Out',
            'BOOKINGS': 'Bookings',
            'NORTH_TN': 'North Tamilnadu',
            'CENTRAL_TN': 'Central Tamilnadu',
            'WEST_TN': 'West Tamilnadu',
            'SOUTH_TN': 'South Tamilnadu',
            'CULTURE_TOURS': 'Tamil Nadu Culture Tours',
            'TEMPLE_TOURS': 'Tamil Nadu Temple Tours',
            'HONEYMOON_TOURS': 'Tamil Nadu Honeymoon Tours',
            'NATURE_TOURS': 'Tamil Nadu Nature & Wildlife Tours',
            'HILLSTATION_TOURS': 'Tamil Nadu Hillstation Tours',
            'SHORT_TOURS': 'Tamil Nadu Short Tours',
            'FAMILY_TOURS': 'Tamil Nadu Family Tours',
            'DIVYA_DESAM_TOURS': 'Tamil Nadu Divya Desam Tours',
            'PLAN_TRIP': "Let's Plan Your Trip",
            'REVIEW_JOURNEY': 'Review Your Journey',
            'MY_CART': 'My Cart',
            'HERO_TITLE': 'TAMIL NADU TOUR',
            'HERO_SUBTITLE': '& HOLIDAY PACKAGES',
            'HERO_DESC': 'A Kaleidoscope of traditions, culture, and vibrant geographies, Tamil Nadu speaks for itself as a soul-stirring journey. From the snow-covered peaks to the coastline, natural greenery to depths of spirituality, and clusters of cultural shades.',
            'SEARCH_PLACEHOLDER': 'Search for districts in Tamil Nadu...',
            'POPULAR_PACKAGES': 'POPULAR PACKAGES',
            'DEVOTIONAL': 'Devotional Packages',
            'EDUCATIONAL': 'Educational Packages',
            'HONEYMOON': 'Honeymoon',
            'NATURE': 'Nature',
            'PARTY': 'DJ Packages',
            'TOP_RATED': 'TOP RATED',
            'PACKAGES': 'PACKAGES',
            'HANDPICKED': 'Handpicked destinations based on traveler ratings',
            'PAYMENT_SECTION': 'Payment Portal',
            'MAKE_PAYMENT': 'Secure Payment',
            'BOOKING_DETAILS': 'Booking Details',
            'PRINT_RECEIPT': 'Download Receipt'
        },
        'ta': {
            'HOME': 'முகப்பு',
            'CONTACTS': 'தொடர்புகள்',
            'ABOUT': 'பற்றி',
            'LANGUAGE': 'மொழி',
            'PLACES_TO_VISIT': 'பார்க்க வேண்டிய இடங்கள்',
            'EXPLORE_NAV': 'ஆராயுங்கள்',
            'SIGN_IN': 'உள்நுழைக',
            'SIGN_OUT': 'வெளியேறு',
            'BOOKINGS': 'பதிவு செய்தவை',
            'NORTH_TN': 'வட தமிழ்நாடு',
            'CENTRAL_TN': 'மத்திய தமிழ்நாடு',
            'WEST_TN': 'மேற்கு தமிழ்நாடு',
            'SOUTH_TN': 'தெற்கு தமிழ்நாடு',
            'CULTURE_TOURS': 'தமிழ்நாடு கலாச்சார சுற்றுலா',
            'TEMPLE_TOURS': 'தமிழ்நாடு கோயில் சுற்றுலா',
            'HONEYMOON_TOURS': 'தமிழ்நாடு தேனிலவு சுற்றுலா',
            'NATURE_TOURS': 'தமிழ்நாடு இயற்கை மற்றும் வனவிலங்கு சுற்றுலா',
            'HILLSTATION_TOURS': 'தமிழ்நாடு மலைவாசஸ்தல சுற்றுலா',
            'SHORT_TOURS': 'தமிழ்நாடு குறுகிய சுற்றுலா',
            'FAMILY_TOURS': 'தமிழ்நாடு குடும்ப சுற்றுலா',
            'DIVYA_DESAM_TOURS': 'தமிழ்நாடு திவ்ய தேசம் சுற்றுலா',
            'PLAN_TRIP': 'உங்கள் பயணத்தைத் திட்டமிடுங்கள்',
            'REVIEW_JOURNEY': 'உங்கள் பயணத்தை மதிப்பாய்வு செய்யவும்',
            'MY_CART': 'எனது கூடை',
            'HERO_TITLE': 'தமிழ்நாடு சுற்றுலா',
            'HERO_SUBTITLE': '& விடுமுறை தொகுப்புகள்',
            'HERO_DESC': 'பாரம்பரியங்கள், கலாச்சாரம் மற்றும் துடிப்பான புவியியல் ஆகியவற்றின் ஒரு கலைக்களஞ்சியம், தமிழ்நாடு ஒரு ஆன்மாவைத் தூண்டும் பயணமாகத் தன்னைத்தானே பேசுகிறது. பனி மூடிய சிகரங்கள் முதல் கடற்கரை வரை, இயற்கை பசுமை முதல் ஆன்மீகத்தின் ஆழம் மற்றும் கலாச்சார நிழல்களின் கூட்டங்கள் வரை.',
            'SEARCH_PLACEHOLDER': 'தமிழ்நாட்டில் உள்ள மாவட்டங்களைத் தேடுங்கள்...',
            'POPULAR_PACKAGES': 'பிரபலமான தொகுப்புகள்',
            'DEVOTIONAL': 'பக்தி தொகுப்புகள்',
            'EDUCATIONAL': 'கல்வி தொகுப்புகள்',
            'HONEYMOON': 'தேனிலவு',
            'NATURE': 'இயற்கை',
            'PARTY': 'டிஜே தொகுப்புகள்',
            'TOP_RATED': 'சிறந்த மதிப்பீடு',
            'PACKAGES': 'தொகுப்புகள்',
            'HANDPICKED': 'பயணிகளின் மதிப்பீடுகளின் அடிப்படையில் தேர்ந்தெடுக்கப்பட்ட இடங்கள்',
            'PAYMENT_SECTION': 'கட்டண இணையதளம்',
            'MAKE_PAYMENT': 'பாதுகாப்பான கட்டணம்',
            'BOOKING_DETAILS': 'பதிவு விவரங்கள்',
            'PRINT_RECEIPT': 'ரசீது பதிவிறக்கம்'
        }
    };

    setLanguage(lang: string) {
        this.currentLanguage.next(lang);
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        if (lang === 'ta') {
            document.body.classList.add('tamil-font');
        } else {
            document.body.classList.remove('tamil-font');
        }
    }

    getLanguage() {
        return this.currentLanguage.value;
    }

    translate(key: string): string {
        return this.translations[this.getLanguage()][key] || key;
    }
}
