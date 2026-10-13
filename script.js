
function solveKnapsack() {
    const weightsText = document.getElementById("weights").value.trim();
    const valuesText = document.getElementById("values").value.trim();
    const capacityText = document.getElementById("capacity").value.trim();

    const result = document.getElementById("result");
    const tableContainer = document.getElementById("table-container");

    result.innerHTML = "";
    tableContainer.innerHTML = "";

    if (weightsText === "" || valuesText === "" || capacityText === "") {
        showError("Please fill in all the fields.");
        return;
    }

    const weights = weightsText.split(",").map(x => x.trim()).map(Number);
    const values = valuesText.split(",").map(x => x.trim()).map(Number);
    const capacity = Number(capacityText);

    if (
        weights.some((w, i) =>
            w === "" || !Number.isSafeInteger(w) || w <= 0
        ) ||
        values.some((v, i) =>
            v === "" || !Number.isSafeInteger(v) || v < 0
        ) ||
        !Number.isSafeInteger(capacity) ||
        capacity < 0
    ) {
        showError("Enter positive integer weights, non-negative integer values, and a non-negative integer capacity.");
        return;
    }

    if (weights.length !== values.length) {
        showError("The number of weights and values must be equal.");
        return;
    }

    if (weights.length === 0 || weights.length > 100) {
        showError("Enter between 1 and 100 items.");
        return;
    }

    if (capacity > 1000) {
        showError("For this demonstration, capacity must not exceed 1000.");
        return;
    }

    const n = weights.length;

    // Create the DP table
    const dp = Array.from(
        { length: n + 1 },
        () => Array(capacity + 1).fill(0)
    );

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    values[i - 1] + dp[i - 1][w - weights[i - 1]]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Find the selected items
    let remainingCapacity = capacity;
    const selectedItems = [];

    for (let i = n; i > 0; i--) {
        if (dp[i][remainingCapacity] !== dp[i - 1][remainingCapacity]) {
            selectedItems.push(i);
            remainingCapacity -= weights[i - 1];
        }
    }

    selectedItems.reverse();

    let totalWeight = 0;

    selectedItems.forEach(item => {
        totalWeight += weights[item - 1];
    });

    // Display the result
    result.innerHTML = `
        <h2>Optimal Result</h2>
        <p><strong>Maximum Value:</strong> ${dp[n][capacity]}</p>
        <p><strong>Knapsack Capacity:</strong> ${capacity}</p>
        <p><strong>Total Selected Weight:</strong> ${totalWeight}</p>
        <p><strong>Selected Items:</strong> ${
            selectedItems.length > 0
                ? selectedItems.map(i => "Item " + i).join(", ")
                : "None"
        }</p>
    `;

    // Display item details
    let itemTable = `
        <h2>Selected Item Details</h2>
        <table>
            <tr>
                <th>Item</th>
                <th>Weight</th>
                <th>Value</th>
                <th>Status</th>
            </tr>
    `;

    for (let i = 0; i < n; i++) {
        const isSelected = selectedItems.includes(i + 1);

        itemTable += `
            <tr>
                <td>Item ${i + 1}</td>
                <td>${weights[i]}</td>
                <td>${values[i]}</td>
                <td class="${isSelected ? "selected" : ""}">
                    ${isSelected ? "Selected" : "Not Selected"}
                </td>
            </tr>
        `;
    }

    itemTable += "</table>";

    // Display the dynamic programming table
    itemTable += "<h2>Dynamic Programming Table</h2>";
    itemTable += "<table><tr><th>Items / Capacity</th>";

    for (let w = 0; w <= capacity; w++) {
        itemTable += `<th>${w}</th>`;
    }

    itemTable += "</tr>";

    for (let i = 0; i <= n; i++) {
        itemTable += `<tr><th>${i}</th>`;

        for (let w = 0; w <= capacity; w++) {
            itemTable += `<td>${dp[i][w]}</td>`;
        }

        itemTable += "</tr>";
    }

    itemTable += "</table>";

    tableContainer.innerHTML = itemTable;
}

function showError(message) {
    document.getElementById("result").innerHTML =
        `<p class="error">${message}</p>`;
}

function resetForm() {
    document.getElementById("weights").value = "2, 3, 4, 5";
    document.getElementById("values").value = "3, 4, 5, 6";
    document.getElementById("capacity").value = "5";

    document.getElementById("result").innerHTML = `
        <h2>Result</h2>
        <p>Enter the details and click Solve Knapsack.</p>
    `;

    document.getElementById("table-container").innerHTML = "";
}
