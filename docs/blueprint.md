# **App Name**: TONRiffic Taps

## Core Features:

- TON Wallet Authentication: Authenticate users using their TON wallet, generating a custom Firebase token upon successful signature verification.
- Tap Increment: Register user taps, incrementing their tap count and enqueueing shard increments for the leaderboard.
- Leaderboard Aggregation: Aggregate daily tap data from shards to create a materialized leaderboard of the Top 300 users.
- Leaderboard Display: Display the paginated leaderboard of top users, fetched from the materialized collection. Implement periodic refresh mechanism.
- Investment Catalog Browsing: Allow users to browse available investment opportunities, filtered by country, city, sector, and other criteria. The filtering of the data is done in Firebase.
- Investment Creation: Enable users to make investments, locking their funds and creating a portfolio position.
- Personalized Financial Advice: Leverage generative AI tool to analyze the user's profile, tapping behavior and available investment opportunities. Then use the output of this tool to suggest investments best suited to them. Consider various African regions.

## Style Guidelines:

- Primary color: Green (#4CAF50) to inspire trust and stability, mirroring the secure nature of blockchain transactions.
- Background color: Dark gray (#424242), ensuring a modern look and focusing user attention on content.
- Accent color: Vibrant orange (#FF9800) to draw attention to key interactive elements, like the tap button and investment opportunities.
- Body and headline font: 'Inter', a sans-serif font, is selected for its modern and neutral appearance, ensuring legibility and a clean interface. It's well-suited for both headlines and body text.
- Use a set of clean, minimalist icons to represent investment sectors, user actions, and leaderboard positions, enhancing the mobile-first experience.
- Employ a mobile-first, card-based layout to present information in a digestible format. Ensure consistent spacing and alignment throughout the app.
- Use subtle animations to provide feedback on user interactions, such as a gentle ripple effect on the tap button and smooth transitions between screens.