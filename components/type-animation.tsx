'use client'

import { TypeAnimation } from 'react-type-animation'

const TypeAnimationComponent = () => {
  return (
    <TypeAnimation
      sequence={[
        'Decode the future of AI and machine learning',
        1000,
        'Master the art of scalable system design',
        1000,
        'Explore cutting-edge cybersecurity techniques',
        1000,
        'Dive into the world of quantum computing',
        1000,
        'Uncover the potential of blockchain technology',
        1000,
      ]}
      wrapper="span"
      speed={50}
      repeat={Infinity}
    />
  )
}

export default TypeAnimationComponent

