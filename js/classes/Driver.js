class Driver {
    // Dot
    // Telemenry Data
    // Colo
    //...
    Laps = [];
    Tel;
    TelLaps = [];
    Dot;

    constructor(number, tel, path, pos){
        this.Pos = pos
        this.Num = number;
        this.Path = path;
        this.Tel = tel;
        this.loadLaps();
        this.splitTelOnLaps()
        this.DotClass = ".dot"+this.Num;
        this.calculateMinMax();
        this.Color = TeamColorsMap.get(this.Laps[0].Team)
        this.StrokeColor = "Black"
        this.Index = 0;
        this.DriverName = this.Laps[0].Driver;

        if (driverNr.get(this.Laps[0].Team) == 0){
            this.StrokeColor = "Black"
            driverNr.set(this.Laps[0].Team, 1)
        } else {
            this.StrokeColor = "Yellow"
        }

        this.Xscale = d3
            .scaleLinear()
            .domain(d3.extent(this.Tel, function (d) {return parseInt(d.X);}))
            .range([margin, width - margin - marginLeft]);


        this.Yscale = d3
            .scaleLinear()
            .domain(d3.extent(this.Tel, function (d) {return parseInt(d.Y);}))
            .range([height - margin - marginBottom, margin]);
    }

    drawDot(canvas, index, currentLap){
        // Do Update Stuff!
        this.Index = index;
        if(currentLap >= this.TelLaps.length){
            canvas.select(this.DotClass)
                .attr("cx", this.Xscale(2+(this.pos*100)))
                .attr("cy", this.Yscale(2))
            return
        }
        
        this.Dot = this.Tel.map(function (d) {
            return {
                X: d.X,
                Y: d.Y,
                Brake: d.Brake,
                Throttle: d.Throttle,
                RPM: d.RPM,
                Speed: d.Speed,
                Gear: d.nGear
            }
        });


        if(canvas.select(this.DotClass).size()==0){
            canvas.append("circle")
                .attr("class","dot"+this.Num)
                .attr("cx", 2)
                .attr("cy", 2)
                .attr("r", 5)
                .attr("stroke", this.StrokeColor)
                .attr("stroke-width",2)
                .attr("fill",this.Color)
        }


        if(index == this.Tel.length-1) return;
        else if (index > this.Tel.length-1) return;

        canvas.select(this.DotClass)
            .attr("cx", this.Xscale(this.Tel[index].X))
            .attr("cy", this.Yscale(this.Tel[index].Y))
            .attr("stroke", this.StrokeColor)

        
    }

    // Data Loading
    loadLaps() {
        var response = $.ajax({
            type: "GET",  
            url: this.Path.getLapsFile(),
            dataType: "text",  
            async: false,
        });
        var text = "id"+response.responseText;
        var finalObj = [];
        var arr = text.split("\n");
        var headers = arr[0].split(",");
        for(var i = 0; i < arr.length; i++){
            var data = arr[i].split(",");
            var obj = {};
            var skip = true;
            for(var j = 0; j < data.length; j++){
                if(data[2]==this.Num){
                    skip = false;
                    obj[headers[j]] = data[j];
                }
            }
            if(!skip){finalObj.push(obj);}
        }
        this.Laps = finalObj;
    }

    splitLap(d, lap) {
        if(d.SessionTime=="") return null;
            if(lap <= 1){
                var currentLap = this.Laps[lap-1];
                if(d.SessionTime < currentLap.Time){
                    return d.X;
                } else {
                    return null;
                }
                } else {
                    var lastLap = this.Laps[lap-2];
                var currentLap = this.Laps[lap-1];
        
            if(lastLap.Time <= d.SessionTime && d.SessionTime  <= currentLap.Time){
                return d.X;
            } else {
                return null;
            }
        }
    }

    splitTelOnLaps() {
        for(let lap = 1; lap < this.Laps.length+1; lap++){
            this.TelLaps.push(this.Tel.filter(d => this.splitLap(d, lap) != null));
        }
    }

    calculateMinMax(){
        let rpms = d3.extent(this.Tel.map(d => parseInt(d.RPM)));
        let speeds = d3.extent(this.Tel.map(d => parseInt(d.Speed)));
        let minmax = {
            brake : [0,100],
            throttle : [0,100],
            rpm : rpms,
            speed : speeds,
            gear : [1,8]
        };
        this.MinMax = minmax;
    }
    
    getCurrentLap(){
        for(let i = 0; i < this.Laps.length-1; i++){
            let currentLap = this.Laps[i];
            let nextLap = this.Laps[i+1]
            let lapStart = new DateTime(currentLap.LapStartTime);
            let lapEnd = new DateTime(nextLap.LapStartTime);
            let currentTime = new DateTime(this.Tel[this.Index].SessionTime)

            if(lapStart.timeStr < currentTime.timeStr && currentTime.timeStr < lapEnd.timeStr){
                return (i+1);
            }
            
        }
    }




}