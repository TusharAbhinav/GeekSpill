export const svgBackground = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="gridGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1">
        <animate attributeName="stop-color" values="#1a1a1a;#242424;#1a1a1a" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:#333333;stop-opacity:1">
        <animate attributeName="stop-color" values="#333333;#2b2b2b;#333333" dur="4s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    
    <!-- Grid pattern -->
    <pattern id="grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" 
            fill="none" 
            stroke="rgb(255, 255, 255, 0.1) " 
            stroke-width="0.5">
        <animate attributeName="stroke-width" 
                 values="0.5;1;0.5" 
                 dur="3s" 
                 repeatCount="indefinite"/>
      </path>
    </pattern>
  </defs>

  <!-- Base background -->
  <rect width="100%" height="100%" fill="url(#gridGradient)"/>
  
  <!-- Animated grid -->
  <g>
    <rect width="100%" height="100%" fill="url(#grid)">
      <animateTransform attributeName="transform"
                        type="translate"
                        from="0 0"
                        to="0 80"
                        dur="3s"
                        repeatCount="indefinite"/>
    </rect>
    <rect width="100%" height="100%" fill="url(#grid)">
      <animateTransform attributeName="transform"
                        type="translate"
                        from="0 -80"
                        to="0 0"
                        dur="3s"
                        repeatCount="indefinite"/>
    </rect>
  </g>

  <!-- Horizontal lines with glow effect -->
  <g>
    <line x1="0" y1="300" x2="1000" y2="300" stroke="#2b2b2b" stroke-width="1">
      <animate attributeName="y1" values="300;310;300" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="y2" values="300;310;300" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" values="1;2;1" dur="2s" repeatCount="indefinite"/>
    </line>
  </g>
</svg>`)}`;
