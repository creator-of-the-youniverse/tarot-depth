// Tarot Depth Universal Sharing Utility
// Supports Web Share API with rich gold-themed fallback toast/copy

export interface ShareOptions {
  title: string;
  text: string;
  url?: string;
  category?: 'affirmation' | 'card' | 'reading' | 'journal';
}

export async function shareContent(options: ShareOptions): Promise<{ shared: boolean; copied: boolean }> {
  const shareUrl = options.url || window.location.href;
  const fullText = `${options.title}\n\n${options.text}\n\n✨ Shared from Tarot Depth Sanctuary: ${shareUrl}`;

  // Check if native navigator.share is supported and user-agent permits it
  if (navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: `${options.text}\n\n✨ Shared from Tarot Depth Sanctuary`,
        url: shareUrl,
      });
      return { shared: true, copied: false };
    } catch (err: any) {
      // User cancelled or share failed, fallback to clipboard
      if (err.name !== 'AbortError') {
        console.warn('Native share failed, falling back to clipboard copy:', err);
      }
    }
  }

  // Fallback to Clipboard Copy
  try {
    await navigator.clipboard.writeText(fullText);
    return { shared: false, copied: true };
  } catch (err) {
    console.error('Clipboard copy error:', err);
    return { shared: false, copied: false };
  }
}
