export interface GiftCard {
  id: string
  name: string
  color: string
  textColor: string
  icon: string
  logo: string
}

export const giftCards: GiftCard[] = [
  {
    id: 'apple',
    name: 'Apple',
    textColor: '#000000',
    logo: '/apple.png',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    textColor: '#000000',
    logo: '/amazon.png',
  },
  {
    id: 'google-play',
    name: 'Google Play',
    textColor: '#000000',
    icon: '▶️',
    logo: '/playstore.png',
  },
  {
    id: 'steam',
    name: 'Steam',
    textColor: '#000000',
    icon: '🎮',
    logo: '/steam.png',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    textColor: '#000000',
    icon: '🎵',
    logo: '/sportify.png',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    textColor: '#000000',
    icon: '🎬',
    logo: '/netflix.png',
  },
  {
    id: 'xbox',
    name: 'Xbox',
    textColor: '#000000',
    icon: '🎯',
    logo: '/xbox.png',
  },
  {
    id: 'playstation',
    name: 'PlayStation',
    textColor: '#000000',
    icon: '🕹️',
    logo: '/playstation.png',
  },
  {
    id: 'nintendo',
    name: 'Nintendo',
    textColor: '#000000',
    icon: '🍄',
    logo: '/nintendo.png',
  },
  {
    id: 'uber',
    name: 'Uber',
    textColor: '#000000',
    icon: '🚗',
    logo: '/uber.png',
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    textColor: '#000000',
    icon: '☕',
    logo: '/starbucks.png',
  },
  {
    id: 'target',
    name: 'Target',
    textColor: '#000000',
    icon: '🎯',
    logo: '/target.png',
  },
]
