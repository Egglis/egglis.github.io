class Raceline {
    constructor (currentAtt, currentlap, driver){
        this.CurrentAtt = currentAtt;
        this.CurrentLap = currentlap;
        this.Driver = driver;
        this.Line = d3.line()
            .x(d => this.Driver.Xscale(d.X))
            .y(d => this.Driver.Yscale(d.Y));
        this.MaxLines = 0
        for(let i = 0; i < this.Driver.TelLaps.length; i++){
            if(this.Driver.TelLaps[i].length*2 > this.MaxLines){
                this.MaxLines = this.Driver.TelLaps[i].length*2;
            }
        }
    }

    updateAtt(canvas, newAtt){
        this.CurrentAtt = newAtt;
        this.drawLap(canvas);
    }

    drawLap(canvas){
        if(this.Driver.TelLaps[this.CurrentLap-1] == null) return
        let lines = d3.pairs(this.Driver.TelLaps[this.CurrentLap-1]
            .map(function (d){
                return {
                    X: d.X,
                    Y: d.Y
                };
            }))
        let pairs = d3.pairs(this.Driver.TelLaps[this.CurrentLap-1]);
        for(let i = 0; i < this.MaxLines; i++){
            if(i > lines.length){
                canvas.select(".plot"+i)
                    .attr("d","M0,0")
                continue
            }
            let currentLine;
            let pair;
            let strokeWidth = 4;
            if(i==lines.length){
                currentLine = [lines[i-1][0],lines[0][0]];
                pair = [pairs[i-1][0],pairs[0][0]];
            } else {
                currentLine = lines[i];
                pair = pairs[i];
                var dist = Math.sqrt(Math.pow(lines[i][1].X-lines[i][0].X,2) + Math.pow(lines[i][1].Y-lines[i][0].Y,2))
                if(dist > 500) continue; // If distance between points are to big, something is wrong and don't draw
            }
            if(canvas.select(".plot"+i).size()==0){
                canvas.append("path")
                .attr("class","plot"+i)
                .attr("d", this.Line(currentLine))
                .attr("fill","none")
                .attr("stroke", this.colorMapAttribute(pair, this.CurrentAtt))
                .attr("stroke-width", strokeWidth)
            } else {
                canvas.select(".plot"+i)
                .attr("d", this.Line(currentLine))
                .attr("stroke", this.colorMapAttribute(pair, this.CurrentAtt))
                .attr("stroke-width", strokeWidth)
            }
            
            
        }
    }

    colorMapAttribute(d, attr){
        var start = "#00ff3c";
        var end = "#ff0000";
        //Math.round(((parseInt(d[1].Brake)+parseInt(d[0].Brake))/2)/10)-1
        var t;
        switch (attr) {
            case "Brake": t = ((parseFloat(d[1].Brake) + parseFloat(d[0].Brake)) / 2) / 100; break;
            case "Throttle": t = ((parseFloat(d[1].Throttle) + parseFloat(d[0].Throttle)) / 2) / 100; break;
            case "RPM": t = ((parseInt(d[1].RPM) + parseInt(d[0].RPM)) / 2) / (this.Driver.MinMax.rpm[1]); break;
            case "Speed": t = ((parseInt(d[1].Speed) + parseInt(d[0].Speed)) / 2) / (this.Driver.MinMax.speed[1]); break;
            case "Gear": t = (parseInt(d[0].nGear)) / (this.Driver.MinMax.gear[1]); break;
            case "DRS": t = (parseInt(d[0].DRS)) / (this.Driver.MinMax.DRS[1]); break;
        }
        return lerpColor(start, end, t);
    }
    

}