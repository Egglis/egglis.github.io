

// Indexing incase of several graphs 
var index = 0;
function genIndex() {
  index++;
  return "chart";
};

// Wrapping a graph in a div with a graph title
function wrap(str, e) {
    const container = document.createElement("div");
    container.id = genIndex();
    container.textContent = str;
    container.appendChild(document.createElement("br"));
    container.appendChild(e);
    return document.body.appendChild(container);
};

function getPath(year, track, session, driver){ 
    return new Path(year, track, session, driver);
};

function getCurrentSelection(trackSelect, driverSelect){
    var track = trackSelect.options[trackSelect.selectedIndex].value;
    var driver = driverSelect.options[driverSelect.selectedIndex].value;
    return getPath("2021",track, "Race", driver);
}

function reloadGraph(drivers, paths, nr_drivers, track){
    try {
        var chart = document.getElementById("chart");
        if(chart!=null) {
            chart.remove();
        }

        loadGraph(drivers, paths, nr_drivers, track);
    } catch(err){
        console.log(err);
    }
}


let trackSelect = document.getElementById("track");
let driverSelect = document.getElementById("driver");
let nrdriverSelect = document.getElementById("nr_driver");

let year = "2021";

await setupRaces(year, trackSelect);
await setupDrivers("2021", "Bahrain Grand Prix", driverSelect, []);

function loadGraph(drivers, paths, nr_drivers, track){
    reset();
    let files = [];
    for(let d = 0; d < drivers.length-(drivers.length-nr_drivers); d++){
        let currentPath = getPath(year, track, "Race", drivers[d]);
        let rep = $.ajax({
            type: "GET",
            url: currentPath.file,
            dataType: "text",
            async: false,
            error: function (d){
                console.log("File not found at" + currentPath.file)
            }
        })
        if(rep.status==404){
            console.log("Skipping file")
            continue
        }
    
        files.push(d3.csv(currentPath.file));
        paths.push(currentPath)
    }
    
    
    Promise.all(files).then(async function (file){
        fig1(file, paths).then(e => wrap("t",e))
    })
}


trackSelect.addEventListener("change",function(){
    var path = getCurrentSelection(trackSelect, driverSelect);
    let drivers = [];
    let paths = [];
    let nr_drivers = document.getElementById("nr_drivers").selectedIndex+1;
    setupDrivers(path.year, path.track, driverSelect, drivers);
    reloadGraph(drivers, paths, nr_drivers, path.track);
});


driverSelect.addEventListener("change", function(){
    var path = getCurrentSelection(trackSelect, sessionSelect, driverSelect);
    reloadGraph(path);
});


function reset(){
    driverNr.set("Red Bull", 0)
    driverNr.set("Mercedes", 0)
    driverNr.set("Ferrari", 0)
    driverNr.set("AlphaTauri",	0)
    driverNr.set("McLaren",	0)
    driverNr.set("Alpine F1 Team", 0)
    driverNr.set("Aston Martin", 0)
    driverNr.set("Alfa Romeo", 0)
    driverNr.set("Williams",	0)
    driverNr.set("Haas F1 Team",	0)
}
