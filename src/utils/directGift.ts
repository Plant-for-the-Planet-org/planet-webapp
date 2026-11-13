export type DirectGiftType = {
  id: string;
  displayName: string;
  type: string;
};

const DIRECT_GIFT_KEY = 'directGift';

// Storage access can throw when the browser blocks it, so every helper here is best-effort.
export const storeDirectGift = (directGift: DirectGiftType): void => {
  try {
    localStorage.setItem(DIRECT_GIFT_KEY, JSON.stringify(directGift));
  } catch {
    // Without storage the gift is simply not kept.
  }
};

// A user cannot send a direct gift to their own profile.
export const isSelfDirectGift = (
  directGift: DirectGiftType,
  userSlug: string
): boolean => directGift.id === userSlug;

export const clearStoredDirectGift = (): void => {
  try {
    localStorage.removeItem(DIRECT_GIFT_KEY);
  } catch {
    // Nothing to clear when storage is blocked.
  }
};

// Clears the stored value when it is malformed, so a bad entry does not linger.
export const readStoredDirectGift = (): DirectGiftType | null => {
  try {
    const storedDirectGift = localStorage.getItem(DIRECT_GIFT_KEY);
    if (!storedDirectGift) return null;
    const parsedDirectGift = JSON.parse(storedDirectGift);
    if (
      parsedDirectGift &&
      typeof parsedDirectGift.id === 'string' &&
      typeof parsedDirectGift.displayName === 'string' &&
      typeof parsedDirectGift.type === 'string'
    ) {
      return parsedDirectGift;
    }
  } catch {
    // Blocked storage or malformed JSON; both are treated as no gift.
  }
  clearStoredDirectGift();
  return null;
};
