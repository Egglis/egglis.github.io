class Path {
    constructor(year, track, session, driver){
        this.year = year;
        this.track= track;
        this.session = session;
        this.driver = driver;
        this.file = "database/"+year+"/"+track+"/"+session+"/Drivers/"+driver+".csv";
    }

    getLapsFile(){
        var s = "R";
        if(this.session == "Quali") {s = "Q";}
        var lapsFileName = s+this.year+this.track.replace(/ /g,'')+"Laps.csv";
        return "database/"+this.year+"/"+this.track+"/"+this.session+"/"+lapsFileName;
    }
}

class DateTime{
    // hh:mm:ss
    constructor(time) {
        this.timeStr = time;
        let hhmmss = time.split(":");
        this.hhS = hhmmss[0];
        this.mmS = hhmmss[1];
        this.ssS = hhmmss[2];
        this.hh = parseInt(hhmmss[0]);
        this.mm = parseInt(hhmmss[1]);
        this.ss = parseInt(hhmmss[2]);
    }

    lessThan(time){
        if(this.hh < time.hh){
            return true
        }
        return false;
    }

    greaterThan(time){
        if(this.hh > time.hh){
            return true
        }
        return false;
    }

}

