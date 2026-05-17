const clientsDatabase = [
    { name: "Gamer Sejati", budget: 18000000, usage: "gaming", minRam: 16, minGpuTier: "high", avatar: "🎮" },
    { name: "Editor Video", budget: 25000000, usage: "editing", minRam: 32, minGpuTier: "high", avatar: "🎬" },
    { name: "Streamer", budget: 35000000, usage: "streaming", minRam: 32, minGpuTier: "ultra", avatar: "📺" },
    { name: "Kantor Biasa", budget: 8000000, usage: "office", minRam: 8, minGpuTier: "low", avatar: "💼" },
    { name: "Programmer", budget: 20000000, usage: "coding", minRam: 16, minGpuTier: "mid", avatar: "💻" },
    { name: "Desainer Grafis", budget: 28000000, usage: "design", minRam: 32, minGpuTier: "high", avatar: "🎨" },
    { name: "Anak SMA", budget: 12000000, usage: "gaming", minRam: 16, minGpuTier: "mid", avatar: "🧑‍🎓" }
];

function getRandomClient() {
    const idx = Math.floor(Math.random() * clientsDatabase.length);
    return { ...clientsDatabase[idx] };
}