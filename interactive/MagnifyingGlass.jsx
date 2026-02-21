import React, { useState, useEffect, useRef } from 'react';

export default function MagnifyingGlass({ children, enabled = true, lensSize = 180, zoomLevel = 1.4 }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || !('onmousemove' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth mouse tracking with requestAnimationFrame
  useEffect(() => {
    if (!enabled || isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setIsActive(true);
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    let animationId;
    const smoothTrack = () => {
      // Smooth interpolation (lerp)
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.15;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.15;
      
      setMousePos({
        x: currentPos.current.x,
        y: currentPos.current.y
      });

      animationId = requestAnimationFrame(smoothTrack);
    };

    animationId = requestAnimationFrame(smoothTrack);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, isMobile]);

  if (isMobile || !enabled) {
    return <div ref={containerRef} className="relative">{children}</div>;
  }

  const lensRadius = lensSize / 2;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ cursor: 'none' }}
    >
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Backdrop dimming overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: isActive ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0)',
          opacity: isActive ? 1 : 0,
          zIndex: 20
        }}
      />

      {/* Magnification lens container */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${mousePos.x - lensRadius}px`,
          top: `${mousePos.y - lensRadius}px`,
          width: `${lensSize}px`,
          height: `${lensSize}px`,
          zIndex: 30,
          opacity: isActive ? 1 : 0,
          transition: !isActive ? 'opacity 0.3s ease-out' : 'none'
        }}
      >
        {/* Lens glow/border effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `
              0 0 30px rgba(37, 99, 235, 0.4),
              0 0 60px rgba(37, 99, 235, 0.2),
              inset 0 0 20px rgba(255, 255, 255, 0.1)
            `,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(0px)'
          }}
        />

        {/* Magnified content layer */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            clipPath: `circle(${lensRadius}px at center)`,
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Content with magnification */}
          <div
            style={{
              position: 'absolute',
              left: `${-mousePos.x * (zoomLevel - 1)}px`,
              top: `${-mousePos.y * (zoomLevel - 1)}px`,
              transform: `scale(${zoomLevel})`,
              width: '100vw',
              height: '100vh',
              transformOrigin: '0 0',
              pointerEvents: 'none'
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Custom cursor dot (optional) */}
      <div
        className="fixed pointer-events-none z-40"
        style={{
          left: `${mousePos.x - 4}px`,
          top: `${mousePos.y - 4}px`,
          width: '8px',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '50%',
          opacity: isActive ? 1 : 0,
          transition: !isActive ? 'opacity 0.3s ease-out' : 'none',
          boxShadow: '0 0 8px rgba(37, 99, 235, 0.6)'
        }}
      />
    </div>
  );
}