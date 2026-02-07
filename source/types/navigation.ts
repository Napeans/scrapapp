export interface navigationProps {
  mobileNumber?: string;
  onNavigateToLogin?: () => void;
  onNavigateToVerification?: (mobile: string) => void;
  onNavigateToHome?: () => void;
  onNavigateToProduct?: () => void;
  onNavigateToProductSummary?: () => void;
}
