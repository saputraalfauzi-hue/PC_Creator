function generateClients() {
    const names = [
        "Andi", "Budi", "Caca", "Dedi", "Eka", "Fani", "Gilang", "Hani", "Indra", "Joko",
        "Kiki", "Lina", "Maman", "Nina", "Oki", "Putri", "Qori", "Rina", "Siti", "Tono",
        "Umar", "Vina", "Wawan", "Xena", "Yanto", "Zaki", "Agus", "Bella", "Citra", "Doni",
        "Erna", "Fajar", "Gita", "Hendra", "Ika", "Joni", "Kartika", "Luki", "Mega", "Nando"
    ];
    const avatars = ["🧑‍💼", "👩‍💻", "🧑‍🎨", "👨‍🏫", "👩‍🔧", "🧑‍🚀", "👨‍🍳", "👩‍🎓", "🧑‍⚕️", "👨‍💻"];
    const usages = ["gaming", "editing", "streaming", "office", "coding", "design", "3d", "machine learning"];
    const minRamOptions = [8, 16, 32, 64];
    const minGpuTiers = ["low", "mid", "high", "ultra"];
    const budgets = [5000000, 8000000, 12000000, 15000000, 18000000, 22000000, 25000000, 30000000, 40000000, 50000000];
    
    const clients = [];
    for (let i = 0; i < 60; i++) {
        let name = names[i % names.length];
        if (i >= names.length) name += (Math.floor(i / names.length) + 1);
        const avatar = avatars[i % avatars.length];
        let usage = usages[Math.floor(Math.random() * usages.length)];
        let minRam = minRamOptions[Math.floor(Math.random() * minRamOptions.length)];
        let minGpuTier = minGpuTiers[Math.floor(Math.random() * minGpuTiers.length)];
        
        if (usage === "gaming" && minGpuTier === "low") minGpuTier = "mid";
        if (usage === "streaming" && minGpuTier === "low") minGpuTier = "high";
        if (usage === "design" && minGpuTier === "low") minGpuTier = "mid";
        if (usage === "machine learning") minGpuTier = "ultra";
        
        let budget = budgets[Math.floor(Math.random() * budgets.length)];
        if (usage === "streaming") budget = Math.max(budget, 20000000);
        if (usage === "editing") budget = Math.max(budget, 15000000);
        if (usage === "machine learning") budget = Math.max(budget, 30000000);
        
        clients.push({
            id: i+1,
            name: name,
            avatar: avatar,
            budget: budget,
            usage: usage,
            minRam: minRam,
            minGpuTier: minGpuTier
        });
    }
    return clients;
}

const clientsDatabase = generateClients();

function getRandomClient() {
    const idx = Math.floor(Math.random() * clientsDatabase.length);
    return { ...clientsDatabase[idx] };
}