var circle =[];

function setup() {
  // Create screen
  createCanvas(windowWidth,windowHeight);

  // Random velocity array
  r = [-3-2,2,3];

  // Creates circle objects and adds to array
  circle[0] = new Circle(
    /*diamater*/ 200,
    /*position (x,y)*/ 200, 200,
    /*velocity (x,y)*/ random(r), random(r),
    /*color*/color('orange')
  );

  circle[1] = new Circle(
    /*diamater*/ 200,
    /*position (x,y)*/ 200, 600,
    /*velocity (x,y)*/ random(r), random(r),
    /*color*/ color('blue')
  );

  circle[2] = new Circle(
    /*diamater*/ 200,
    /*position (x,y)*/ 600, 600,
    /*velocity (x,y)*/ random(r), random(r),
    /*color*/ color('red')
  );
}

function draw() {
  // Draws background over everything reseting screen
  background(80);

  // Computes new positions for circle in array circle[] and draws them
  circleCompute();
}

// Called when window resizes
function windowResized() {
  createCanvas(windowWidth,windowHeight);
}

// Circle class
function Circle(idiam, ixpos, iypos, ixvel, iyvel, icolor) {

  this.diam = idiam;
  this.xpos = ixpos;
  this.ypos = iypos;
  this.xvel = ixvel;
  this.yvel = iyvel;
  this.color = icolor;

  // Draws ellipse on screen
  this.create = function() {
    fill(this.color);
    strokeWeight(0);
    ellipseMode(CENTER);
    ellipse(this.xpos, this.ypos, this.diam);
  }

  // Adds velocity to position
  this.update = function() {
    this.xpos = this.xpos + ( this.xvel );
    this.ypos = this.ypos + ( this.yvel );
  }

  // Test to see if the shape exceeds the boundaries of the screen if it is change the velocity
  this.checkBorder = function() {
    if (this.xpos > width - this.diam/2) {
      this.xvel = -1*abs(this.xvel);
    }
    else if (this.xpos < this.diam/2) {
      this.xvel = abs(this.xvel);
    }
    if (this.ypos > height - this.diam/2) {
      this.yvel = -1*abs(this.yvel);
    }
    else if (this.ypos < this.diam/2) {
      this.yvel = abs(this.yvel);
    }
  }
}

function circleCompute() {

  // Checks all circles for border contact and computes accordingly
  for(var i=0; i<circle.length; i++) {
    circle[i].checkBorder();
  }

  // Recursively compares all ellipses and computes resultant velocities if intersecting
  compareAll(0);

  // Adds velocity to position for circles and draws them
  for(var i=0; i<circle.length; i++) {
    circle[i].update();
    circle[i].create();
  }
}

// Recursively compares all ellipses and computes resultant velocities if intersecting
function compareAll(i) {
  for(var j=i+1; j<circle.length; j++) {
    if(areIntersect(circle[i],circle[j])) {
      phi = atan((circle[i].ypos - circle[j].ypos) / (circle[i].xpos - circle[j].xpos));
      //console.log(phi);
      theta1 = thetaCompute(circle[i]);
      theta2 = thetaCompute(circle[j]);
      velocity1 = sqrt((circle[i].xvel*circle[i].xvel)+(circle[i].yvel*circle[i].yvel));
      velocity2 = sqrt((circle[j].xvel*circle[j].xvel)+(circle[j].yvel*circle[j].yvel));
      // Compues velocity in x and y direction for both circles using formula found at https://en.wikipedia.org/wiki/Elastic_collision
      circle[i].xvel = velocity2*cos(theta2-phi)*cos(phi) + velocity1*sin(theta1-phi)*cos(phi + HALF_PI);
      circle[i].yvel = velocity2*cos(theta2-phi)*sin(phi) + velocity1*sin(theta1-phi)*sin(phi + HALF_PI);
      circle[j].xvel = velocity1*cos(theta1-phi)*cos(phi) + velocity2*sin(theta2-phi)*cos(phi + HALF_PI);
      circle[j].yvel = velocity1*cos(theta1-phi)*sin(phi) + velocity2*sin(theta2-phi)*sin(phi + HALF_PI);
      //console.log(circle[i].xvel+" "+circle[i].yvel+" "+circle[j].xvel+" "+circle[j].yvel)
    }
  }
  if(i<circle.length-2) {
    compareAll(i+1);
  }
}

//adds Pi if resultant is supposed to be in 2nd or 3rd quadrants
function thetaCompute(circle1) {
  theta = atan(circle1.yvel/circle1.xvel);
  if(circle1.xvel<0) {
    return theta + PI;
  }
  else {
    return theta;
  }
}

// Returns true if two circles are intersecting
function areIntersect(circle1, circle2) {
  // Checks if distance between the two centers is less than the addition of the two diamaters
  if (dist(circle1.xpos,circle1.ypos,circle2.xpos,circle2.ypos) <= circle1.diam/2+circle2.diam/2) {
    //console.log("hit");
    return true;
  }
  return false;
}
