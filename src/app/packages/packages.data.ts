export interface TourPackage {
    title: string;
    rating: number;
    placesCovered: { name: string; description: string }[];
    highlights: string[];
    duration: string;
    image: string;
    cost?: string;
}

export interface CategoryInfo {
    title: string;
    description: string;
    bestTime: { period: string; details: string };
    inclusions: string[];
    extrasections?: { title: string; items: string[]; icon?: string }[];
}

export const TEMPLE_PACKAGES: TourPackage[] = [
    {
        title: 'Madurai – Rameswaram – Kanyakumari Package',
        rating: 4,
        placesCovered: [
            { name: 'Madurai', description: 'Meenakshi Amman Temple' },
            { name: 'Rameswaram', description: 'Ramanathaswamy Temple' },
            { name: 'Kanyakumari', description: 'Vivekananda Rock & Kumari Amman Temple' }
        ],
        highlights: [
            'One of the most famous spiritual circuits in South India',
            'Sacred Jyotirlinga temple visit',
            'Sunrise & sunset view at Kanyakumari'
        ],
        duration: '3 to 4 Days',
        image: 'madurai_package'
    },
    {
        title: 'Chidambaram – Kumbakonam – Thanjavur Package',
        rating: 4,
        placesCovered: [
            { name: 'Chidambaram', description: 'Nataraja Temple' },
            { name: 'Kumbakonam', description: 'Navagraha Temples' },
            { name: 'Thanjavur', description: 'Brihadeeswarar Temple' }
        ],
        highlights: [
            'Navagraha temple pilgrimage',
            'UNESCO heritage temples',
            'Famous Chola architecture'
        ],
        duration: '2 to 3 Days',
        image: 'chidambaram_package'
    },
    {
        title: 'Tirupati – Tiruttani – Kanchipuram Package',
        rating: 4,
        placesCovered: [
            { name: 'Tirupati', description: 'Balaji Temple' },
            { name: 'Tiruttani', description: 'Murugan Temple' },
            { name: 'Kanchipuram', description: 'Kamakshi & Ekambareswarar Temple' }
        ],
        highlights: [
            'One of the richest and most visited temples in the world',
            'Murugan Arupadai Veedu temple visit',
            'Kanchipuram – City of Thousand Temples'
        ],
        duration: '2 to 3 Days',
        image: 'tirupati_package'
    },
    {
        title: 'Palani – Madurai – Thiruchendur Package',
        rating: 4,
        placesCovered: [
            { name: 'Palani', description: 'Murugan Temple' },
            { name: 'Madurai', description: 'Meenakshi Amman Temple' },
            { name: 'Thiruchendur', description: 'Murugan Temple' }
        ],
        highlights: [
            'Two Arupadai Veedu Murugan temples',
            'Famous abhishekam and prasadam',
            'Scenic hill temple experience'
        ],
        duration: '3 Days',
        image: 'palani_package'
    },
    {
        title: 'Complete Arupadai Veedu Murugan Package',
        rating: 5,
        placesCovered: [
            { name: 'Tiruttani', description: 'Arupadai Veedu' },
            { name: 'Swamimalai', description: 'Arupadai Veedu' },
            { name: 'Palani', description: 'Arupadai Veedu' },
            { name: 'Thiruchendur', description: 'Arupadai Veedu' },
            { name: 'Pazhamudircholai', description: 'Arupadai Veedu' },
            { name: 'Thiruparankundram', description: 'Arupadai Veedu' }
        ],
        highlights: [
            'Covers all 6 sacred Murugan temples',
            'Most powerful pilgrimage circuit for Murugan devotees'
        ],
        duration: '5 to 7 Days',
        image: 'arupadai_package'
    }
];

export const EDUCATION_PACKAGES: TourPackage[] = [
    {
        title: 'Heritage & Cultural Education Tour',
        rating: 5,
        placesCovered: [
            { name: 'Madurai', description: 'History & Culture' },
            { name: 'Thanjavur', description: 'Art & Architecture' },
            { name: 'Mahabalipuram', description: 'UNESCO Monuments' }
        ],
        highlights: [
            'Learn Tamil history and temple architecture',
            'Stone sculpture study in Mahabalipuram',
            'Cultural workshops and traditional arts'
        ],
        duration: '4 to 5 Days',
        image: 'education_heritage',
        cost: '₹7,000+'
    },
    {
        title: 'Nature & Biodiversity Study Tour',
        rating: 4,
        placesCovered: [
            { name: 'Ooty', description: 'Hill Ecosystem' },
            { name: 'Mudumalai', description: 'Wildlife Sanctuary' },
            { name: 'Pichavaram', description: 'Mangrove Forest' }
        ],
        highlights: [
            'Environment and biodiversity learning',
            'Wildlife spotting and conservation study',
            'Ecosystem interaction at Pichavaram'
        ],
        duration: '3 to 4 Days',
        image: 'education_nature',
        cost: '₹8,500+'
    },
    {
        title: 'Science & Innovation Knowledge Tour',
        rating: 5,
        placesCovered: [
            { name: 'Chennai', description: 'Science Centers & Museums' },
            { name: 'Coimbatore', description: 'Industrial Museums' }
        ],
        highlights: [
            'Visit planetariums and interactive science parks',
            'Practical physics concepts at science centers',
            'Museum exploration of historical innovations'
        ],
        duration: '2 to 3 Days',
        image: 'education_science',
        cost: '₹6,000+'
    }
];

