import { BookingType, Destination, FeaturedDestination, HeroSlide, Mood } from './types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2600&auto=format&fit=crop',
    title: 'Discover the Soul of India',
    subtitle: 'From the serene backwaters of Kerala to the majestic peaks of the Himalayas, find your perfect mood.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2940&auto=format&fit=crop',
    title: 'Adventure Awaits You',
    subtitle: 'Experience the thrill of high altitudes, snow-capped peaks, and untouched nature.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2946&auto=format&fit=crop',
    title: 'Tropical Paradise Escape',
    subtitle: 'Relax on golden sands and dive into crystal clear waters in the world\'s best beach destinations.'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2600&auto=format&fit=crop',
    title: 'Experience Global Culture',
    subtitle: 'Immerse yourself in the history, art, and vibrant flavors of iconic international cities.'
  }
];

export const MOODS: Mood[] = [
  { id: 'relaxed', name: 'Relaxed', icon: 'spa', colorClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  { id: 'adventure', name: 'Adventure', icon: 'hiking', colorClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { id: 'romantic', name: 'Romantic', icon: 'favorite', colorClass: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
  { id: 'spiritual', name: 'Spiritual', icon: 'temple_buddhist', colorClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { id: 'foodie', name: 'Foodie', icon: 'restaurant', colorClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  { id: 'beach', name: 'Beach', icon: 'beach_access', colorClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
  { id: 'nightlife', name: 'Nightlife', icon: 'nightlife', colorClass: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400' },
];

export const TRENDING_DESTINATIONS: Destination[] = [
  {
    id: 'goa',
    name: 'Goa, India',
    price: '₹12,999',
    description: 'Sun, sand, and seafood. Experience the ultimate beach vacation.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo2QavBzKBZUddieX7QvBQ2QPKxta_A_q3Vv7bN97X3lhYZXdMoDOS5kmTAnnhCyNzI5MtdOZhRG1FW5rB-RufgwTQq0ENTEcvCyyMWj5cmj_6USG-gnhlzw7N1POBRxAk0_oSutj3tnNx2nc3sIgLYK8FQzb20JDqupGC8zj8Qv-rxcEfz8dokgs6bfMSNDMlKmrkS-1mFAqqa2DXNg_FbErIZnTixhBvy4o9VUKOpO3GozqfTA-3HolXZ-TMzTLd43wJGeKQZ2U',
    rating: 4.8
  },
  {
    id: 'jaipur',
    name: 'Jaipur, Rajasthan',
    price: '₹8,499',
    description: 'Explore the Pink City, ancient forts, and royal heritage.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy6Tu6w58uXSdP6lmJ-Lm6u3xcaBCj2s_oltwe3qetyIXpme9Auo5cIzYgJ_jl8ihJNAcH7MypZLf6-1fAgFv-mI3wx8K8ZLEo2piEplhRRFG1sI9VmBgDwI4FXFuaeICk8TLvyHIdArfBl3VtRbFxsEFP6pjmaTOvaq0V_OgTFyLanTVvWDdu7gW7EZR3RJYYZD9KN4lmn0GPfiNA6VAEHGPXMqdg1Op8unUIGYbKhh_T-VCRCnIbH5HwGlzMoz23YRJtfQSIISs',
    rating: 4.6
  },
  {
    id: 'manali',
    name: 'Manali, HP',
    price: '₹15,200',
    description: 'Adventure sports, snow-capped peaks, and pine forests.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG4lfDwqEfzu8K679fs_JOv48oTCM80E_THEdICXvpxe6s14utDwUq7HkfBHFClL3k6gPtaXT__zvtEOkXSycO12Tfq5gdwpp7qawec952kmEim0o04HxV-tEzkuCVSckuCaHEibWE0OelR8CkNGdWUWjhryoRe7jtxx2z5e3A4Z8Pbhf9lRQyKmBZrNj9dH6z_ylqX6PFh332axpa8TBmIxwGVdRot7Qy-8pKfBiMALIZgW_S5Q6vn_c5NvMGgfJ6_9BMyzcpA9I',
    rating: 4.9
  },
  {
    id: 'kerala',
    name: 'Kerala',
    price: '₹18,500',
    description: 'God\'s own country. Serene backwaters and lush greenery.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjaF2cwGTr7RA_3wZS7uPn4Dc86GA8c-I8SpY3zryptbeApMeYfL4bmCjA-oWZOP1YUXo_IvrrWSbjHS-KtKIyPVxG5DraFf6j1Mz7iXgJd0nML-maouZUPgM0_ChF17ftLVn6Zn8qgW4Uq_zHp8Tqcq32ej-5E7dAWyUEhoKHDJBGxfWrFjLBUUfABfySTr498k6eAi866sZr42PLEl7oKyGK4xXc5nL_bF_0_wLB9zghK_I1n5mBhbhy1GSNqH4r_TuYaDPXcjg',
    rating: 4.7
  }
];

export const INTERNATIONAL_DESTINATIONS: FeaturedDestination[] = [
  {
    id: 'bali',
    name: 'Bali, Indonesia',
    price: '₹45,000',
    description: 'A tropical sanctuary known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2600&auto=format&fit=crop',
    rating: 5.0,
    isTopChoice: true,
    pricePerPerson: true,
    region: 'Asia',
    bestTimeToVisit: 'April to October',
    suggestedActivities: ['Uluwatu Temple Visit', 'Scuba Diving in Tulamben', 'Tegalalang Rice Terrace Trekking', 'Yoga in Ubud']
  },
  {
    id: 'dubai',
    name: 'Dubai, UAE',
    price: '₹55,000',
    description: 'A city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture, and a lively nightlife scene.',
    image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=2600&auto=format&fit=crop',
    rating: 4.8,
    region: 'Middle East',
    bestTimeToVisit: 'November to March',
    suggestedActivities: ['Burj Khalifa Observation Deck', 'Desert Safari with Dinner', 'Dubai Mall Shopping', 'Palm Jumeirah Helicopter Tour']
  },
  {
    id: 'paris',
    name: 'Paris, France',
    price: '₹89,000',
    description: 'The global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop',
    rating: 4.9,
    region: 'Europe',
    bestTimeToVisit: 'June to August or September to October',
    suggestedActivities: ['Louvre Museum Tour', 'Eiffel Tower Picnic', 'Seine River Cruise', 'Montmartre Artists Walk']
  },
  {
    id: 'santorini',
    name: 'Santorini, Greece',
    price: '₹1,20,000',
    description: 'One of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2600&auto=format&fit=crop',
    rating: 4.9,
    region: 'Europe',
    bestTimeToVisit: 'September to October',
    suggestedActivities: ['Oia Sunset Viewing', 'Volcano & Hot Springs Boat Tour', 'Wine Tasting', 'Fira to Oia Hike']
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    price: '₹1,05,000',
    description: 'Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2600&auto=format&fit=crop',
    rating: 4.8,
    region: 'Asia',
    bestTimeToVisit: 'March to April (Cherry Blossom)',
    suggestedActivities: ['Shibuya Crossing Visit', 'Tsukiji Outer Market Breakfast', 'TeamLab Borderless', 'Senso-ji Temple']
  },
  {
    id: 'newyork',
    name: 'New York, USA',
    price: '₹1,45,000',
    description: 'A city of five boroughs where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that is among the world’s major centers.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2600&auto=format&fit=crop',
    rating: 4.7,
    region: 'Americas',
    bestTimeToVisit: 'April to June or September to November',
    suggestedActivities: ['Central Park Biking', 'Broadway Show', 'Empire State Building', 'High Line Walk']
  }
];

export const BOOKING_TABS = [
  { type: BookingType.FLIGHTS, icon: 'flight' },
  { type: BookingType.HOTELS, icon: 'hotel' },
  { type: BookingType.ACTIVITIES, icon: 'local_activity' }
];