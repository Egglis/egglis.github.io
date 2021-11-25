class Track {

    Outline;

    constructor(track){
        this.Name = track;
        this.loadTrack(track);
    }

    drawTrackLayout(canvas){
        let x_track_scale
        let y_track_scale
        if(this.Outline!=null){
            x_track_scale = d3
                .scaleLinear()
                .domain(d3.extent(this.Outline, function (d) {return parseFloat(d.x_m);}))
                .range([margin, width - margin - marginLeft]);
    
             y_track_scale= d3
                .scaleLinear()
                .domain(d3.extent(this.Outline, function (d) {return parseFloat(d.y_m);}))
                .range([height - margin - marginBottom, margin]);
        

        let outline = d3.line()
            .x(function (d){return x_track_scale(d.x_m);})
            .y(function (d){return y_track_scale(d.y_m);})

            var outlines = d3.pairs(this.Outline);
            var avgTrackWidth = d3.mean(this.Outline.map(function (d){
                return {
                    w: ((parseFloat(d.w_tr_right_m) + parseFloat(d.w_tr_left_m))/2)
                }
            }), d => d.w);
    
            for(var i = 0; i < outlines.length+1; i++){
                let currentLine;
                let strokeWidth;
                if(i==outlines.length){
                    currentLine = [outlines[i-1][0],outlines[0][0]];
                    strokeWidth = 40;
                }
                else {
                    currentLine = outlines[i]
                    strokeWidth = parseFloat(avgTrackWidth)+5;
                }
                canvas.append("path")
                .attr("class","track")
                .attr("d", outline(currentLine))
                .attr("stroke","Black")
                .attr("stroke-width",strokeWidth+5)
                .attr("fill","White")
            }
            canvas.append("path")
            .attr("class","track")
            .attr("d", outline(this.Outline))
            .attr("stroke","White")
            .attr("stroke-width",parseFloat(outlines[0][0].w_tr_right_m)+4)
            .attr("fill","none")
        } 
    }

    // Loading Data
    loadTrack(trackName){
        try {
            var response = $.ajax({
                type: "GET",
                url: "/tracks/"+ trackName + ".csv",
                dataType: "text",
                async: false,
                error: function (){ return null}
            })
        } catch (err) {
            return null;
        }
        if(response.status==404){
            this.Outline = null;
            return null;
        }
        var text = response.responseText.replace(/# /g,"");
        var finalObj = [];
        var arr = text.split("\n");
        var headers = arr[0].split(",");
    
        for(var i = 1; i < arr.length-1; i++){
            var data = arr[i].split(",");
    
            var obj = {};
            for(var j = 0; j < data.length; j++){
                obj[headers[j]] = data[j];
            }
            finalObj.push(obj);
        }
    
        this.Outline = finalObj;
    }
}