export const HONEYMOON_PACKAGES: TourPackage[] = [
    {
        title: 'Ooty – Queen of Hill Stations Romantic Getaway',
        rating: 5,
        placesCovered: [
            { name: 'Ooty Lake', description: 'Romantic Boating' },
            { name: 'Botanical Garden', description: 'Scenic Walks' },
            { name: 'Nilgiri Mountain Railway', description: 'Toy Train Ride' }
        ],
        highlights: [
            'Cool climate and private resort stays',
            'Tea estate photography sessions',
            'Sunset views and candle light dinners'
        ],
        duration: '3 to 4 Days',
        image: 'honeymoon_ooty',
        cost: '₹25,000+'
    },
    {
        title: 'Kodaikanal – Princess of Hill Stations',
        rating: 5,
        placesCovered: [
            { name: 'Kodai Lake', description: 'Star-shaped Lake' },
            { name: 'Coaker’s Walk', description: 'Misty Mountains' },
            { name: 'Pine Forest', description: 'Cinematic Atmosphere' }
        ],
        highlights: [
            'Walking in the clouds at Coaker’s Walk',
            'Cycling around the serene Kodai Lake',
            'Peaceful pine forest and waterfall visits'
        ],
        duration: '2 to 3 Days',
        image: 'honeymoon_kodai',
        cost: '₹20,000+'
    },
    {
        title: 'Pondicherry – French Style Romance',
        rating: 4,
        placesCovered: [
            { name: 'Promenade Beach', description: 'Sunrise Walks' },
            { name: 'French Colony', description: 'Colonial Streets' },
            { name: 'Paradise Beach', description: 'Island Vibes' }
        ],
        highlights: [
            'French colonial street exploration',
            'Romantic cafes and beach resort stays',
            'Candle light dinner by the sea'
        ],
        duration: '2 to 3 Days',
        image: 'honeymoon_pondicherry',
        cost: '₹22,000+'
    }
];

export const PARTY_PACKAGES: TourPackage[] = [
    {
        title: 'Standard DJ Party Package',
        rating: 4,
        placesCovered: [
            { name: 'Resort Party', description: 'Evening Entertainment' }
        ],
        highlights: [
            'Professional DJ with high-quality sound',
            'LED lights, dance floor and smoke effects',
            'Customized playlist for your group'
        ],
        duration: '3 to 4 Hours',
        image: 'dj_standard',
        cost: '₹15,000+'
    },
    {
        title: 'Premium DJ & Stage Entertainment',
        rating: 5,
        placesCovered: [
            { name: 'Gala Event', description: 'Celebrity DJ Show' }
        ],
        highlights: [
            'Experienced/Celebrity DJ performance',
            'Laser lighting and professional stage setup',
            'Crowd interaction and live instruments'
        ],
        duration: 'Full Night Party',
        image: 'dj_premium',
        cost: '₹50,000+'
    }
];

export const CATEGORY_METADATA: { [key: string]: CategoryInfo } = {
    temple: {
        title: 'Spiritual',
        description: 'Explore ancient temples and sacred heritage sites.',
        bestTime: { period: 'October to March', details: 'Pleasant weather for architecture exploration.' },
        inclusions: ['Temple darshan assistance', 'Transport', 'Hotel stay', 'Food (optional)'],
        extrasections: [
            { title: 'Popular Temple Types', items: ['Chola Architecture', 'Pallava Monoliths', 'Nayyak Style gopurams'], icon: 'bi-bank' }
        ]
    },
    education: {
        title: 'Educational',
        description: 'Student-friendly learning tours with industrial and cultural exposure.',
        bestTime: { period: 'Throughout the Year', details: 'Best for school and college groups.' },
        inclusions: ['Tour guide support', 'Institutional IV permissions', 'Group transport', 'Meals & accommodation'],
        extrasections: [
            { title: 'Benefits', items: ['Practical learning experience', 'Industrial exposure', 'Teamwork skills', 'Career inspiration'], icon: 'bi-mortarboard' }
        ]
    },
    honeymoon: {
        title: 'Honeymoon',
        description: 'Romantic getaways to hill stations and serene beaches.',
        bestTime: { period: 'October to March', details: 'Perfect romantic weather statewide.' },
        inclusions: ['Private resort stays', 'Candle light dinner', 'Couple activities', 'Photography sessions'],
        extrasections: [
            { title: 'Tips for Couples', items: ['Book private resorts', 'Choose hill + beach combo', 'Pre-book inclusive meals', 'Avoid peak crowds'], icon: 'bi-heart-pulse' }
        ]
    },
    party: {
        title: 'DJ & Event',
        description: 'High-energy entertainment for group trips and events.',
        bestTime: { period: 'Evening / Nights', details: 'Ideal for concluding your day of tours.' },
        inclusions: ['Sound systems', 'Lighting setup', 'DJ Artist', 'Events coordination'],
        extrasections: [
            { title: 'Popular Party Spots', items: ['ECR Beach Resorts', 'Ooty Private Halls', 'Chennai City Venues'], icon: 'bi-music-note-beamed' }
        ]
    }
};
