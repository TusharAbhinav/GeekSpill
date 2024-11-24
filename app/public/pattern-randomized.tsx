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

  <!-- Google Logo -->
  <g transform="translate(940,430) scale(3.5)">
    <path fill="#EA4335" d="M24 14c2.2 0 4.2.8 5.8 2.2l4.4-4.4C31.4 9.5 28 8 24 8 16.8 8 10.7 12.5 8.4 18.4l5.3 4.1C15 16.3 19 14 24 14z"/>
    <path fill="#34A853" d="M24 38c3.6 0 6.9-1.3 9.4-3.4l-4.8-3.9c-1.3.9-3 1.4-4.6 1.4-4.2 0-7.7-2.8-8.9-6.7H9.7v4.2C12 33.5 17.6 38 24 38z"/>
    <path fill="#4A90E2" d="M38 24c0-1.3-.1-2.5-.4-3.6H24v7.2h8c-.3 1.5-1.1 2.8-2.3 3.8v3.1h3.7c2.2-2.1 4.6-5.2 4.6-10.5z"/>
    <path fill="#FBBC05" d="M15.3 24c0-1.1.2-2.1.5-3.1v-4.2H9.7c-1 2-1.6 4.2-1.6 6.6s.6 4.6 1.6 6.6l5.6-4.1C15.5 26.1 15.3 25 15.3 24z"/>
  </g>

  <!-- Netflix Logo -->
  <g transform="translate(700,300) " fill="#E50914">
    <path d="M0 0h120v120H0z" fill="none"/>
    <path d="M30 0h20v120H30zM50 0h20v60l20-60h20v120H90V60L70 120H50z"/>
  </g>

  <g transform="translate(1000,300) scale(2.5)" fill="#1877F2" >
    <rect width="40" height="40" rx="6"/>
    <path d="M27.7 25.7L28.6 20H23.2V16.3C23.2 14.7 24 13.2 26.5 13.2H28.9V8.3C28.9 8.3 26.6 7.9 24.4 7.9C19.8 7.9 16.9 10.6 16.9 15.6V20H12V25.7H16.9V39.5C18 39.7 19.1 39.8 20.1 39.8C21.1 39.8 22.2 39.7 23.3 39.5V25.7H27.7z" fill="white"/>
  </g>

  <!-- Microsoft Logo -->
  <g transform="translate(900,900) " fill="#357EC7">
    <path d="M0 0h40v40H0zM50 0h40v40H50zM0 50h40v40H0zM50 50h40v40H50z"/>
  </g>

</svg>`)}`;
