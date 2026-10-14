export type DirectGiftType = {
  id: string;
  displayName: string;
  type: string;
};

const DIRECT_GIFT_KEY = 'directGift';

export const storeDirectGift = (directGift: DirectGiftType): void => {
  localStorage.setItem(DIRECT_GIFT_KEY, JSON.stringify(directGift));
};

// A user cannot send a direct gift to their own profile.
export const isSelfDirectGift = (
  directGift: DirectGiftType,
  userSlug: string
): boolean => directGift.id === userSlug;

export const clearStoredDirectGift = (): void => {
  localStorage.removeItem(DIRECT_GIFT_KEY);
};

// Clears the stored value when it is malformed, so a bad entry does not linger.
export const readStoredDirectGift = (): DirectGiftType | null => {
  const storedDirectGift = localStorage.getItem(DIRECT_GIFT_KEY);
  if (!storedDirectGift) return null;
  try {
    const parsedDirectGift = JSON.parse(storedDirectGift);
    if (
      parsedDirectGift &&
      typeof parsedDirectGift.id === 'string' &&
      typeof parsedDirectGift.displayName === 'string' &&
      typeof parsedDirectGift.type === 'string'
    ) {
      return parsedDirectGift;
    }
    clearStoredDirectGift();
    return null;
  } catch {
    clearStoredDirectGift();
    return null;
  }
};
