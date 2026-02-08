# Specification

## Summary
**Goal:** Update the profile bank-linking flow to require selecting a bank and completing OTP verification for the entered mobile number before saving.

**Planned changes:**
- Frontend: Replace SIM-number verification in Profile Setup with a bank selection + mobile OTP request/verify flow, and gate submission until OTP is successfully verified.
- Frontend: Ensure changing the mobile number resets any OTP challenge/verified state and re-disables the submit/continue action until re-verified.
- Backend: Add OTP challenge start + OTP verification APIs (simulated OTP for demo) and enforce OTP verification when saving the caller profile and linking a bank account.
- Frontend: Add React Query hooks/mutations for starting/verifying OTP, wire them into ProfileSetupScreen with loading, error, and retry handling, and show demo OTP without implying real SMS.

**User-visible outcome:** Users can select their bank, enter account number and mobile number, request and verify an OTP, and only then continue to save/link their profile; SIM-based checks are no longer shown.
