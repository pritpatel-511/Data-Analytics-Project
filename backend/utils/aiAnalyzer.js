// function analyzeData(data) {
//     const sample = data[0];
//     const keys = Object.keys(sample);
//     const stats = {};
//     const numericFields = [];
//     const categoricalFields = [];
  
//     keys.forEach(key => {
//       const values = data.map(row => row[key]);
//       const isNumeric = values.every(v => typeof v === 'number' || !isNaN(parseFloat(v)));
//       if (isNumeric) numericFields.push(key);
//       else categoricalFields.push(key);
function analyzeData(data) {
  const sample = data[0];
  const keys = Object.keys(sample);
  const stats = {};
  const numericFields = [];
  const categoricalFields = [];

  keys.forEach((key) => {
    const values = data.map((row) => row[key]);
    const isNumeric = values.every((v) => typeof v === "number" || !isNaN(parseFloat(v)));
    if (isNumeric) numericFields.push(key);
    else categoricalFields.push(key);
  });

  const summary = {
    rowCount: data.length,
    columnCount: keys.length,
    dataTypes: {
      numeric: numericFields,
      categorical: categoricalFields,
    },
  };

  numericFields.forEach((key) => {
    const nums = data.map((row) => parseFloat(row[key])).filter((n) => !isNaN(n));
    stats[key] = {
      average: (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2),
      max: Math.max(...nums),
      min: Math.min(...nums),
    };
  });

  return {
    recommendation: {
      chart: "Bar Chart",
      description:
        categoricalFields.length > 0 && numericFields.length > 0
          ? `${categoricalFields[0]} vs ${numericFields[0]}`
          : "Insufficient data for chart recommendation.",
    },
    summary,
    stats,
    correlation:
      numericFields.length >= 2 ? `${numericFields[0]} ~ ${numericFields[1]}` : null,
  };
}

module.exports = { analyzeData };
