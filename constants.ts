import { BookingType, Destination, FeaturedDestination, HeroSlide, Mood, Review } from './types';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000&auto=format&fit=crop',
    title: 'Majestic Taj Mahal',
    subtitle: 'Witness the eternal symbol of love at sunrise, a true architectural marvel.',
    tag: 'Eternal Heritage',
    stats: { temp: '28°C', popularity: 'High', activity: 'Photography' }
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2000&auto=format&fit=crop',
    title: 'Swiss Alps Majesty',
    subtitle: 'Glide through crystal-clear skies above snow-capped peaks in the heart of Europe.',
    tag: 'Luxury Escapes',
    stats: { temp: '-4°C', popularity: 'Peak', activity: 'Skiing' }
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop',
    title: 'Ladakh High Passes',
    subtitle: 'Navigate the highest motorable roads and find peace in ancient monasteries.',
    tag: 'Adventure Wild',
    stats: { temp: '12°C', popularity: 'Medium', activity: 'Biking' }
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop',
    title: 'Parisian Nights',
    subtitle: 'Walk the illuminated boulevards and experience the romance of the City of Light.',
    tag: 'Cultural Bliss',
    stats: { temp: '16°C', popularity: 'High', activity: 'Dining' }
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop',
    title: 'Bali Sanctuary',
    subtitle: 'Find your zen among emerald rice terraces and tropical island shores.',
    tag: 'Tropical Zen',
    stats: { temp: '30°C', popularity: 'Trending', activity: 'Meditation' }
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1528126383463-72213799307c?q=80&w=2000&auto=format&fit=crop',
    title: 'Golden Kyoto',
    subtitle: 'Step back in time through bamboo forests and historic Zen gardens.',
    tag: 'Eastern Spirit',
    stats: { temp: '14°C', popularity: 'Steady', activity: 'Tea Ritual' }
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
    title: 'Santorini Sunsets',
    subtitle: 'Overlook the deep blue Aegean from the iconic white-washed cliffs of Oia.',
    tag: 'Romantic Aegean',
    stats: { temp: '24°C', popularity: 'Peak', activity: 'Sailing' }
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop',
    title: 'Future Dubai',
    subtitle: 'Experience ultra-modern luxury where desert dunes meet architectural miracles.',
    tag: 'Modern Luxury',
    stats: { temp: '34°C', popularity: 'High', activity: 'Shopping' }
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2000&auto=format&fit=crop',
    title: 'Canal Venice',
    subtitle: 'Navigate the world\'s most beautiful water corridors in a traditional gondola.',
    tag: 'Historic Water',
    stats: { temp: '18°C', popularity: 'High', activity: 'Gondola' }
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop',
    title: 'Maldives Crystal',
    subtitle: 'Dine underwater and sleep above the waves in pristine island lagoons.',
    tag: 'Ocean Paradise',
    stats: { temp: '29°C', popularity: 'Exclusive', activity: 'Diving' }
  }
];

