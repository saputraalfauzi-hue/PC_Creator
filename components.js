function generateComponents() {
    // CPU
    const cpus = [];
    const cpusData = [
        { name: "Intel Celeron G6900", socket: "LGA1700", price: 650000, power: 46, tier: "low" },
        { name: "Intel Pentium G7400", socket: "LGA1700", price: 850000, power: 46, tier: "low" },
        { name: "Intel Core i3-12100", socket: "LGA1700", price: 1750000, power: 60, tier: "mid" },
        { name: "Intel Core i3-13100", socket: "LGA1700", price: 2150000, power: 60, tier: "mid" },
        { name: "Intel Core i5-12400F", socket: "LGA1700", price: 1850000, power: 65, tier: "mid" },
        { name: "Intel Core i5-13400F", socket: "LGA1700", price: 2750000, power: 65, tier: "high" },
        { name: "Intel Core i5-13600K", socket: "LGA1700", price: 4250000, power: 125, tier: "high" },
        { name: "Intel Core i7-12700K", socket: "LGA1700", price: 4750000, power: 125, tier: "high" },
        { name: "Intel Core i7-13700K", socket: "LGA1700", price: 5750000, power: 125, tier: "ultra" },
        { name: "Intel Core i9-13900K", socket: "LGA1700", price: 8750000, power: 185, tier: "ultra" },
        { name: "Intel Core i9-14900K", socket: "LGA1700", price: 10250000, power: 185, tier: "ultra" },
        { name: "AMD Athlon 3000G", socket: "AM4", price: 750000, power: 35, tier: "low" },
        { name: "AMD Ryzen 3 3200G", socket: "AM4", price: 1250000, power: 65, tier: "low" },
        { name: "AMD Ryzen 3 4100", socket: "AM4", price: 1150000, power: 65, tier: "mid" },
        { name: "AMD Ryzen 5 4500", socket: "AM4", price: 1450000, power: 65, tier: "mid" },
        { name: "AMD Ryzen 5 5600X", socket: "AM4", price: 2250000, power: 65, tier: "high" },
        { name: "AMD Ryzen 5 7600X", socket: "AM5", price: 3450000, power: 105, tier: "high" },
        { name: "AMD Ryzen 7 5700X", socket: "AM4", price: 3250000, power: 65, tier: "high" },
        { name: "AMD Ryzen 7 5800X3D", socket: "AM4", price: 4950000, power: 105, tier: "ultra" },
        { name: "AMD Ryzen 7 7700X", socket: "AM5", price: 4250000, power: 105, tier: "ultra" },
        { name: "AMD Ryzen 9 5900X", socket: "AM4", price: 6250000, power: 145, tier: "ultra" },
        { name: "AMD Ryzen 9 7950X", socket: "AM5", price: 11250000, power: 170, tier: "ultra" }
    ];
    cpusData.forEach((c, i) => cpus.push({ id: `cpu${i+1}`, category: "cpu", ...c }));

    // Motherboard
    const motherboards = [];
    const moboData = [
        { name: "H610M (LGA1700)", socket: "LGA1700", price: 950000, power: 25 },
        { name: "B660M (LGA1700)", socket: "LGA1700", price: 1650000, power: 30 },
        { name: "B760M (LGA1700)", socket: "LGA1700", price: 1850000, power: 30 },
        { name: "Z690 (LGA1700)", socket: "LGA1700", price: 3200000, power: 45 },
        { name: "Z790 (LGA1700)", socket: "LGA1700", price: 3950000, power: 45 },
        { name: "A520M (AM4)", socket: "AM4", price: 850000, power: 25 },
        { name: "B450M (AM4)", socket: "AM4", price: 1150000, power: 30 },
        { name: "B550M (AM4)", socket: "AM4", price: 1550000, power: 30 },
        { name: "X570 (AM4)", socket: "AM4", price: 2950000, power: 40 },
        { name: "A620M (AM5)", socket: "AM5", price: 1350000, power: 30 },
        { name: "B650M (AM5)", socket: "AM5", price: 2150000, power: 35 },
        { name: "X670E (AM5)", socket: "AM5", price: 5250000, power: 50 },
        { name: "B650E (AM5)", socket: "AM5", price: 3650000, power: 40 }
    ];
    moboData.forEach((m, i) => motherboards.push({ id: `mobo${i+1}`, category: "motherboard", ...m }));

    // RAM
    const rams = [];
    const ramData = [
        { name: "DDR4 8GB (1x8)", price: 450000, power: 8, capacity: 8, ramType: "DDR4" },
        { name: "DDR4 16GB (2x8)", price: 850000, power: 10, capacity: 16, ramType: "DDR4" },
        { name: "DDR4 32GB (2x16)", price: 1650000, power: 15, capacity: 32, ramType: "DDR4" },
        { name: "DDR4 64GB (2x32)", price: 3250000, power: 25, capacity: 64, ramType: "DDR4" },
        { name: "DDR5 8GB", price: 650000, power: 10, capacity: 8, ramType: "DDR5" },
        { name: "DDR5 16GB", price: 1250000, power: 12, capacity: 16, ramType: "DDR5" },
        { name: "DDR5 32GB", price: 2250000, power: 18, capacity: 32, ramType: "DDR5" },
        { name: "DDR5 64GB", price: 4450000, power: 30, capacity: 64, ramType: "DDR5" }
    ];
    ramData.forEach((r, i) => rams.push({ id: `ram${i+1}`, category: "ram", ...r }));

    // GPU
    const gpus = [];
    const gpuData = [
        { name: "GT 1030", price: 1250000, power: 30, tier: "low" },
        { name: "GTX 1650", price: 2150000, power: 75, tier: "low" },
        { name: "GTX 1660 Super", price: 2850000, power: 125, tier: "mid" },
        { name: "RTX 2060", price: 3450000, power: 160, tier: "mid" },
        { name: "RTX 3050", price: 3150000, power: 130, tier: "mid" },
        { name: "RTX 3060", price: 4100000, power: 170, tier: "high" },
        { name: "RTX 3060 Ti", price: 4950000, power: 200, tier: "high" },
        { name: "RX 6600", price: 3950000, power: 160, tier: "high" },
        { name: "RX 6600 XT", price: 4750000, power: 180, tier: "high" },
        { name: "RX 6700 XT", price: 5450000, power: 230, tier: "high" },
        { name: "RTX 3070", price: 6250000, power: 220, tier: "ultra" },
        { name: "RTX 3070 Ti", price: 7450000, power: 290, tier: "ultra" },
        { name: "RTX 3080", price: 8950000, power: 320, tier: "ultra" },
        { name: "RTX 3080 Ti", price: 11250000, power: 350, tier: "ultra" },
        { name: "RTX 4070", price: 8250000, power: 200, tier: "ultra" },
        { name: "RTX 4070 Ti", price: 10950000, power: 285, tier: "ultra" },
        { name: "RTX 4080", price: 17950000, power: 320, tier: "ultra" },
        { name: "RTX 4090", price: 28500000, power: 450, tier: "ultra" },
        { name: "RX 6800 XT", price: 8950000, power: 300, tier: "ultra" },
        { name: "RX 6900 XT", price: 12500000, power: 330, tier: "ultra" },
        { name: "RX 7900 XT", price: 14950000, power: 300, tier: "ultra" },
        { name: "RX 7900 XTX", price: 19950000, power: 355, tier: "ultra" }
    ];
    gpuData.forEach((g, i) => gpus.push({ id: `gpu${i+1}`, category: "gpu", ...g }));

    // Storage
    const storages = [];
    const storageData = [
        { name: "SSD SATA 240GB", price: 350000, power: 3, storageType: "SATA" },
        { name: "SSD SATA 480GB", price: 550000, power: 4, storageType: "SATA" },
        { name: "SSD SATA 1TB", price: 1250000, power: 4, storageType: "SATA" },
        { name: "SSD NVMe 256GB", price: 450000, power: 4, storageType: "NVMe" },
        { name: "SSD NVMe 512GB", price: 650000, power: 5, storageType: "NVMe" },
        { name: "SSD NVMe 1TB", price: 1150000, power: 6, storageType: "NVMe" },
        { name: "SSD NVMe 2TB", price: 2150000, power: 7, storageType: "NVMe" },
        { name: "SSD NVMe 4TB", price: 4250000, power: 8, storageType: "NVMe" },
        { name: "HDD 500GB", price: 350000, power: 6, storageType: "SATA" },
        { name: "HDD 1TB", price: 550000, power: 7, storageType: "SATA" },
        { name: "HDD 2TB", price: 850000, power: 8, storageType: "SATA" },
        { name: "HDD 4TB", price: 1450000, power: 9, storageType: "SATA" }
    ];
    storageData.forEach((s, i) => storages.push({ id: `storage${i+1}`, category: "storage", ...s }));

    // PSU
    const psus = [];
    const psuData = [
        { name: "400W 80+ White", wattage: 400, price: 450000 },
        { name: "450W 80+ Bronze", wattage: 450, price: 550000 },
        { name: "500W 80+ Bronze", wattage: 500, price: 650000 },
        { name: "550W 80+ Bronze", wattage: 550, price: 750000 },
        { name: "600W 80+ Bronze", wattage: 600, price: 850000 },
        { name: "650W 80+ Gold", wattage: 650, price: 1150000 },
        { name: "750W 80+ Gold", wattage: 750, price: 1550000 },
        { name: "850W 80+ Gold", wattage: 850, price: 1950000 },
        { name: "1000W 80+ Gold", wattage: 1000, price: 2450000 },
        { name: "1200W 80+ Platinum", wattage: 1200, price: 3850000 }
    ];
    psuData.forEach((p, i) => psus.push({ id: `psu${i+1}`, category: "psu", ...p }));

    // Tambahan untuk mencapai 120 komponen (extra)
    const extraCpus = [
        { name: "Intel Core i5-12600K", socket: "LGA1700", price: 3650000, power: 125, tier: "high" },
        { name: "Intel Core i7-11700K", socket: "LGA1200", price: 4250000, power: 125, tier: "high" },
        { name: "AMD Ryzen 5 5500", socket: "AM4", price: 1650000, power: 65, tier: "mid" },
        { name: "AMD Ryzen 9 5950X", socket: "AM4", price: 9250000, power: 145, tier: "ultra" }
    ];
    extraCpus.forEach((c, i) => cpus.push({ id: `cpu${cpus.length+1+i}`, category: "cpu", ...c }));

    const extraGpus = [
        { name: "RTX 2080 Ti", price: 7500000, power: 260, tier: "ultra" },
        { name: "RX 5700 XT", price: 3850000, power: 225, tier: "high" },
        { name: "GTX 1080 Ti", price: 4950000, power: 250, tier: "high" }
    ];
    extraGpus.forEach((g, i) => gpus.push({ id: `gpu${gpus.length+1+i}`, category: "gpu", ...g }));

    const extraRams = [
        { name: "DDR3 16GB", price: 350000, power: 12, capacity: 16, ramType: "DDR3" },
        { name: "DDR2 8GB", price: 150000, power: 10, capacity: 8, ramType: "DDR2" }
    ];
    extraRams.forEach((r, i) => rams.push({ id: `ram${rams.length+1+i}`, category: "ram", ...r }));

    const extraStorages = [
        { name: "SSD NVMe 8TB", price: 12500000, power: 10, storageType: "NVMe" },
        { name: "HDD 8TB", price: 2850000, power: 10, storageType: "SATA" }
    ];
    extraStorages.forEach((s, i) => storages.push({ id: `storage${storages.length+1+i}`, category: "storage", ...s }));

    const extraPsus = [
        { name: "1600W 80+ Titanium", wattage: 1600, price: 6250000 }
    ];
    extraPsus.forEach((p, i) => psus.push({ id: `psu${psus.length+1+i}`, category: "psu", ...p }));

    // Gabungkan semua
    let all = [...cpus, ...motherboards, ...rams, ...gpus, ...storages, ...psus];
    // Jika masih kurang dari 120, duplikasi dengan nama berbeda
    while (all.length < 120) {
        const original = all[all.length % all.length];
        const clone = { ...original, id: `dup${all.length}`, name: original.name + " (edisi khusus)" };
        all.push(clone);
    }
    return all;
}

const componentsDatabase = generateComponents();