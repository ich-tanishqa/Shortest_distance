const express = require('express');
const app = express ();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const productWeights = {
    "A": 3,
    "B": 2,
    "C": 8,
    "D": 12,
    "E": 25,
    "F": 15,
    "G": 0.5,
    "H": 1,
    "I": 2
};

const productLocations = {
    "A": "C1",
    "B": "C1",
    "C": "C1",
    "D": "C2",
    "E": "C2",
    "F": "C2",
    "G": "C3",
    "H": "C3",
    "I": "C3"
};

const costPerKg = {
    first5: 10,
    next5: 8,
    beyond10: 8
};

const distances = {
    C1: 3,
    C2: 2.5,
    C3: 2
};


function calculateCost(weight, distance) {
    let cost = 0;

    // First 5 kg
    if (weight > 0) {
        let first5Kg = Math.min(weight, 5);
        cost +=  costPerKg.first5 * distance;
        weight -= first5Kg;
    }

    // Next 5 kg
    if (weight > 0) {
        let next5Kg = Math.min(weight, 5);
        cost += costPerKg.next5 * distance;
        weight -= next5Kg;
    }

    // Remaining weight
    while(weight>0)
    {
        let rem = Math.min(weight, 5);
        cost += costPerKg.beyond10 * distance;
        weight -= rem; 
    }

    return cost;
}

function calculateMinimumCost(order) {
    let totalCost = 0;
    let stationsVisited = [];

    let c1Weight = (order["A"] || 0) * 3 + (order["B"] || 0) * 2 + (order["C"] || 0) * 8;
    if (c1Weight > 0) {
        totalCost += calculateCost(c1Weight, distances.C1);
        stationsVisited.push("C1");
    }

    let c2Weight = (order["D"] || 0) * 12 + (order["E"] || 0) * 25 + (order["F"] || 0) * 15 ;
    if (c2Weight > 0) {
        totalCost += calculateCost(c2Weight, distances.C2);
        stationsVisited.push("C2");
    }

    let c3Weight = (order["H"] || 0) * 1 + (order["I"] || 0) * 2 + (order["G"] || 0) * 0.5 ;
    if (c3Weight > 0) {
        totalCost += calculateCost(c3Weight, distances.C3);
        stationsVisited.push("C3");
    }
    for (let i = 0; i < stationsVisited.length - 1; i++) {
        const currentStation = stationsVisited[i];
        const nextStation = stationsVisited[i + 1];

        const emptyMoveCost = distances[nextStation] * costPerKg.first5;
        totalCost += emptyMoveCost;
    }

    return totalCost;
}

// const order = { "A": 1,"B": 1 ,"C":1,"D":1};
// const minimumCost = calculateMinimumCost(order);
// console.log(`Minimum cost for the given order: ${minimumCost}`);


app.post("/calculate", (req, res) => {
    try {
        const order = req.body;
        const cost  = calculateMinimumCost(order);
        res.json({
            minimumCost: cost,
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});

