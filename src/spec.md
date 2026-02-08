# Specification

## Summary
**Goal:** Ensure Profile Setup requires bank selection and bank account details before allowing OTP request, and keep OTP state aligned with the latest entered bank/mobile details.

**Planned changes:**
- Update ProfileSetupScreen to require selecting a bank and entering bank account number (and mobile number) before enabling “Send OTP”.
- Add clear English error messaging if an OTP request is attempted without a selected bank (via any UI path).
- Reset/clear OTP requested/verified/code state when the selected bank or bank account number changes (in addition to existing mobile-number change behavior).
- Adjust OTP-step helper text to state the OTP is tied to the selected bank while remaining explicitly a demo OTP (no new integrations).

**User-visible outcome:** Users must select their bank and enter bank account number and mobile number before requesting an OTP; if they change bank/account details after requesting OTP, they must request a new OTP, and the OTP helper text clearly reflects the bank-tied (demo) behavior.
