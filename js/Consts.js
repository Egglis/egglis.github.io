const valueCount = 100,
  iterationSize = 10,
  width = 1200,
  height = 2000,
  margin = 20,
  marginLeft = 600,
  marginBottom = 1400

const attrs= [
    "Brake",
    "Throttle",
    "RPM",
    "Speed",
    "Gear"
]

const attrsTags= [
  "Brake%",
  "Throttle%",
  "RPM",
  "Speed(km/h)",
  "Gear"
]

let driverNr = new Map;
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

const TeamColorsMap = new Map();
TeamColorsMap.set("Red Bull", "#0600EF")
TeamColorsMap.set("Mercedes", "#00D2BE")
TeamColorsMap.set("Ferrari", "#DC0000")
TeamColorsMap.set("AlphaTauri",	"#2B4562")
TeamColorsMap.set("McLaren",	"#FF8700")
TeamColorsMap.set("Alpine F1 Team", "#0090FF")
TeamColorsMap.set("Aston Martin", "#006F62")
TeamColorsMap.set("Alfa Romeo", "#900000")
TeamColorsMap.set("Williams",	"#005AFF")
TeamColorsMap.set("Haas F1 Team",	"#FFFFFF")

const ticks = [
  10,
  10,
  13,
  16,
  8
]

function lerpColor(a, b, amount) { 
    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);
    
    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}