const click_event = document.getElementById("button_id");
    click_event.onclick = function() {

        // Get Coordinates from user input to define rectangle for testing
        var nw_user_input = document.getElementById("NW_coordinate").value;
        nw_user_input = nw_user_input.split(",");
        var nw_coordinate = [parseFloat(nw_user_input[0]), parseFloat(nw_user_input[1])];


        var se_user_input = document.getElementById("SE_coordinate").value;
        se_user_input = se_user_input.split(",");
        var se_coordinate = [parseFloat(se_user_input[0]), parseFloat(se_user_input[1])];

        var layers = document.getElementById("layers").value;
        layers = parseInt(layers);

        console.log(nw_coordinate);
        console.log(se_coordinate);
        console.log(layers);

        // Get elevation points from Airmap Elevation API (https://developers.airmap.com/docs/elevation-api)
        const http = new XMLHttpRequest();
        var url = "https://api.airmap.com/elevation/v1/ele/carpet?points=" + nw_user_input + "," + se_user_input;

        http.open("GET", url);
        http.send();

        http.onload = () => create_image(JSON.parse(http.response).data, layers);

        function create_image(elevation_data, layers) {

            console.log(elevation_data);
            // Get min and max elevation and calculate thresholds for layers
            var min_elevation = elevation_data.stats.min;
            var max_elevation = elevation_data.stats.max;
            var elevation_diff = max_elevation - min_elevation;
            var layer_height = parseInt(elevation_diff / layers);

            // Get dimensions of elevation data for image
            const elevation_dimensions = [elevation_data.carpet.length, elevation_data.carpet[0].length];


            // Create the image
            var img = new Image();
            img.src = 'white square.png';
            var canvas = document.getElementById('topology_canvas');
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, elevation_dimensions[1], elevation_dimensions[0]);
            var image = ctx.getImageData(0, 0, elevation_dimensions[1], elevation_dimensions[0]);
            image.crossOrigin = "anonymous";
            console.log("test");
            console.log(image);
            var imageData = image.data;
            console.log(imageData.length);

            // Colours used for different layers (TODO: look for actually good colours to use)
            var layer_colors = {

                1: {
                    "r": 0,
                    "g": 51,
                    "b": 153
                },
                2: {
                    "r": 0,
                    "g": 204,
                    "b": 0
                },
                3: {
                    "r": 255,
                    "g": 0,
                    "b": 102
                },
                4: {
                    "r": 153,
                    "g": 102,
                    "b": 51
                },
                5: {
                    "r": 153,
                    "g": 0,
                    "b": 0
                },
                6: {
                    "r": 102,
                    "g": 153,
                    "b": 153
                },
                7: {
                    "r": 255,
                    "g": 204,
                    "b": 0
                }
            };


            // Replace pixels with the corresponding colour (keep original data set if person wants to change layers)
            // Clone original data grid
            var layer_grid = JSON.parse(JSON.stringify(elevation_data.carpet));
            var curr_imagedata_position = 0;
            for (let x_coordinate in elevation_data.carpet) {
                
                for (let y_coordinate in elevation_data.carpet[x_coordinate]) {
                    
                    let curr_elevation = elevation_data.carpet[x_coordinate][y_coordinate];
                    let curr_layer = Math.floor((curr_elevation - min_elevation) / layer_height) + 1;
                    layer_grid[x_coordinate][y_coordinate] = curr_layer;

                    // Set Imagedata channels to rgb of calculated layer
                    imageData[curr_imagedata_position] = layer_colors[curr_layer].r;
                    imageData[curr_imagedata_position + 1] = layer_colors[curr_layer].g;
                    imageData[curr_imagedata_position + 2] = layer_colors[curr_layer].b;
                    imageData[curr_imagedata_position + 3] = 255;
                    curr_imagedata_position += 4;
                }
            }

            image.data = imageData;
            ctx.putImageData(image, 0, 0);
        };

    };
    
