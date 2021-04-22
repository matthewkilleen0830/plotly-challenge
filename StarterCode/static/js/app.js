// Verify that app.js is loaded by index.html
console.log("JavaScript app file is loaded.");

// START OF CODE GIVEN IN CLASS OFFICE HOURS

// Create function to pull in data, populate dropdown menu, and call other functions based on user selection
function initialDashboard() {

    // Dropdown menu
    var selector = d3.select("#selDataset");

    // Use the D3 library to read in samples.json
    d3.json("samples.json").then(data => {

        // Verify data has been read in
        console.log(data);

        // Declare variable to store sample IDs
        var sampleNames = data.names;

        // Populate dropdown menu with sample IDs
        sampleNames.forEach(sampleID => {
            selector.append("option")
            .text(sampleID)
            .property("value", sampleID);

        });

        // Declare variable to store data from object array
        var id = sampleNames[0];

        // Call each function onto dashboard
        drawBarGraph(id);
        drawBubbleChart(id);
        updateDemographicInfo(id)
        drawGaugeChart(id);

    });
}

// HORIZONTAL BAR CHART ---------------------------------------

// Create stub for function to draw horizontal bar chart
function drawBarGraph(sampleID) {

    // Verify drawBarGraph function has been called
    console.log(`Draw bar graph plot(${sampleID}).`);

    // Read data and arrange for bar graph plotting
    d3.json("samples.json").then(data => {
        var samples = data.samples;
        var resultArray = samples.filter(s => s.id == sampleID);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Define horizontal bar chart y labels
        yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();

        // Define horizontal bar chart and x and y values
        var barData = {
            x:  sample_values.slice(0, 10).reverse(),
            y:  yticks,
            type:  "bar",
            text:  otu_labels.slice(0, 10).reverse(),
            orientation:  "h"
        }

        // Declare variable to store object data
        var barArray = [barData];

        // Define horizontal bar chart layout and title
        var barLayout = {
            title:  "Top 10 Bacteria Cultures Found",
            margin:  {t:  30, l:  150}
        }

        // Plot horizontal bar chart
        Plotly.newPlot("bar", barArray, barLayout);

    });

}

// END OF CODE GIVEN IN CLASS OFFICE HOURS

// BUBBLE CHART -----------------------------------------------

// Create stub for function to draw bubble chart
function drawBubbleChart(sampleID) {

    // // Verify drawBubbleChart function has been called
    console.log(`Draw bubble chart plot(${sampleID}).`);

    // Read data and arrange for bubble chart plotting
    d3.json("samples.json").then(data => {
        var samples = data.samples;
        var resultArray = samples.filter(s => s.id == sampleID);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Define bubble chart x and y values
        var bubbData = {
            x:  otu_ids,
            y:  sample_values,
            text:  otu_labels,
            mode:  "markers",
            marker:  {
                size:  sample_values,
                color:  otu_ids,
            }
        };

        // Declare variable to store object data
        var bubbArray = [bubbData];

        // Define bubble chart layout and axis titles
        var bubbLayout = {
            xaxis:  {
                title:  {
                    text:  "OTU ID",
                },
            },
            yaxis:  {
                title:  {
                    text:  "Sample Values",
                },
            },
        };

        // Plot bubble chart
        Plotly.newPlot("bubble", bubbArray, bubbLayout);

    });

}

// GAUGE CHART ------------------------------------------------

// Create stub for function to draw gauge chart
function drawGaugeChart(wfreq) {

    // // Verify drawGaugeChart function has been called
    // console.log(`Draw gauge chart plot(${sampleID}).`);

    // Read data and arrange for gauge chart plotting
    // d3.json("samples.json").then(data => {
    //     var samples = data.samples;
    //     var resultArray = samples.filter(s => s.id == sampleID);
    //     var result = resultArray[0];
    //     var wfreq = result.wfreq;
    var intervals = parseFloat(wfreq) * 20;

    // Define gauge chart values
    var gaugeData = [
            {
                domain:  {x: [0, 1], y:  [0, 1]},
                value:  wfreq,
                title:  {text:  "Belly Button Washing Frequency"},
                type:  "indicator",
                mode:  "gauge",
                gauge:  {
                    axis:  {range:  [0, 9], tickwidth:  1, tickmode: "linear", tickcolor:  "darkblue"},
                    bar:  {color:  "darkblue"},
                    bgcolor:  "white",
                    borderwidth:  2,
                    bordercolor:  "gray",
                    steps: [
                        {range: [0, 1], color:  "#f8f3ec"},
                        {range:  [1, 2], color: "#f4f1e5"},
                        {range:  [2, 3], color: "#e9e6ca"},
                        {range:  [3, 4], color: "#e5e7b3"},
                        {range:  [4, 5], color: "#d5e49d"},
                        {range:  [5, 6], color: "#b7cc92"},
                        {range:  [6, 7], color: "#8cbf88"},
                        {range:  [7, 8], color: "#8abb8f"},
                        {range:  [8, 9], color: "#85b48a"}
                    ],
                threshold:  {
                    line:  {color:  "red", width: 5},
                    thickness:  0.5,
                    value:  wfreq
                    }
                }
            }
        ];

        // Declare variable to store object data
        //var gaugeArray = [gaugeData];

        // Define gauge chart layout
        var gaugeLayout = {
            width:  500,
            height:  400,
            margin:  {t:  25, r:  25, l:  25, b:  25},
        };

        // Plot gauge chart
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);

}

// DEMOGRAPHIC INFO PANEL -------------------------------------

// Create stub for function to update demographic info panel
function updateDemographicInfo(sampleID) {

    // Verify updateDemographicInfo function has been called
    console.log(`Update demographic info panel(${sampleID}).`);

    // // Read data and arrange for demographic info panel
    d3.json("samples.json").then(data => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(s => s.id == sampleID);
        var result = resultArray[0];

    // // Declare variable to reference HTML element
    var demographicPanel = d3.select("#sample-metadata");
    demographicPanel.html("");
    Object.entries(result).forEach(([key, value]) => {
        demographicPanel.append("h6").text(`${key.toUpperCase()}:  ${value}`);
    });
    drawGaugeChart(result.wfreq);
});
}

// Create event handler to call function on user selection
function optionChanged(newSampleID) {

    // Verify event handler
    console.log(`User selected ID (${newSampleID}).`);

    // Call functions to draw bar graph plot, bubble chart plot, and update demographic info panel
    drawBarGraph(newSampleID);
    drawBubbleChart(newSampleID);
    updateDemographicInfo(newSampleID);
    drawGaugeChart(newSampleID);

}

// Call initialDashboard function
initialDashboard();

// Verify initialDashboard function has been called
console.log("initialDashboard() has been called.");