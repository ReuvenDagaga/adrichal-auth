export interface Project {
  id: string
  title: string
  category: string
  description: string
  image: string
  images: string[]
  year: string
  location: string
  area: string
}

export const projects: Project[] = [
  {
    id: 'modern-penthouse',
    title: 'Modern Penthouse',
    category: 'Residential',
    description: 'A luxurious penthouse with panoramic city views, featuring clean lines and premium materials.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    ],
    year: '2024',
    location: 'Tel Aviv',
    area: '280 sqm',
  },
  {
    id: 'minimalist-villa',
    title: 'Minimalist Villa',
    category: 'Residential',
    description: 'A serene villa where simplicity meets sophistication, with natural light as the main design element.',
    image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200',
    images: [
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200',
    ],
    year: '2024',
    location: 'Herzliya',
    area: '450 sqm',
  },
  {
    id: 'urban-loft',
    title: 'Urban Loft',
    category: 'Residential',
    description: 'Industrial charm meets modern comfort in this converted warehouse space.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200',
    ],
    year: '2023',
    location: 'Jaffa',
    area: '180 sqm',
  },
  {
    id: 'coastal-retreat',
    title: 'Coastal Retreat',
    category: 'Residential',
    description: 'A beachfront home designed to blur the line between indoor and outdoor living.',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
    ],
    year: '2023',
    location: 'Caesarea',
    area: '320 sqm',
  },
  {
    id: 'boutique-hotel',
    title: 'Boutique Hotel',
    category: 'Commercial',
    description: 'A unique hospitality experience with carefully curated interiors that tell a story.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200',
    ],
    year: '2023',
    location: 'Jerusalem',
    area: '1200 sqm',
  },
  {
    id: 'art-gallery-home',
    title: 'Art Gallery Home',
    category: 'Residential',
    description: 'A private residence designed as a living gallery for an extensive art collection.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200',
    ],
    year: '2024',
    location: 'Ramat Hasharon',
    area: '380 sqm',
  },
]
