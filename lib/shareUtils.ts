import { Artist } from './artists';

export async function generateShareImage(artist: Artist): Promise<Blob | null> {
  try {
    console.log('🎨 Generating share image for:', artist.koreanName);

    // Create a canvas for the share image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Failed to get canvas context');
      return null;
    }

    // Set canvas size
    canvas.width = 800;
    canvas.height = 1000;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#E63946');
    gradient.addColorStop(0.5, '#9D0208');
    gradient.addColorStop(1, '#1A1A1A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🐴 2026 병오년 운세 🐴', canvas.width / 2, 80);

    // White card background (rounded rectangle)
    ctx.fillStyle = '#FFF8E7';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;

    // Draw rounded rectangle manually for better browser support
    const cardX = 50;
    const cardY = 150;
    const cardWidth = canvas.width - 100;
    const cardHeight = 700;
    const cardRadius = 20;

    ctx.beginPath();
    ctx.moveTo(cardX + cardRadius, cardY);
    ctx.lineTo(cardX + cardWidth - cardRadius, cardY);
    ctx.quadraticCurveTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + cardRadius);
    ctx.lineTo(cardX + cardWidth, cardY + cardHeight - cardRadius);
    ctx.quadraticCurveTo(cardX + cardWidth, cardY + cardHeight, cardX + cardWidth - cardRadius, cardY + cardHeight);
    ctx.lineTo(cardX + cardRadius, cardY + cardHeight);
    ctx.quadraticCurveTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - cardRadius);
    ctx.lineTo(cardX, cardY + cardRadius);
    ctx.quadraticCurveTo(cardX, cardY, cardX + cardRadius, cardY);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Artist emoji/icon
    ctx.font = '120px Arial';
    ctx.fillText('🎨', canvas.width / 2, 280);

    // Artist name (Korean)
    ctx.fillStyle = '#9D0208';
    ctx.font = 'bold 42px Arial';
    ctx.fillText(artist.koreanName, canvas.width / 2, 360);

    // Artist name (English)
    ctx.fillStyle = '#666666';
    ctx.font = '24px Arial';
    ctx.fillText(artist.englishName, canvas.width / 2, 400);

    // Fortune title
    ctx.fillStyle = '#E63946';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('✦ 2026년 당신의 운세 ✦', canvas.width / 2, 480);

    // Fortune text (wrap text - improved for Korean)
    ctx.fillStyle = '#333333';
    ctx.font = '24px Arial, sans-serif';
    ctx.textAlign = 'center';
    const maxWidth = 650;
    const lineHeight = 36;
    let textY = 540;

    // Split by characters for better Korean wrapping
    const text = artist.fortuneText || `${artist.koreanName}의 예술 세계처럼, 2026년 당신의 삶도 독특하고 아름다운 작품이 될 것입니다.`;
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < text.length; i++) {
      const testLine = currentLine + text[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = text[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // Draw lines
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, textY + (index * lineHeight));
    });

    // Keywords (adjust position based on number of lines)
    const keywordY = textY + (lines.length * lineHeight) + 50;
    ctx.font = 'bold 20px Arial';
    const keywords = artist.keywords || ['예술', '개성', '아름다움'];
    const keywordsText = keywords.map(k => `#${k}`).join('  ');
    ctx.fillStyle = '#FFD700';
    ctx.fillText(keywordsText, canvas.width / 2, keywordY);

    // Footer
    ctx.fillStyle = '#999999';
    ctx.font = '18px Arial';
    ctx.fillText('Art Friends × 2026 병오년', canvas.width / 2, 920);

    // Convert to blob
    console.log('✅ Canvas drawn, converting to blob...');
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('✅ Blob created successfully, size:', blob.size, 'bytes');
        } else {
          console.error('❌ Failed to create blob');
        }
        resolve(blob);
      }, 'image/png');
    });
  } catch (error) {
    console.error('❌ Failed to generate share image:', error);
    return null;
  }
}

export function downloadImage(blob: Blob, filename: string) {
  console.log('💾 Starting download:', filename);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  console.log('✅ Download initiated');
}

export function getShareText(artist: Artist): string {
  return `🐴 2026 병오년 나의 예술가: ${artist.koreanName}
✨ 예술가와 함께하는 특별한 한 해!
#아트프렌즈 #2026운세 #병오년 #${artist.koreanName}`;
}

export async function shareToClipboard(artist: Artist) {
  try {
    const text = getShareText(artist);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
