import React, { useEffect, useState } from "react";

const animationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 },
};

// Dynamically import framer-motion so the animation library is only loaded when needed.
const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [Motion, setMotion] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    import('framer-motion').then(mod => {
      if (mounted) setMotion(() => mod.motion);
    }).catch(() => {
      // ignore; we'll fallback to plain rendering
    });
    return () => { mounted = false; };
  }, []);

  if (!Motion) {
    // while framer-motion loads (small chunk), render children normally
    return <div>{children}</div>;
  }

  const MotionDiv = Motion.div;
  return <MotionDiv {...animationProps}>{children}</MotionDiv>;
};

export default AnimatedPage;