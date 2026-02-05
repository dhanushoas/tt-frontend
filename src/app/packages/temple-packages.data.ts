export interface TemplePackage {
    title: string;
    rating: number;
    placesCovered: { name: string; description: string }[];
    highlights: string[];
    duration: string;
    image: string;
}

export const TEMPLE_PACKAGES: TemplePackage[] = [
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
