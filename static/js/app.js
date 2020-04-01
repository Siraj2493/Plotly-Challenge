// Use the D3 library to read in samples.json.
// function unpack (rows, index) {
//   return rows.map(function (row) {
//     return row[index]
//   })
// }
function optionChanged (subject) {
  updateChart(subject)
}

function loadMenu () {
  d3.json('samples.json').then((data) => {
    var names = data.names

    // console.log(names)

    //   d3.select('select').on("change", updatePlotly);

    d3.select('select')
      .selectAll('option')
      .data(names)
      .enter()
      .append('option')
      .attr('value', function (d) { return d })
      .text(function (d) { return d })
  })
}

function updateBar (sample) {
  var trace1 = {
    type: 'bar',
    x: sample.sample_values.slice(0, 10).reverse(),
    y: sample.otu_ids.slice(0, 10).reverse().map(d => 'OTU ' + d),
    text: sample.otu_labels.slice(0, 10).reverse(),
    orientation: 'h'
  }

  Plotly.newPlot('bar', [trace1])
}

function updateBubble (sample) {
  var trace1 = {
    x: sample.otu_ids,
    y: sample.sample_values,
    mode: 'markers',
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids
    },
    text: sample.otu_labels
  }

  Plotly.newPlot('bubble', [trace1])
}

function updateGuage (freq) {
  var trace1 = {
    domain: { x: [0, 1], y: [0, 1] },
    // value: parseFloat(freq),
    value: freq,
    title: { text: 'Belly Button Washing Frequency' },
    type: 'indicator',
    mode: 'gauge+number',
    gauge: { axis: { range: [null, 9] }}
  }

  Plotly.newPlot('gauge', [trace1])
}

function updateDemo (metaData) {
  // source:  https://stackoverflow.com/questions/32762889/creating-a-table-in-d3-with-json-object
  arrMeta = Object.keys(metaData).map(function (k) { return { key: k, value: metaData[k] } })
  console.log(arrMeta)

  // remove the table if it already exists
  d3.selectAll('table').remove()

  var table = d3.select('#sample-metadata').append('table')

  var tableBody = table.append('tbody')

  var rows = tableBody.selectAll('tr')
    .data(arrMeta)
    .enter()
    .append('tr')

  rows.append('td').html(function(m) {return m.key; })
  rows.append('td').html(function(m) {return m.value; })

}

function updateChart (subject) {
  d3.json('samples.json').then((data) => {
    // console.log(data)

    var metaData = data.metadata.filter(s => s.id.toString() === subject)[0]
    // console.log(metaData)

    // get the correct sample
    var sample = data.samples.filter(d => d.id === subject)[0]
    // console.log(sample)

    updateDemo(metaData)
    updateBar(sample)
    updateBubble(sample)
    updateGuage(metaData.wfreq)
  })
}

loadMenu()
updateChart('940')