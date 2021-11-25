// This works! lets make a API!
var mainPath = "database"


getDriver = function(year, race, session, identifier){
    year = year.toString();
    if (session == "R"){
        return d3.csv(mainPath+"/"+year+"/"+race+"/Race/Drivers/"+identifier+".csv");
    } else {
        return d3.csv(mainPath+"/"+year+"/"+race+"/Quali/Drivers/"+identifier+".csv");
    }
};

getResults = function(year, race, session){
    year = year.toString();
    if (session == "R"){
        return d3.csv(mainPath+"/"+year+"/"+race+"/Race/R"+year+race.replace(/\s+/g,"")+"Result.csv");
    } else {
        return d3.csv(mainPath+"/"+year+"/"+race+"/Race/Q"+year+race.replace(/\s+/g,"")+"Result.csv");
    }
};

getLaps = function(year, race, session){
    year = year.toString();
    if (session == "R"){
        return d3.csv(mainPath+"/"+year+"/"+race+"/Race/R"+year+race.replace(/\s+/g,"")+"Laps.csv");
    } else {
        return d3.csv(mainPath+"/"+year+"/"+race+"/Race/Q"+year+race.replace(/\s+/g,"")+"Laps.csv");
    }
};

getWeather = function(year, race, session){
    year = year.toString();
    if (session == "R"){
        return d3.csv(mainPath+"/"+year+"/"+race+"/Race/R"+year+race.replace(/\s+/g,"")+"Weather.csv");
    } else {
        return d3.csv(mainPath+"/"+year+"/"+race+"/Race/Q"+year+race.replace(/\s+/g,"")+"Weather.csv");
    }
};

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
                drivers.push(driverNr);
                let option = document.createElement("option");
                option.text = driverNr + " - "+ driverFirstName + " " + driverLastName;
                option.value = driverNr;
                selector.appendChild(option);
            }
        }
        
    })
}
