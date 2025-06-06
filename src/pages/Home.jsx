import React from 'react'
import homeImage from '../assets/homeImage.png';

export default function Home() {
  return (
    <>
      <img 
      src={homeImage}
      style={{ width: '100%', 
        minHeight: 'calc(100vh - 56px)', 
        objectFit: 'cover', 
         left: 0 }}
      alt='Home Image'
      />
    </>
  )
}
