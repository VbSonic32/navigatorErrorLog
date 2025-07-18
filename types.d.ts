// Define the types for the JWT token cache
type TokenCache = {
  token: string | null;
  expiry: number | null;
};

// Toast notification types - these are kept for error messages
type ToastType = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

type ToastContextType = {
  showToast: (toast: ToastType) => void;
  hideToast: () => void;
  toast: ToastType | null;
};
