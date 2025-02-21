const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");
const path = require("path");

const width = 600; // Chart width
const height = 400; // Chart height

const chartCallback = (ChartJS) => {
    ChartJS.defaults.font.size = 16;
};

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

// Generate Chart Image
async function generateChart(labels, values, type, title) {
    const configuration = {
        type,
        data: {
            labels,
            datasets: [
                {
                    label: title,
                    data: values,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800"],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: true }
            }
        }
    };

    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    const filePath = path.join(__dirname, "../charts", `${title.replace(/\s/g, "_")}.png`);
    fs.writeFileSync(filePath, imageBuffer);
    
    return filePath;
}

module.exports = { generateChart };