export const MOODS: Mood[] = [
  { id: 'relaxed', name: 'Relaxed', icon: 'spa', colorClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
  { id: 'adventure', name: 'Adventure', icon: 'hiking', colorClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { id: 'romantic', name: 'Romantic', icon: 'favorite', colorClass: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
  { id: 'spiritual', name: 'Spiritual', icon: 'temple_buddhist', colorClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { id: 'foodie', name: 'Foodie', icon: 'restaurant', colorClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  { id: 'beach', name: 'Beach', icon: 'beach_access', colorClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' }
];

export const TRENDING_DESTINATIONS: Destination[] = [
  { id: 'goa', name: 'Palolem Beach, Goa', state: 'Goa', price: '₹12,999', description: 'Experience the pristine white sands and vibrant nightlife of South Goa.', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop', rating: 4.8, reviewCount: 1240 },
  { id: 'jaipur', name: 'Hawa Mahal, Jaipur', state: 'Rajasthan', price: '₹8,499', description: 'Discover the iconic pink sandstone palace and royal heritage of Jaipur.', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop', rating: 4.6, reviewCount: 950 },
  { id: 'manali', name: 'Solang Valley, Manali', state: 'Himachal Pradesh', price: '₹15,200', description: 'Snow-capped peaks and adrenaline-pumping adventure sports in the Himalayas.', image: 'https://images.unsplash.com/photo-1594495894542-a47cc43df12c?q=80&w=1200&auto=format&fit=crop', rating: 4.9, reviewCount: 2100 },
  { id: 'kerala', name: 'Alleppey Backwaters', state: 'Kerala', price: '₹18,500', description: 'Float through serene emerald backwaters on a traditional luxury houseboat.', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1200&auto=format&fit=crop', rating: 4.7, reviewCount: 1580 },
  { id: 'leh', name: 'Thiksey Monastery, Leh', state: 'Ladakh', price: '₹22,000', description: 'Venture into the high-altitude desert and explore ancient spiritual sanctuaries.', image: 'https://images.unsplash.com/photo-1523365114107-198124076e0f?q=80&w=1200&auto=format&fit=crop', rating: 4.9, reviewCount: 880 },
  { id: 'shillong', name: 'Elephant Falls, Shillong', state: 'Meghalaya', price: '₹14,500', description: 'Witness the breathtaking waterfalls and rolling green hills of the East.', image: 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=1200&auto=format&fit=crop', rating: 4.5, reviewCount: 620 },
  { id: 'rishikesh', name: 'Laxman Jhula, Rishikesh', state: 'Uttarakhand', price: '₹7,500', description: 'Find peace at the yoga capital where the holy Ganges meets the mountains.', image: 'https://images.unsplash.com/photo-1614082242765-7c98cdc0d2df?q=80&w=1200&auto=format&fit=crop', rating: 4.6, reviewCount: 1100 },
  { id: 'udaipur', name: 'Lake Pichola, Udaipur', state: 'Rajasthan', price: '₹19,000', description: 'The Venice of the East, featuring majestic palaces reflecting in clear waters.', image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1200&auto=format&fit=crop', rating: 4.8, reviewCount: 1450 },
  { id: 'varanasi', name: 'Ganga Ghats, Varanasi', state: 'Uttar Pradesh', price: '₹6,999', description: 'Witness the ancient spiritual rituals at the worlds oldest living city.', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop', rating: 4.5, reviewCount: 3200 },
  { id: 'hampi', name: 'Virupaksha, Hampi', state: 'Karnataka', price: '₹11,000', description: 'Step into history among the boulder-strewn ruins of the Vijayanagara Empire.', image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?q=80&w=1200&auto=format&fit=crop', rating: 4.7, reviewCount: 740 },
  { id: 'pondicherry', name: 'French Colony, Pondy', state: 'Puducherry', price: '₹13,500', description: 'Stroll through bright yellow boulevards filled with Franco-Tamil heritage.', image: 'https://images.unsplash.com/photo-1589793463357-5fb813435467?q=80&w=1200&auto=format&fit=crop', rating: 4.6, reviewCount: 1280 },
  { id: 'darjeeling', name: 'Batasia Loop, Darjeeling', state: 'West Bengal', price: '₹16,000', description: 'Morning views of Kanchenjunga over world-famous emerald tea estates.', image: 'https://images.unsplash.com/photo-1597022216592-36316279f16c?q=80&w=1200&auto=format&fit=crop', rating: 4.7, reviewCount: 890 },
  { id: 'mysore', name: 'Mysore Palace', state: 'Karnataka', price: '₹9,500', description: 'Marvel at the breathtaking Indo-Saracenic architecture of the Royal Palace.', image: 'https://images.unsplash.com/photo-1582234032431-75466c4c5b3d?q=80&w=1200&auto=format&fit=crop', rating: 4.6, reviewCount: 1050 },
  { id: 'jaisalmer', name: 'Sam Sand Dunes, Jaisalmer', state: 'Rajasthan', price: '₹12,400', description: 'Overnight camel safaris and folk dances under the golden desert stars.', image: 'https://images.unsplash.com/photo-1621256428751-2e650d4b9982?q=80&w=1200&auto=format&fit=crop', rating: 4.8, reviewCount: 720 },
  { id: 'ooty', name: 'Nilgiri Hills, Ooty', state: 'Tamil Nadu', price: '₹10,500', description: 'Lush green peaks and colonial charm in the Queen of Hill Stations.', image: 'https://images.unsplash.com/photo-1590483256038-038234360e42?q=80&w=1200&auto=format&fit=crop', rating: 4.5, reviewCount: 2200 },
  { id: 'munnar', name: 'Tea Gardens, Munnar', state: 'Kerala', price: '₹14,000', description: 'Endless rolling hills covered in carpets of green tea plantations.', image: 'https://images.unsplash.com/photo-1540202404-a2f290328291?q=80&w=1200&auto=format&fit=crop', rating: 4.9, reviewCount: 1680 },
  { id: 'andaman', name: 'Havelock, Andaman', state: 'Andaman & Nicobar', price: '₹35,000', description: 'Crystal clear turquoise waters and world-class scuba diving spots.', image: 'https://images.unsplash.com/photo-1589136142558-74e72a45d6e1?q=80&w=1200&auto=format&fit=crop', rating: 4.9, reviewCount: 1300 },
  { id: 'amritsar', name: 'Golden Temple, Amritsar', state: 'Punjab', price: '₹7,200', description: 'The spiritual heart of the Sikh faith, shimmering in pure gold.', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=1200&auto=format&fit=crop', rating: 4.8, reviewCount: 3800 },
  { id: 'gulmarg', name: 'Gulmarg Gondola', state: 'Jammu & Kashmir', price: '₹28,000', description: 'Take the worlds highest cable car ride over snowy Himalayan meadows.', image: 'https://images.unsplash.com/photo-1605649406091-9a184c6447a1?q=80&w=1200&auto=format&fit=crop', rating: 4.9, reviewCount: 940 },
  { id: 'khajuraho', name: 'Kandariya Temple', state: 'Madhya Pradesh', price: '₹9,800', description: 'Exquisite stone carvings representing the peak of medieval architecture.', image: 'https://images.unsplash.com/photo-1590050752117-23a923f051a6?q=80&w=1200&auto=format&fit=crop', rating: 4.7, reviewCount: 510 }
];

export const INTERNATIONAL_DESTINATIONS: FeaturedDestination[] = [
  { id: 'bali', name: 'Bali, Indonesia', price: '₹45,000', description: 'Exotic island known for volcanic mountains and rice paddies.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2600&auto=format&fit=crop', rating: 5.0, reviewCount: 4500, isTopChoice: true, region: 'Asia', bestTimeToVisit: 'April to October', suggestedActivities: ['Rice Terrace Trekking', 'Temple Tours', 'Surfing'] },
  { id: 'dubai', name: 'Dubai, UAE', price: '₹55,000', description: 'Ultra-modern city known for luxury shopping and desert safaris.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2600&auto=format&fit=crop', rating: 4.8, reviewCount: 3200, region: 'Middle East', bestTimeToVisit: 'November to March', suggestedActivities: ['Burj Khalifa', 'Desert Safari', 'Gold Souk'] },
  { id: 'paris', name: 'Paris, France', price: '₹89,000', description: 'The global center for art, fashion, and gastronomy.', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop', rating: 4.9, reviewCount: 5100, region: 'Europe', bestTimeToVisit: 'June to August', suggestedActivities: ['Louvre Museum', 'Eiffel Tower', 'Seine Cruise'] },
  { id: 'tokyo', name: 'Tokyo, Japan', price: '₹1,05,000', description: 'Neon-lit skyscrapers and historic temples meet.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2600&auto=format&fit=crop', rating: 4.9, reviewCount: 2800, region: 'Asia', bestTimeToVisit: 'March to May', suggestedActivities: ['Shibuya Crossing', 'Senso-ji Temple', 'Harajuku'] },
  { id: 'london', name: 'London, UK', price: '₹82,000', description: 'A 21st-century city with history stretching back to Roman times.', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2600&auto=format&fit=crop', rating: 4.7, reviewCount: 3900, region: 'Europe', bestTimeToVisit: 'May to September', suggestedActivities: ['London Eye', 'British Museum', 'Thames Walk'] },
  { id: 'santorini', name: 'Santorini, Greece', price: '₹1,20,000', description: 'Iconic white buildings overlooking the blue Aegean.', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2600&auto=format&fit=crop', rating: 4.9, reviewCount: 1950, region: 'Europe', bestTimeToVisit: 'September to October', suggestedActivities: ['Sunset in Oia', 'Volcano Hike', 'Wine Tasting'] },
  { id: 'singapore', name: 'Singapore', price: '₹38,000', description: 'Garden city with futuristic skyline and diverse food.', image: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?q=80&w=2600&auto=format&fit=crop', rating: 4.8, reviewCount: 4200, region: 'Asia', bestTimeToVisit: 'February to April', suggestedActivities: ['Gardens by the Bay', 'Sentosa Island', 'Marina Bay'] },
  { id: 'maldives', name: 'Maldives', price: '₹95,000', description: 'Ultimate luxury escape with private overwater villas.', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2600&auto=format&fit=crop', rating: 5.0, reviewCount: 1500, isTopChoice: true, region: 'Asia', bestTimeToVisit: 'November to April', suggestedActivities: ['Snorkeling', 'Island Hopping', 'Spa Retreat'] },
  { id: 'rome', name: 'Rome, Italy', price: '₹78,000', description: 'Capital city with iconic ruins and artistic heritage.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2600&auto=format&fit=crop', rating: 4.8, reviewCount: 3600, region: 'Europe', bestTimeToVisit: 'April to June', suggestedActivities: ['Colosseum', 'Vatican Museums', 'Trevi Fountain'] },
  { id: 'newyork', name: 'New York, USA', price: '₹1,45,000', description: 'The Big Apple with world-class museums and parks.', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2600&auto=format&fit=crop', rating: 4.7, reviewCount: 6500, region: 'Americas', bestTimeToVisit: 'April to June', suggestedActivities: ['Central Park', 'Broadway', 'Statue of Liberty'] },
  { id: 'bangkok', name: 'Bangkok, Thailand', price: '₹25,000', description: 'Street food paradise and ornate golden shrines.', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579367?q=80&w=2600&auto=format&fit=crop', rating: 4.6, reviewCount: 4800, region: 'Asia', bestTimeToVisit: 'November to February', suggestedActivities: ['Grand Palace', 'Wat Arun', 'Floating Market'] },
  { id: 'barcelona', name: 'Barcelona, Spain', price: '₹85,000', description: 'Gaudi architecture and Mediterranean beach life.', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2600&auto=format&fit=crop', rating: 4.8, reviewCount: 2900, region: 'Europe', bestTimeToVisit: 'May to June', suggestedActivities: ['Sagrada Familia', 'Park Guell', 'La Rambla'] },
  { id: 'sydney', name: 'Sydney, Australia', price: '₹1,30,000', description: 'Opera House views and legendary surf beaches.', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2600&auto=format&fit=crop', rating: 4.9, reviewCount: 2400, region: 'Oceania', bestTimeToVisit: 'September to November', suggestedActivities: ['Opera House', 'Bondi Beach', 'Harbour Bridge'] },
  { id: 'amsterdam', name: 'Amsterdam, Netherlands', price: '₹88,000', description: 'Charming canals and world-class art museums.', image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=2600&auto=format&fit=crop', rating: 4.7, reviewCount: 3100, region: 'Europe', bestTimeToVisit: 'April to May', suggestedActivities: ['Van Gogh Museum', 'Canal Cruise', 'Anne Frank House'] },
  { id: 'kyoto', name: 'Kyoto, Japan', price: '₹1,15,000', description: 'Ancient temples and traditional Zen gardens.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2600&auto=format&fit=crop', rating: 4.9, reviewCount: 2100, region: 'Asia', bestTimeToVisit: 'October to November', suggestedActivities: ['Fushimi Inari', 'Arashiyama Bamboo Grove', 'Golden Pavilion'] },
  { id: 'cairo', name: 'Cairo, Egypt', price: '₹62,000', description: 'Home to the iconic Giza Pyramids and Sphinx.', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2600&auto=format&fit=crop', rating: 4.6, reviewCount: 1800, region: 'Africa', bestTimeToVisit: 'October to April', suggestedActivities: ['Giza Pyramids', 'Egyptian Museum', 'Khan el-Khalili'] },
  { id: 'capetown', name: 'Cape Town, S. Africa', price: '₹98,000', description: 'Breathtaking coastal views and Table Mountain.', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2600&auto=format&fit=crop', rating: 4.8, reviewCount: 1400, region: 'Africa', bestTimeToVisit: 'October to April', suggestedActivities: ['Table Mountain Hike', 'Robben Island', 'Cape Point'] },
  { id: 'rio', name: 'Rio de Janeiro, Brazil', price: '₹1,55,000', description: 'Vibrant city famous for Carnival and beaches.', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2600&auto=format&fit=crop', rating: 4.7, reviewCount: 2600, region: 'Americas', bestTimeToVisit: 'December to March', suggestedActivities: ['Christ the Redeemer', 'Sugarloaf Mountain', 'Copacabana'] },
  { id: 'istanbul', name: 'Istanbul, Turkey', price: '₹68,000', description: 'The unique bridge between Europe and Asia.', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2600&auto=format&fit=crop', rating: 4.8, reviewCount: 3400, region: 'Europe', bestTimeToVisit: 'April to May', suggestedActivities: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar'] },
  { id: 'venice', name: 'Venice, Italy', price: '₹92,000', description: 'The magical floating city of gondolas and canals.', image: 'https://images.unsplash.com/photo-1514890547357-a9ee2887ad8e?q=80&w=2600&auto=format&fit=crop', rating: 4.7, reviewCount: 2900, region: 'Europe', bestTimeToVisit: 'April to June', suggestedActivities: ['Gondola Ride', 'St. Mark\'s Square', 'Rialto Bridge'] }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    user: 'Ananya Sharma',
    avatar: 'https://i.pravatar.cc/150?u=ananya',
    rating: 5,
    comment: 'The AI itinerary was spot on! Bali was exactly how I imagined it. The seamless booking made everything stress-free.',
    trip: 'Bali, Indonesia',
    date: 'Oct 2024',
    isVerified: true,
    helpfulCount: 24,
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&auto=format&fit=crop',
    travelType: 'Couple',
    response: {
      responderName: 'Sarah from Concierge',
      responderTitle: 'Travel Expert',
      responderAvatar: 'https://i.pravatar.cc/150?u=sarah_expert',
      message: 'So glad you enjoyed the Uluwatu sunset itinerary, Ananya! Hope to see you back soon.'
    }
  },
  {
    id: '2',
    user: 'Rohan Mehta',
    avatar: 'https://i.pravatar.cc/150?u=rohan',
    rating: 4,
    comment: 'Great experience in Ladakh. The hotels suggested were top-notch. Only wish the flight prices were a bit more stable.',
    trip: 'Leh Ladakh, India',
    date: 'Sep 2024',
    isVerified: true,
    helpfulCount: 12,
    thumbnail: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=400&auto=format&fit=crop',
    travelType: 'Adventure'
  },
  {
    id: '3',
    user: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    rating: 5,
    comment: 'As a solo traveler, safety is key. BookMyTrip curated a spiritual journey in Rishikesh that felt incredibly safe and authentic.',
    trip: 'Rishikesh, India',
    date: 'Nov 2024',
    isVerified: true,
    helpfulCount: 45,
    thumbnail: 'https://images.unsplash.com/photo-1514050566906-8d077abb73b2?q=80&w=400&auto=format&fit=crop',
    travelType: 'Solo',
    response: {
      responderName: 'Agent Michael',
      responderTitle: 'Safety Lead',
      responderAvatar: 'https://i.pravatar.cc/150?u=michael',
      message: 'Safety is our #1 priority for solo explorers. Thank you for trusting our verified partner network!'
    }
  },
  {
    id: '4',
    user: 'Vikram Singh',
    avatar: 'https://i.pravatar.cc/150?u=vikram',
    rating: 5,
    comment: 'Synthesized my dream villa using the AI tool and actually booked a similar one in Dubai. The technology is futuristic!',
    trip: 'Dubai, UAE',
    date: 'Dec 2024',
    isVerified: true,
    helpfulCount: 31,
    thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=400&auto=format&fit=crop',
    travelType: 'Business'
  },
  {
    id: '5',
    user: 'Elena Gilbert',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    rating: 5,
    comment: 'Paris was a dream. The curated dining spots were hidden gems I would have never found on my own.',
    trip: 'Paris, France',
    date: 'Jan 2025',
    isVerified: true,
    helpfulCount: 18,
    thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop',
    travelType: 'Couple'
  },
  {
    id: '6',
    user: 'Marcus Chen',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    rating: 4,
    comment: 'The efficiency of the booking engine for multi-city travel is unmatched. Seamless transition from Tokyo to Kyoto.',
    trip: 'Tokyo, Japan',
    date: 'Feb 2025',
    isVerified: true,
    helpfulCount: 22,
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400&auto=format&fit=crop',
    travelType: 'Business'
  },
  {
    id: '7',
    user: 'Leo Castor',
    avatar: 'https://i.pravatar.cc/150?u=leo',
    rating: 5,
    comment: 'Unforgettable views in Santorini. The catamaran cruise suggestion was the highlight of our honeymoon.',
    trip: 'Santorini, Greece',
    date: 'Mar 2025',
    isVerified: true,
    helpfulCount: 15,
    thumbnail: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=400&auto=format&fit=crop',
    travelType: 'Couple'
  },
  {
    id: '8',
    user: 'Priya Patel',
    avatar: 'https://i.pravatar.cc/150?u=priya',
    rating: 5,
    comment: 'The Kerala houseboats are a must-try. Everything from the food to the scenery was top tier.',
    trip: 'Alleppey Backwaters, India',
    date: 'Apr 2025',
    isVerified: true,
    helpfulCount: 28,
    thumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=400&auto=format&fit=crop',
    travelType: 'Family'
  },
  {
    id: '9',
    user: 'David Miller',
    avatar: 'https://i.pravatar.cc/150?u=david',
    rating: 4,
    comment: 'Skiing in the Swiss Alps was amazing. The AI assistant helped find a resort that fits our budget perfectly.',
    trip: 'Swiss Alps, Switzerland',
    date: 'Jan 2025',
    isVerified: true,
    helpfulCount: 19,
    thumbnail: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=400&auto=format&fit=crop',
    travelType: 'Adventure'
  },
  {
    id: '10',
    user: 'Mei Ling',
    avatar: 'https://i.pravatar.cc/150?u=mei',
    rating: 5,
    comment: 'Kyoto in cherry blossom season is magical. The temple tours were so well organized and insightful.',
    trip: 'Kyoto, Japan',
    date: 'Mar 2025',
    isVerified: true,
    helpfulCount: 34,
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop',
    travelType: 'Solo'
  }
];

export const BOOKING_TABS = [
  { type: BookingType.FLIGHTS, icon: 'flight' },
  { type: BookingType.HOTELS, icon: 'hotel' },
  { type: BookingType.ACTIVITIES, icon: 'local_activity' }
];