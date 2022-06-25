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
            var canvas = document.getElementById('topology_canvas');
            var ctx = canvas.getContext('2d');
           

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

            for (let x_coordinate in elevation_data.carpet) {
                for (let y_coordinate in elevation_data.carpet[x_coordinate]) {
                    
                    let curr_elevation = elevation_data.carpet[x_coordinate][y_coordinate];
                    let curr_layer = Math.floor((curr_elevation - min_elevation) / layer_height) + 1;
                    layer_grid[x_coordinate][y_coordinate] = curr_layer;
                
                }
            }

            layer_grid =  resize_pixels(layer_grid, 500);
            var new_grid_dimensions = [layer_grid.length, layer_grid[0].length];
            console.log(layer_grid);

            // Create image
            var img = new Image(new_grid_dimensions[1], new_grid_dimensions[0]);
            var temp_canvas = document.createElement('canvas');
            var context = temp_canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0 );
            var myData = context.getImageData(0, 0, img.width, img.height);
            var imageData = myData.data;


            // Map layer rgb to imageData
            var curr_imagedata_position = 0;
            for (let x_coordinate in layer_grid) {
                for (let y_coordinate in layer_grid[x_coordinate]) {
                
                    let curr_layer = layer_grid[x_coordinate][y_coordinate];
                    // Set Imagedata channels to rgb of calculated layer
                    imageData[curr_imagedata_position] = layer_colors[curr_layer].r;
                    imageData[curr_imagedata_position + 1] = layer_colors[curr_layer].g;
                    imageData[curr_imagedata_position + 2] = layer_colors[curr_layer].b;
                    imageData[curr_imagedata_position + 3] = 255;
                    curr_imagedata_position += 4;
                }
            }
            
            myData.data = imageData;

            const grid_dimensions = [layer_grid.length, layer_grid.length];
            canvas.width = grid_dimensions[0];
            canvas.height = grid_dimensions[1];

            createImageBitmap(myData).then(function(imgBitmap) {
                ctx.drawImage(imgBitmap, 0, 0);
                let myData = context.getImageData(0, 0, img.width, img.height);
            });
        };
        // Used to resize pixels to achieve a minimum image size without information loss
        function resize_pixels(pixel_grid, min_size) {

            const grid_dimensions = [pixel_grid.length, pixel_grid[0].length];
            var size = grid_dimensions[0];
            if (grid_dimensions[1] > size) {
                size = grid_dimensions[1];
            }

            var scale_factor = Math.floor(min_size/size);

            // Create new pixel grid by expanding old grid manually
            var new_pixel_grid = new Array(grid_dimensions[0] * scale_factor).fill(0).map(() => new Array(grid_dimensions[1] * scale_factor).fill(0));

            // For every pixel in original data grid
            for (let x_coordinate in pixel_grid) {
                for (let y_coordinate in pixel_grid[x_coordinate]) {

                    let curr_pixel_value = pixel_grid[x_coordinate][y_coordinate];

                    // Fill in all scaled pixels with current pixel value (pixel[x] --> pixel[x + scale_factor] and pixel[y] --> pixel[y + scale_factor])
                    for (let x = 0; x < scale_factor; x++) {
                        for (let y = 0; y < scale_factor; y++) {
                            new_pixel_grid[x_coordinate * scale_factor + x][y_coordinate * scale_factor + y] = curr_pixel_value;
                        
                        }
                    }

                }
            }
            var new_grid_dimensions = [new_pixel_grid.length, new_pixel_grid[0].length];
            console.log(new_pixel_grid);
            return new_pixel_grid;
        };

    };
    