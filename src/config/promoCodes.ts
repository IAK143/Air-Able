export interface PromoCode {
  code: string;
  credits: number;
  description: string;
  isActive: boolean;
}

// Add or modify promo codes here
export const PROMO_CODES: PromoCode[] = [
  // Welcome bonus code
  {
    code: "WELCOME50",
    credits: 50,
    description: "Welcome bonus - Get 50 air credits",
    isActive: true
  },
  // Special promotion code
  {
    code: "CLEANAIR100",
    credits: 100,
    description: "Special offer - Get 100 air credits",
    isActive: true
  },
  // First-time user code
  {
    code: "FIRST25",
    credits: 25,
    description: "First time user bonus - Get 25 air credits",
    isActive: true
  },
  // Example of a limited-time code (currently inactive)
  {
    code: "SUMMER2024",
    credits: 75,
    description: "Summer special - Get 75 air credits",
    isActive: false  // Set to false to disable this code
  },
  // Example of a referral code
  {
    code: "REFER25",
    credits: 25,
    description: "Refer a friend - Get 25 air credits",
    isActive: true
  }
];

// Function to validate and redeem a promo code
export const validateAndRedeemCode = (code: string): PromoCode | null => {
  const promoCode = PROMO_CODES.find(
    p => p.code.toUpperCase() === code.toUpperCase() && p.isActive
  );
  return promoCode || null;
};

/* 
HOW TO MANAGE PROMO CODES:

1. Adding a new code:
   - Copy an existing code object
   - Change the code, credits, and description
   - Set isActive to true/false as needed

2. Editing a code:
   - Find the code in the PROMO_CODES array
   - Modify any of its properties
   - Save the file

3. Disabling a code:
   - Set isActive to false
   - The code will remain in the list but won't be redeemable

4. Best practices:
   - Use uppercase for codes
   - Keep descriptions clear and concise
   - Use meaningful code names
   - Set reasonable credit amounts
   - Comment your codes for better organization
*/ 