const click_event = document.getElementById("button_id");
    click_event.onclick = function() {

        var nw_coordinate = parseFloat(document.getElementById("NW_coordinate").value);
        var se_coordinate = parseFloat(document.getElementById("SE_coordinate").value);
        console.log(nw_coordinate);
        console.log(se_coordinate);

    };