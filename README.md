# FAssets Liquidator

A professional liquidator bot for the FAssets system with real-time dashboard.

## 🚀 Quick Start

1. Click the "Fork" button to create your own copy
2. The development server will start automatically
3. Edit files in the `src` directory to make changes
4. View your changes in real-time in the preview window

## 📋 Features

- 🤖 Automated liquidation monitoring
- 📊 Real-time dashboard
- 💰 Profit tracking
- ⚡ WebSocket updates
- 🔒 Secure key management

## 🛠️ Tech Stack

- React + Vite
- TailwindCSS
- Socket.io
- Express
- Ethers.js

## 📦 Project Structure

```
src/
├── client/           # Frontend React app
│   ├── components/   # React components
│   ├── context/      # React context
│   └── App.jsx       # Main app component
├── contracts/        # Smart contract interfaces
├── utils/           # Utility functions
└── server.js        # Express server
```

## 💻 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔑 Configuration

1. Create `.env` file:
```env
NETWORK=coston
REGISTRY_ADDRESS=your_registry_address
FASSETS_ADDRESS=your_fassets_address
```

2. Generate secrets:
```bash
npm run setup
```

## 📝 License

MIT