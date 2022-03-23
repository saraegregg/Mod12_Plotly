function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
   var selSample = data.samples;
   // 4. Create a variable that filters the samples for the object with the desired sample number.   
   var selSampleArray = selSample.filter(sampleObj => sampleObj.id == sample);
   
    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = selSampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleResult.otu_ids
    var otu_labels = sampleResult.otu_labels
    var sample_values = sampleResult.sample_values
    
    var top_otu_ids = otu_ids.slice(0.10).reverse();
    var top_otu_labels = otu_labels.slice(0,10).reverse();
    var top_sample_values = sample_values.slice(0,10).reverse();
    
    // 7. Create the yticks for the bar chart.
    var yticksBar = otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
        x: top_sample_values,
        y: yticksBar,
        type: 'bar',
        orientation: 'h',
        hovertext: top_otu_labels,
      }];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "<b>Top 10 Bacteria for this Individual</b>",
        height: 450,
        width: 445
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    //Deliverable 2--Create a bubble chart
    // 1. Create the trace for the bubble chart.
    var bubble = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
            }
        }];        
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: { title: "OTU ID"},
      height: 600,
      width: 1160,
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubble, bubbleLayout);


    //Deliverable 3
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gauge = data.metadata;
    var gaugeArray = gauge.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0]
    // 3. Create a variable that holds the washing frequency.
    var washFreq= parseFloat(gaugeResult.wfreq);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFreq,
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
                    bar: { color: "gray"},
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 2], color: "#cf7"},
                        { range: [2, 4], color: "#4d8"},
                        { range: [4, 6], color: "#5cc"},
                        { range: [6, 8], color: "#58b"},
                        { range: [8, 10], color: "#55b"}
                    ]
                }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      height: 450,
      width: 485, 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
 
 
  });
}
