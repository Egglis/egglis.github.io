// This works! lets make a API!
var mainPath = "database"

// Sets up the data selectors ---
setupRaces = function(year, selector){
    $.ajax({
        type: "GET",
        url: "database/" + year + "/info.txt",
        dataType: "text",
        success: function (data) {
            var trackList = data.replace(/(\n)/g,"").split(", ");
            for(let i = 0; i < trackList.length; i++){
                let track = trackList[i] + " Grand Prix";
                let option = document.createElement("option");
                option.text = track;
                option.value = track;
                selector.appendChild(option);
            }
        }
    })
}

setupDrivers = function(year, track, selector, drivers){
    console.log("Setting Up Drivers!")
    $.ajax({
        type: "GET",
        url: "database/" + year + "/" + track + "/Race/"+"R"+year+track.replace(/ /g, "")+"Result.csv",
        dataType: "text",
        async:false,
        success: function (data) {
            var driverList = data.replace(/(\n)/g,"").split("\r");
            for(let i = 1; i < driverList.length-1; i++){
                let driverInfo = driverList[i].split(",");
                let driverFirstName = driverInfo[8];
                let driverLastName = driverInfo[9];
                let driverNr = driverInfo[5];
                console.log(driverNr)
                drivers.push(driverNr);
                let option = document.createElement("option");
                option.text = driverNr + " - "+ driverFirstName + " " + driverLastName;
                option.value = driverNr;
                console.log(option.value)

                selector.appendChild(option);
            }
        },
        error: function (err){
            console.log(err);
        }
        
    })
}
