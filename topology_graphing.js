const click_event = document.getElementById("button_id");
    click_event.onclick = function() {

        // Get Coordinates from user input to define rectangle for testing
        var nw_user_input = document.getElementById("NW_coordinate").value;
        nw_user_input = nw_user_input.split(",");
        var nw_coordinate = [parseFloat(nw_user_input[0]), parseFloat(nw_user_input[1])];


        var se_user_input = document.getElementById("SE_coordinate").value;
        se_user_input = se_user_input.split(",");
        var se_coordinate = [parseFloat(se_user_input[0]), parseFloat(se_user_input[1])];

        console.log(nw_coordinate);
        console.log(se_coordinate);

        // Get elevation points from Airmap Elevation API (https://developers.airmap.com/docs/elevation-api)
        const http = new XMLHttpRequest();
        var url = "https://api.airmap.com/elevation/v1/ele/carpet?points=" + nw_user_input + "," + se_user_input;

        http.open("GET", url);
        http.send();

        http.onload = () => console.log(http.response);

    };