
class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 8;
    this.done = false;
  }
  
  draw(groupElement) {
    drawHeart(this.x, this.y, this.r, groupElement);
  }
}

let svg;
let w = 1650;
let h = 1170;
let circles;
let imageBuffer;

function setup() {
  svg = document.querySelector("svg");
  document.addEventListener("click", draw);
  document.addEventListener("keydown", onKeyDown);
}


function createSvgElement(elementName) {
  const svgNs = "http://www.w3.org/2000/svg";
  return document.createElementNS(svgNs, elementName);
}

function onKeyDown (e) {
  if(e.code === "KeyD") {
    download();
  }
}

function download() {
  let svgDoc = svg.outerHTML;
  let filename = "heart-packing.svg";
  let element = document.createElement("a");
  element.setAttribute("href", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgDoc));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.addEventListener("click", e => e.stopPropagation());
  element.click();
  document.body.removeChild(element);
}

function dist(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function addCircles() {
  let nrOfTries = 0;
  let wasAdded;
  let margin = 0.15;
  do {
    wasAdded = false;
    let x = (1 - margin * 2) * Math.random() * w + w * margin;
    let y = (1 - margin * 2) * Math.random() * h + h * margin;

    //let x = Math.random() * w;
    //let y = Math.random() * h;
    if(validPos(x, y)) {
      wasAdded = true;
      let c = new Circle(x, y);
      circles.push(c);
    }
    nrOfTries++;
  } while (!wasAdded && nrOfTries < 50)
}

function validPos(x, y) {
  let index = Math.round(y) * w + Math.round(x);
  for(let i = 0; i < circles.length; i++) {
    let current = circles[i];
    let d = dist(x, y, current.x, current.y);
    if(d - 16 < current.r) {
      return false;
    }
  }
  return true;
}

function canGrow(circle) {
  if(circle.r > 100) return false;
  
  for(let i = 0; i < circles.length; i++) {
    let current = circles[i];
    if(circle !== current) {
      let d = dist(circle.x, circle.y, current.x, current.y);
      if(d - 4 <= circle.r + current.r) {
        return false;
      } 
    }
  }
  return true;
}

function resetCircles() {
  circles = [];
}
  
function packCircles() {
  let nrOfTries = w * h / 400;
  for(let i = 0; i < nrOfTries; i++) {
    //if(i % 2 === 0) {
      addCircles();
    //}
    circles.filter(c => !c.done).forEach(c => {
      if(canGrow(c)) {
        c.r += 2;
      } else {
        c.done = true;
      }
    });
  }
}

function drawHeart(x, y, size, groupElement) {
  let path = createSvgElement("path");
  path.setAttribute("d", "M17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z");
  path.setAttribute("transform", `translate(${x-size*1.6} ${y-size*1.3}) scale(${size/16})`);
  path.setAttribute("line-width", "1");
  groupElement.appendChild(path);
}  
   
function drawCircles(groupElement) {
  circles.forEach(circle => circle.draw(groupElement));
}
  
function draw() {
  console.clear();
  
  let group = document.querySelector("#container");
  if(group) {
    group.remove();
  }
  group = createSvgElement("g");
  group.setAttribute("id", "container");
  group.setAttribute("fill", "none");
  group.setAttribute("stroke", "white");
  group.setAttribute("stroke-linecap", "round");
  group.setAttribute("stroke-linejoin", "round");
  
  resetCircles();
  packCircles();
  drawCircles(group);
  
  let logo = new Logo(w - 120, h - 70, "white");
  logo.draw(group);

  svg.appendChild(group);
}

setup();
draw();
