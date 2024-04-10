# leaflet-challenge

An interactive map that presents earthquake activity can be found here: https://cc-roy.github.io/leaflet-challenge/

the 'logic.js' file that can be found within the 'js' directory, which is nested in the 'static' directory, contains the logic that reads in the data, creates the tile layer, generates the point for each earthquake ny looping through the indices stored in the data, creates the popup with info related to the quake, and generates the legend. The 'logic.js' file also contains error handling logic that ensures indices with invalid magnitude values do not prevent succeeding indicies from being plotted.

The 'index.html' file, located within the root of the repo, contains the HTML structure that handles the general structure of the page.
