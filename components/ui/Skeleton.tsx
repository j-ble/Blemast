import * as React from 'react';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const baseStyle = 'animate-pulse rounded-md bg-muted';
  const combinedClassName = [baseStyle, className].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClassName}
      {...props}
    />
  );
}

export { Skeleton };