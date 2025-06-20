'use client';
import React from 'react';
import Image, { ImageProps } from 'next/image';

const customLoader = ({ src }: { src: string }) => src;

export function ClientImage({ alt = '', ...props }: Omit<ImageProps, 'loader'>) {
  return <Image {...props} alt={alt} loader={customLoader} unoptimized />;
}
