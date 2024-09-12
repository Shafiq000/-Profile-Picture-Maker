import React, { useEffect, useImperativeHandle, forwardRef } from 'react';

const Canvas = forwardRef(({ imageSrc, style }, ref) => {
  useImperativeHandle(ref, () => ({
    drawImage() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = style.backgroundColor || 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      image.src = imageSrc;
    }
  }));

  return <canvas id="canvas" style={{ display: 'none' }} />;
});

export default Canvas;
