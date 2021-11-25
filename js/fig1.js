
const gradient = [
    "#00ff3c",
    "#6cee00",
    "#94dc00",
    "#b1c800",
    "#c8b400",
    "#db9d00",
    "#ea8400",
    "#f56800",
    "#fc4600",
    "#ff0000"]


function fig1(files, paths){
    try {
        // Debugging
        console.log("Displaying graph...")
        console.log("Nr of drivers: " + files.length);

        var canvas = d3.create("svg").attr("width", width).attr("height", height)
        let currentLap = 1;
        let drivers = []
        let racelines = []
        let selectedDriver = 0;

        let track = new Track(paths[0].track);
        track.drawTrackLayout(canvas);

        document.addEventListener("keydown", keyPress, false)



        for(let i = 0; i < files.length; i++){
            let driver = new Driver(paths[i].driver, files[i], paths[i], i)
            let raceline = new Raceline("Brake",currentLap, driver);
            drivers.push(driver);
            racelines.push(raceline)
        }

        
        // Construct the racing line path for currently slected driver
        racelines[0].drawLap(canvas);
        drivers[selectedDriver].StrokeColor = "Red"

        // Finally draw the driver dots
        for(let i = 0; i < drivers.length; i++){
            drivers[i].drawDot(canvas, 0, currentLap);
        }
        let timeline = new Timeline(drivers);
        timeline.drawTimeline(canvas);
        timeline.constructTimeLineGraph(canvas);



        timeline.setupScales(drivers[selectedDriver].Tel, drivers[selectedDriver].Laps, canvas)

        let legend = new Legend(drivers[0]);
        legend.constructLegend(canvas);

        
        
        function updateGraph(index, lap, newX){

            timeline.drawTimeline(canvas, newX, drivers[selectedDriver].Tel[index].Time)
            legend.updateLegend(canvas, index, currentLap)
            if(racelines[selectedDriver].CurrentLap != currentLap){
                racelines[selectedDriver].CurrentLap = currentLap;
            }

            for(let i = 0; i < drivers.length; i++){
                drivers[i].drawDot(canvas, index, lap)
            }
            racelines[selectedDriver].drawLap(canvas);
        }

        for(let i = 0; i < legend.Attributes.length; i++){
            let at = legend.Attributes[i];
            canvas.select(at.ContainerClass)
                .on("mousedown", function (event){
                    racelines[selectedDriver].updateAtt(canvas, at.Name);
                })
            
            canvas.select(at.BarClass)
                .on("mousedown", function (event){
                    racelines[selectedDriver].updateAtt(canvas, at.Name);
                })
        }

        // Interaction functions
        canvas.select(timeline.ClickClass)
            .on("mousedown", function(event){
                timeline.Clicked = true;
                if(timeline.Clicked){
                    let index = Math.floor(timeline.TimeScale(event.clientX));
                    currentLap = drivers[selectedDriver].getCurrentLap();
                    //let index = currentIndex;
                    updateGraph(index, currentLap, event.clientX);
                }
            })
            .on("mousemove", function (event){
                if(timeline.Clicked){
                    let index = Math.floor(timeline.TimeScale(event.clientX));
                    currentLap = drivers[selectedDriver].getCurrentLap();
                    //let index = currentIndex;
                    updateGraph(index, currentLap, event.clientX);
                }
            })
            .on("mouseup", () => timeline.Clicked = false)
            .on("mouseout", () => timeline.Clicked = false)


        function keyPress(e){
            let currentX = canvas.select(timeline.IndClass).attr("x1");
            let nextX = parseInt(currentX);
            let currentIndex = drivers[selectedDriver].Index;
            if(e.code=="ArrowRight" && currentX < timeline.Metrics.width+timeline.Metrics.x){
                currentIndex++;
            } else if (e.code=="ArrowLeft" && currentX > timeline.Metrics.x){
                currentIndex--;
            } else if(e.code=="ArrowUp" && currentLap < drivers[0].TelLaps.length) {
                 currentLap++;
            } else if (e.code=="ArrowDown" && currentLap > 1) {
                currentLap--;
            } else {
                return;
            }
            currentLap = drivers[selectedDriver].getCurrentLap();
            
            let index = currentIndex;
            updateGraph(index, currentLap, currentX);
        }

        
        return Promise.resolve(canvas.node());
    } catch (err) {
        return Promise.reject("Error in figure1:" + err);
    }
}
