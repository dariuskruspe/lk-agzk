export function requestAnimation(
  duration: number,
  onStep: (per: number, last: boolean) => void,
  onFinish?: () => void
) {
  let start: number;

  const step = (timestamp: number) => {
    if (start === undefined) {
      start = timestamp;
    }
    const elapsed = timestamp - start;
    const per = (elapsed / duration) * 100;
    onStep(per, elapsed >= duration);
    if (elapsed < duration) {
      window.requestAnimationFrame(step);
    } else {
      if (onFinish) {
        onFinish();
      }
    }
  };

  window.requestAnimationFrame(step);
}
