// Modified: Feb 14, 2026 - Added onLogout to the navigation interface
export interface navigationProps {
  /*onNavigateToProductSummary?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToVerification?: (mobile: string) => void;
  
  // Add this line below
  onLogout?: () => void; 
  
  mobileNumber?: string; */
  onNavigateToProductSummary?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToVerification?: (mobile: string) => void;
  
  // Modified: Feb 14, 2026 - Added to fix RequestSummary navigation error
  onNavigateToProduct?: () => void; 

  // Modified: Feb 14, 2026 - Added to support logout functionality
  onLogout?: () => void;
  mobileNumber?: string;
}