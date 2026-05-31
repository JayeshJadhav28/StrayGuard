"use client";

import React, { useState } from "react";

interface PreviewImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function PreviewImage({ src, alt = "", className = "" }: PreviewImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const fallback =
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect fill='%23e5e7eb' width='600' height='400'/><text x='50%' y='50%' text-anchor='middle' fill='%236b7280' font-size='24'>Dashboard Preview</text></svg>";

  return (
    // Intentional client component to handle DOM event handlers (onError)
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback);
      }}
    />
  );
}
