import imageUrl from '../assets/images/png/water-mark.png'
const Watermark = () => {
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 999999,
        opacity: 0.7,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pointerEvents: 'none'
      }}
    />
  )
}

export default Watermark
