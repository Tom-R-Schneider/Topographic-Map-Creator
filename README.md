# Topographic Map Creator

## Features

- Create topographic map by providing top-left and bottom-right coordinates 
- Uses xyz API to get elevation data (free and no need to register for an API key)
- More Configurations: 
-- Image size in pixels
-- Number of layers (maximum 6)

## How to use

1. Open google.com/maps
2. Search for location you'd like to create a topographic map of (Note: the currently used API is free to use and only supports 10000 data points. This means that the selected area has to be quite small)
3. Right-click the location you would like to use for your top-left anchor and click on the coordinates that pop up (this will automatically copy them to your clipboard) and paste them into the NW coordinate input field
4. Repeat for your bottom-right coordinate (SE coordinate)
5. Set the number of layers your map should have (min. 1, max. 6)
6. Input the desired image size (the longer side of your rectangle will be used to set the desired size)
7. Click on "Create Topographic Map"
