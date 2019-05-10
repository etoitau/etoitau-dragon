function chordAngle(pattern) {
    // return angle between chord and positive x axis
    return Math.atan2(pattern[pattern.length - 1][1] - pattern[0][1], pattern[pattern.length - 1][0] - pattern[0][0]);
}   
   
function chordLength(pattern) {
    console.log("chordLength called, returning:");
    // find straight-line dimension from start point to end point
    let startx = pattern[0][0];
    let starty = pattern[0][1];
    let endx = pattern[pattern.length - 1][0];
    let endy = pattern[pattern.length - 1][1];
    console.log(Math.hypot(startx - endx, starty - endy));
    return Math.hypot(startx - endx, starty - endy);
}

function flip(pattern) {
    // flips pattern over x axis
    let p = JSON.parse(JSON.stringify(pattern));
    for (let i = 0; i < pattern.length; i++) {
        p[i][1] = -1 * pattern[i][1]; 
    }
    return p;
}

function getMaxMin(pattern) {
    var minx = pattern[0][0];
    var maxx = minx;
    var miny = pattern[0][1];
    var maxy = miny;
    for (let i = 1; i < pattern.length; i ++) {
        if (pattern[i][0] < minx) { minx = pattern[i][0] };
        if (pattern[i][0] > maxx) { maxx = pattern[i][0] };
        if (pattern[i][1] < miny) { miny = pattern[i][1] };
        if (pattern[i][1] > maxy) { maxy = pattern[i][1] };
    }
    const xdim = maxx - minx;
    const ydim = maxy - miny;
    var maxdim = xdim;
    if (ydim > maxdim) { maxdim = ydim }
    return {
        "minx": minx,
        "maxx": maxx,
        "miny": miny,
        "maxy": maxy,
        "xdim": xdim,
        "ydim": ydim,
        "maxdim": maxdim
    };
}

function rotate(pattern, angle) {
    // rotate all points in pattern by angle about origin
    let p = JSON.parse(JSON.stringify(pattern));
    for (let i = 0; i < pattern.length; i++) {
        p[i][0] = pattern[i][0] * Math.cos(angle) - pattern[i][1] * Math.sin(angle);
        p[i][1] = pattern[i][0] * Math.sin(angle) + pattern[i][1] * Math.cos(angle); 
    }
    return p;
}

function scale(pattern, factor) {
    // scale pattern by factor
    // note move to origin first to get pattern that is factor x bigger
    p = JSON.parse(JSON.stringify(pattern))
    for (let i = 0; i < pattern.length; i++) {
        p[i][0] *= factor;
        p[i][1] *= factor; 
    }
    return p;
}    

function translation(pattern, move_to) {
    // translate pattern such that starting point is at point givin as move_to
    p = JSON.parse(JSON.stringify(pattern))
    deltax = move_to[0] - pattern[0][0];
    deltay = move_to[1] - pattern[0][1];
    for (let i = 0; i < pattern.length; i++) {
        p[i][0] += deltax;
        p[i][1] += deltay;
    }
    return p;
}

function normalize(pattern) {
    console.log("normalize called")
    console.log("starting pattern:")
    console.log(JSON.stringify(pattern))
    // move to origin
    var p = translation(pattern, [0, 0]);
    console.log("after translation:")
    console.log(JSON.stringify(p))
    // get length from start to end
    chord_length = chordLength(p);
    // scale down such that chord is unit length
    p = scale(p, 1/chord_length);
    console.log("after scale:")
    console.log(JSON.stringify(p))
    // get chord angle
    chord_angle = chordAngle(p);
    // rotate pattern such that chord is at angle of 0
    p = rotate(p, -1 * chord_angle);
    console.log("after rotation:")
    console.log(JSON.stringify(p))
    return p;
}