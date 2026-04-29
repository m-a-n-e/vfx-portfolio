import { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const cursorX = useSpring(0, { damping: 20, stiffness: 250 });
  const cursorY = useSpring(0, { damping: 20, stiffness: 250 });

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = 
        target.closest('button') || 
        target.closest('a') || 
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(!!isClickable);
    };

    // Custom events for more control (like with iframes)
    const hideCursor = () => setIsHidden(true);
    const showCursor = () => setIsHidden(false);

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('vfx-hide-cursor', hideCursor);
    window.addEventListener('vfx-show-cursor', showCursor);
    window.addEventListener('blur', hideCursor);
    window.addEventListener('focus', showCursor);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('vfx-hide-cursor', hideCursor);
      window.removeEventListener('vfx-show-cursor', showCursor);
      window.removeEventListener('blur', hideCursor);
      window.removeEventListener('focus', showCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        opacity: isHidden ? 0 : 1,
      }}
    >
      <motion.div
        animate={{
          width: isHovering ? 80 : 20,
          height: isHovering ? 80 : 20,
          scale: isHidden ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="rounded-full bg-white"
      />
    </motion.div>
  );
}
