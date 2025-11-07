
export interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  imageUrl: string;
  tonIntegration: "payments" | "wallet" | "nft" | "multiple";
  url: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: "games",
    name: "Games",
    description: "Play games with TON integration",
    icon: "gamepad-2"
  },
  {
    id: "finance",
    name: "Finance",
    description: "Financial applications with TON",
    icon: "wallet"
  },
  {
    id: "social",
    name: "Social",
    description: "Connect with others using TON",
    icon: "users"
  },
  {
    id: "utility",
    name: "Utilities",
    description: "Useful tools with TON integration",
    icon: "tool"
  },
  {
    id: "nft",
    name: "NFT",
    description: "Non-fungible token applications",
    icon: "image"
  }
];

export const apps: App[] = [
  {
    id: "1",
    name: "CryptoBot",
    description: "A multi-featured cryptocurrency wallet and exchange bot",
    category: "finance",
    rating: 4.9,
    downloads: 1200000,
    imageUrl: "https://cryptobot.me/img/share.jpg",
    tonIntegration: "wallet",
    url: "https://t.me/CryptoBot"
  },
  {
    id: "2",
    name: "Wallet",
    description: "Official TON blockchain wallet",
    category: "finance",
    rating: 4.8,
    downloads: 980000,
    imageUrl: "https://wallet.ton.org/assets/UI.png",
    tonIntegration: "wallet",
    url: "https://t.me/wallet"
  },
  {
    id: "3",
    name: "Fragment",
    description: "Telegram usernames marketplace",
    category: "utility",
    rating: 4.7,
    downloads: 720000,
    imageUrl: "https://fragment.com/images/sharing/fragment.jpg",
    tonIntegration: "payments",
    url: "https://t.me/fragment"
  },
  {
    id: "4",
    name: "TON Play",
    description: "Play games and earn cryptocurrency",
    category: "games",
    rating: 4.6,
    downloads: 650000,
    imageUrl: "https://tonplay.io/assets/images/og-image.png",
    tonIntegration: "multiple",
    url: "https://t.me/tonplay"
  },
  {
    id: "5",
    name: "TON Diamonds",
    description: "Collectible NFTs on TON blockchain",
    category: "nft",
    rating: 4.5,
    downloads: 450000,
    imageUrl: "https://github.com/ton-blockchain/tutorials/raw/main/03-surfing/images/cover.jpg",
    tonIntegration: "nft",
    url: "https://t.me/tondiamonds"
  },
  {
    id: "6",
    name: "Notcoin",
    description: "Play to earn mobile game on TON",
    category: "games",
    rating: 4.7,
    downloads: 2100000,
    imageUrl: "https://notcoin.io/assets/images/preview.jpg",
    tonIntegration: "multiple",
    url: "https://t.me/notcoin"
  },
  {
    id: "7",
    name: "TON Space",
    description: "Self-custodial wallet for TON",
    category: "finance",
    rating: 4.6,
    downloads: 620000,
    imageUrl: "https://tonspace.co/img/share-cover.png",
    tonIntegration: "wallet",
    url: "https://t.me/tonspacebot"
  },
  {
    id: "8",
    name: "Getgems",
    description: "NFT marketplace on TON",
    category: "nft",
    rating: 4.4,
    downloads: 380000,
    imageUrl: "https://getgems.io/assets/images/share.png",
    tonIntegration: "nft",
    url: "https://t.me/getgems"
  },
  {
    id: "9",
    name: "Dedust",
    description: "Decentralized exchange on TON",
    category: "finance",
    rating: 4.3,
    downloads: 290000,
    imageUrl: "https://dedust.io/img/dedust-share.png",
    tonIntegration: "multiple",
    url: "https://t.me/dedust"
  },
  {
    id: "10",
    name: "TON Connect",
    description: "Connect your TON wallet to apps",
    category: "utility",
    rating: 4.5,
    downloads: 520000,
    imageUrl: "https://tonconnect.org/assets/preview.png",
    tonIntegration: "wallet",
    url: "https://t.me/tonconnectbot"
  }
];

export const getAppsByCategory = (categoryId: string): App[] => {
  return apps.filter(app => app.category === categoryId).sort((a, b) => b.rating - a.rating);
};

export const getTopApps = (limit: number = 5): App[] => {
  return [...apps].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

export const getTopRatedApps = (limit: number = 5): App[] => {
  return [...apps].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

export const getAppById = (id: string): App | undefined => {
  return apps.find(app => app.id === id);
};

export const searchApps = (query: string): App[] => {
  const lowerCaseQuery = query.toLowerCase();
  return apps.filter(
    app => app.name.toLowerCase().includes(lowerCaseQuery) || 
           app.description.toLowerCase().includes(lowerCaseQuery)
  );
};
