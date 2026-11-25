(function () {
  if (window.__pinskinXmasFx) return;
  window.__pinskinXmasFx = true;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var style = document.createElement('style');
  style.textContent = [
    '#xmas-snow{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:15;}',
    '#xmas-tree{position:fixed;right:10px;bottom:0;width:118px;pointer-events:none;z-index:15;',
    'filter:drop-shadow(0 8px 14px rgba(10,30,20,0.28));}',
    '#xmas-tree .xmas-light{animation:xmasTwinkle 1.6s ease-in-out infinite;transform-origin:center;}',
    '#xmas-tree .xmas-star{animation:xmasGlow 2.4s ease-in-out infinite;transform-origin:150px 18px;}',
    '#xmas-tree .xmas-tiers{animation:xmasSway 5s ease-in-out infinite;transform-origin:150px 300px;}',
    '@keyframes xmasTwinkle{0%,100%{opacity:.35;}50%{opacity:1;}}',
    '@keyframes xmasGlow{0%,100%{filter:drop-shadow(0 0 2px #fff4c2);opacity:.85;}50%{filter:drop-shadow(0 0 7px #fff4c2);opacity:1;}}',
    '@keyframes xmasSway{0%,100%{transform:rotate(-1.6deg);}50%{transform:rotate(1.6deg);}}',
    '@media (max-width:700px){#xmas-tree{width:70px;right:6px;}}',
    reduceMotion ? '#xmas-tree .xmas-light,#xmas-tree .xmas-star,#xmas-tree .xmas-tiers{animation:none;}' : ''
  ].join('\n');
  document.head.appendChild(style);

  var lightColors = ['#c81d3b', '#ffd35a'];
  var lightsMarkup = '';
  var positions = [
    [150, 90], [122, 108], [178, 108], [150, 132], [108, 150], [192, 150],
    [150, 172], [96, 196], [204, 196], [150, 212], [84, 240], [216, 240],
    [150, 258], [72, 284], [228, 284], [150, 300]
  ];
  for (var i = 0; i < positions.length; i++) {
    lightsMarkup += '<circle class="xmas-light" style="animation-delay:' + (i * 0.14) + 's" cx="' + positions[i][0] + '" cy="' + positions[i][1] + '" r="4.2" fill="' + lightColors[i % lightColors.length] + '"/>';
  }

  var treeHost = document.createElement('div');
  treeHost.id = 'xmas-tree';
  treeHost.innerHTML =
    '<svg viewBox="0 0 300 330" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="xmas-tiers">' +
        '<rect x="138" y="300" width="24" height="26" rx="3" fill="#6b4328"/>' +
        '<polygon points="150,60 228,210 72,210" fill="#1f6b46"/>' +
        '<polygon points="150,100 246,250 54,250" fill="#19573a"/>' +
        '<polygon points="150,140 262,290 38,290" fill="#134a30"/>' +
        lightsMarkup +
      '</g>' +
      '<g class="xmas-star" transform="translate(150,18)">' +
        '<path d="M0,-18 L5,-5 L19,-5 L8,3 L12,17 L0,8 L-12,17 L-8,3 L-19,-5 L-5,-5 Z" fill="#ffe58a" stroke="#f6c744" stroke-width="1"/>' +
      '</g>' +
    '</svg>';
  document.body.appendChild(treeHost);

  if (reduceMotion) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'xmas-snow';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var W, H, flakes;
  function sizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeFlakes() {
    var density = Math.min(140, Math.max(50, Math.round((W * H) / 16000)));
    flakes = [];
    for (var i = 0; i < density; i++) {
      var layer = Math.random();
      flakes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: layer < 0.55 ? 1 + Math.random() * 1.6 : 2.4 + Math.random() * 2.4,
        speedY: layer < 0.55 ? 0.4 + Math.random() * 0.6 : 1.1 + Math.random() * 1.3,
        speedX: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        drift: 10 + Math.random() * 20,
        opacity: layer < 0.55 ? 0.35 + Math.random() * 0.25 : 0.6 + Math.random() * 0.35
      });
    }
  }

  sizeCanvas();
  makeFlakes();
  window.addEventListener('resize', function () {
    sizeCanvas();
    makeFlakes();
  });

  var t = 0;
  function tick() {
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.speedY;
      f.x += Math.sin(t + f.phase) * (f.drift * 0.01) + f.speedX * 0.1;
      if (f.y > H + 6) {
        f.y = -6;
        f.x = Math.random() * W;
      }
      if (f.x > W + 6) f.x = -6;
      if (f.x < -6) f.x = W + 6;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + f.opacity + ')';
      ctx.shadowColor = 'rgba(255,255,255,0.6)';
      ctx.shadowBlur = f.r * 1.5;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
