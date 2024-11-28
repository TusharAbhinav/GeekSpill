export const svgBackground = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'>
  <rect fill='#1a1a1a' width='2000' height='1500'/>
  <defs>
    <rect stroke='#1a1a1a' stroke-width='.5' width='1' height='1' id='s'/>
    <pattern id='a' width='3' height='3' patternUnits='userSpaceOnUse' patternTransform='scale(50) translate(-980 -735)'>
      <use fill='#242424' href='#s' y='2'>
        <animate attributeName='fill' values='#242424;#1a1a1a;#242424' dur='2s' repeatCount='indefinite'/>
      </use>
      <use fill='#2b2b2b' href='#s' x='1' y='2'>
        <animate attributeName='fill' values='#2b2b2b;#242424;#2b2b2b' dur='3s' repeatCount='indefinite'/>
      </use>
      <use fill='#333333' href='#s' x='2' y='2'>
        <animate attributeName='fill' values='#333333;#2b2b2b;#333333' dur='4s' repeatCount='indefinite'/>
      </use>
    </pattern>
  </defs>

  <!-- Animated Background Patterns -->
  <rect fill='url(#a)' width='100%' height='100%'>
    <animate attributeName='opacity' values='1;0.8;1' dur='4s' repeatCount='indefinite'/>
  </rect>

</svg>`)}`;
