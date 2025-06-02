window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

onload = function () {
    setTimeout(init, 0);
};

init = function () {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    onresize = function () {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    onresize();

    mouse = { x: canvas.width / 2, y: canvas.height / 2, out: false };

    canvas.onmouseout = function () {
        mouse.out = true;
    };

    canvas.onmousemove = function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            out: false
        };
    };

    gravityStrength = 10;
    particles = [];
    spawnTimer = 0;
    spawnInterval = 10;
    type = 0;
    requestAnimationFrame(startLoop);
};

// Function to generate a random purple gradient color with similar brightness
function getPurpleGradientColor() {
    const colors = [
        'rgba(148, 0, 211, 0.7)',   // Dark Violet (High opacity)
        'rgba(138, 43, 226, 0.7)',  // Blue Violet (High opacity)
        'rgba(75, 0, 130, 0.7)',    // Indigo (High opacity)
        'rgba(186, 85, 211, 0.7)',  // Medium Orchid (High opacity)
        'rgba(153, 50, 204, 0.7)',  // Dark Orchid (High opacity)
        'rgba(106, 90, 205, 0.7)',  // Slate Blue (High opacity)
        'rgba(123, 104, 238, 0.7)'  // Medium Slate Blue (High opacity)
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

newParticle = function () {
    type = type ? 0 : 1;
    particles.push({
        x: mouse.x,
        y: mouse.y,
        xv: type ? 18 * Math.random() - 9 : 24 * Math.random() - 12,
        yv: type ? 18 * Math.random() - 9 : 24 * Math.random() - 12,
        c: getPurpleGradientColor(),  // Apply the purple gradient color with high opacity
        s: type ? 5 + 10 * Math.random() : 1,
        a: 1
    });
};

startLoop = function (newTime) {
    time = newTime;
    requestAnimationFrame(loop);
};

loop = function (newTime) {
    draw();
    calculate(newTime);
    requestAnimationFrame(loop);
};

draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;  // Use the new color gradient
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, 2 * Math.PI);
        ctx.fill();
    }
};

calculate = function (newTime) {
    var dt = newTime - time;
    time = newTime;

    if (!mouse.out) {
        spawnTimer += dt < 100 ? dt : 100;
        for (; spawnTimer > 0; spawnTimer -= spawnInterval) {
            newParticle();
        }
    }

    particleOverflow = particles.length - 700;
    if (particleOverflow > 0) {
        particles.splice(0, particleOverflow);
    }

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (!mouse.out) {
            x = mouse.x - p.x;
            y = mouse.y - p.y;
            a = x * x + y * y;
            a = a > 100 ? gravityStrength / a : gravityStrength / 100;
            p.xv = (p.xv + a * x) * 0.99;
            p.yv = (p.yv + a * y) * 0.99;
        }
        p.x += p.xv;
        p.y += p.yv;
        p.a *= 0.99;
    }
};










// icon-bg



