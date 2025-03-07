// Animate a counter element from 0 to a target value with easing and formatting
export const animateCounterElement = (element, endValue, duration = 2000) => {
    if (!element) return;
    
    const startValue = 0;
    const startTime = performance.now();
    
    const isDecimal = String(endValue).includes('.');
    const countTo = parseFloat(endValue);
    const decimalPlaces = isDecimal ? String(endValue).split('.')[1].length : 0;
    
    const formatNumber = (num) => {
      if (isDecimal) {
        return num.toFixed(decimalPlaces);
      }
      if (num >= 1000) {
        return Math.round(num).toLocaleString();
      }
      return Math.round(num).toString();
    };
    
    const animateCount = (timestamp) => {
      const runtime = timestamp - startTime;
      const progress = Math.min(runtime / duration, 1);
      // Using an easing function for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = startValue + (easedProgress * (countTo - startValue));
      element.textContent = formatNumber(currentValue);
      
      if (runtime < duration) {
        requestAnimationFrame(animateCount);
      } else {
        element.textContent = formatNumber(countTo);
      }
    };
    
    requestAnimationFrame(animateCount);
  };
  
  // Minimal scroll-trigger initialization for elements with the "scroll-trigger" class.
  // It applies an animation class when the element is in view.
  export const initScrollTriggerAnimations = () => {
    const animateOnScroll = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const animation = entry.target.dataset.animation || 'fade';
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          
          setTimeout(() => {
            entry.target.classList.add(`animate-${animation}-in`);
            observer.unobserve(entry.target);
          }, delay);
        }
      });
    };
    
    const scrollObserver = new IntersectionObserver(animateOnScroll, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    const scrollElements = document.querySelectorAll('.scroll-trigger');
    scrollElements.forEach(el => scrollObserver.observe(el));
    
    return scrollObserver;
  };
  