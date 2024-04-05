// URL for the earthquake data
const earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Create a map centered around the United States
const map = L.map('map').setView([37.09, -95.71], 4);

// Add the base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to calculate the radius of the circle marker based on earthquake magnitude
function getRadius(magnitude) {
  return Math.sqrt(magnitude) * 15000; // Increase the factor to make the points larger
}

// Function to determine the color based on earthquake depth
function getColor(depth) {
  if (depth < 10) {
    return '#7FFF00'; // Light green
  } else if (depth < 30) {
    return '#FFD700'; // Gold
  } else if (depth < 50) {
    return '#FFA500'; // Orange
  } else if (depth < 70) {
    return '#FF4500'; // Orange-red
  } else if (depth < 90) {
    return '#DC143C'; // Crimson
  } else {
    return '#8B0000'; // Dark red
  }
}

// Function to create a popup for each earthquake marker
function createPopup(feature) {
  return `<h3>${feature.properties.place}</h3><hr>
          <p>Magnitude: ${feature.properties.mag}</p>
          <p>Depth: ${feature.geometry.coordinates[2]} km</p>
          <p>Time: ${new Date(feature.properties.time)}</p>`;
}

// Function to create the legend using D3
function createLegend() {
  const legend = L.control({ position: 'bottomright' });

  // Add legend content using D3
  legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    
    // Add title to legend
    const title = document.createElement('h2');
    title.innerText = 'Earthquake depth in KM';
    title.style.textAlign = 'center'; // Center align the title
    div.appendChild(title);

    const depths = [0, 10, 30, 50, 70, 90];
    const labels = [];

    // Use D3 to append SVG elements for legend
    const svg = d3.create('svg');
    const legendGroup = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(10, 10)'); // Adjust alignment

    // Loop through depth intervals and generate a label with a colored square for each interval
    depths.forEach((depth, index) => {
      const color = getColor(depth);
      const text = index === depths.length - 1 ? `${depth}+ km` : `${depth} - ${depths[index + 1]} km`;

      legendGroup.append('rect')
        .attr('x', 50)
        .attr('y', index * 20)
        .attr('width', 60)
        .attr('height', 25)
        .style('fill', color);

      legendGroup.append('text')
        .attr('x', 150)
        .attr('y', index * 20 + 12)
        .attr('dy', '0.35em')
        .text(text);
    });

    // Append SVG to the legend div
    div.innerHTML += svg.node().outerHTML;

    // Add a white squared background around the legend
    div.style.backgroundColor = 'white';
    div.style.padding = '1px';
    div.style.border = '1px solid #999';
    div.style.borderRadius = '85px';

    return div;
  };

  // Add legend to the map
  legend.addTo(map);
}

// Call the function to create legend
createLegend();

// Fetch earthquake data from the provided URL using D3
d3.json(earthquakeDataUrl)
  .then(data => {
    // Loop through each earthquake feature and add a marker to the map
    data.features.forEach(feature => {
      const lat = feature.geometry.coordinates[1];
      const lng = feature.geometry.coordinates[0];
      const magnitude = feature.properties.mag;
      const depth = feature.geometry.coordinates[2];

      try {
        // Check if magnitude is valid
        if (isNaN(magnitude)) {
          throw new Error(`Invalid magnitude: ${magnitude} for feature: ${feature}`);
        }
      
        // Create a circle marker for each earthquake
        const circle = L.circle([lat, lng], {
          radius: getRadius(magnitude),
          color: 'black',
          weight: 0.5,
          opacity: 0.5,
          fillColor: getColor(depth),
          fillOpacity: 0.7
        }).bindPopup(createPopup(feature)).addTo(map);
      } catch (error) {
        console.error('Error plotting point:', error.message);
      }
    });
  })
  .catch(error => console.error('Error fetching earthquake data:', error));