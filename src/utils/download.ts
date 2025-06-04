import { toPng } from 'html-to-image';

export const downloadCommentAsImage = async (
  node: HTMLElement,
  commentId: string,
  isDark: boolean
): Promise<void> => {
  try {
    // Create a clone of the node
    const clone = node.cloneNode(true) as HTMLElement;
    
    // Set all images to crossOrigin anonymous
    const images = clone.getElementsByTagName('img');
    for (const img of Array.from(images)) {
      img.crossOrigin = 'anonymous';
      img.setAttribute('crossorigin', 'anonymous');
    }

    // Create container with proper styling
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: ${node.offsetWidth}px;
      padding: 24px;
      background: ${isDark ? '#1f2937' : '#ffffff'};
      border-radius: 16px;
    `;
    
    // Add clone to container
    container.appendChild(clone);
    document.body.appendChild(container);

    // Wait for all images to load
    await Promise.all(
      Array.from(images).map(img => 
        new Promise((resolve, reject) => {
          if (img.complete) {
            resolve(null);
          } else {
            img.onload = () => resolve(null);
            img.onerror = () => reject(new Error('Image failed to load'));
          }
        })
      )
    );

    // Generate PNG
    const dataUrl = await toPng(clone, {
      quality: 1,
      pixelRatio: 2,
      skipAutoScale: true,
      cacheBust: true,
      includeQueryParams: true,
      fetchRequestInit: {
        mode: 'cors',
        credentials: 'omit',
      },
      filter: (node) => {
        // Remove any download buttons from the image
        return !(node instanceof HTMLButtonElement && node.title === 'Download comment as image');
      }
    });

    // Download
    const link = document.createElement('a');
    link.download = `comment-${commentId}.png`;
    link.href = dataUrl;
    link.click();

    // Cleanup
    document.body.removeChild(container);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};