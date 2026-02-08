# Mock UPI Payment App

## Overview
A mobile-friendly payment application that simulates UPI-style transactions with automatic rewards system, SIM verification, and QR code payment functionality.

## Core Features

### Account Management
- Users can link their bank account by providing:
  - Bank account number
  - Mobile number
  - Bank selection from categorized dropdown menu containing comprehensive list of Indian banks organized by type:
    - **Nationalized Banks**: State Bank of India, Punjab National Bank, Bank of Baroda, Canara Bank, Union Bank of India, Indian Bank, Central Bank of India, Bank of India, Indian Overseas Bank, UCO Bank, Bank of Maharashtra, Punjab & Sind Bank
    - **Private Sector Banks**: HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, Yes Bank, IndusInd Bank, IDFC First Bank, Federal Bank, South Indian Bank, Karur Vysya Bank, City Union Bank, Dhanlaxmi Bank, Lakshmi Vilas Bank, Nainital Bank, RBL Bank, Tamilnad Mercantile Bank
    - **Small Finance Banks**: Equitas Small Finance Bank, Ujjivan Small Finance Bank, AU Small Finance Bank, Capital Small Finance Bank, Fincare Small Finance Bank, Jana Small Finance Bank, North East Small Finance Bank, Suryoday Small Finance Bank, Unity Small Finance Bank, ESAF Small Finance Bank
    - **Regional Rural Banks**: Andhra Pradesh Grameena Vikas Bank, Aryavart Bank, Assam Gramin Vikash Bank, Baroda Gujarat Gramin Bank, Bihar Gramin Bank, Chhattisgarh Rajya Gramin Bank, Dakshin Bihar Gramin Bank, Himachal Pradesh Gramin Bank, J&K Grameen Bank, Karnataka Gramin Bank, Kerala Gramin Bank, Madhya Pradesh Gramin Bank, Maharashtra Gramin Bank, Manipur Rural Bank, Meghalaya Rural Bank, Mizoram Rural Bank, Nagaland Rural Bank, Odisha Gramya Bank, Paschim Banga Gramin Bank, Puduvai Bharathiar Grama Bank, Punjab Gramin Bank, Rajasthan Marudhara Gramin Bank, Sarva Haryana Gramin Bank, Tamil Nadu Grama Bank, Telangana Grameena Bank, Tripura Gramin Bank, Utkal Grameen Bank, Uttar Bihar Gramin Bank, Uttarakhand Gramin Bank, Uttarbanga Kshetriya Gramin Bank, Vidharbha Konkan Gramin Bank
- Account linking includes simulated SIM verification:
  - App checks entered mobile number against mock device SIM number
  - Device SIM number is randomly assigned at login or stored locally
  - If numbers match, linking proceeds with success message "Device SIM verified successfully ✅"
  - If numbers don't match, shows error "SIM number mismatch – cannot link account"
- Account linking is simulated (no real bank integration)

### QR Code System
- **QR Code Generator**: Each user gets a unique payment QR code based on their mobile number
- **QR Code Scanner**: Users can scan another user's payment QR code to automatically fill in their mobile number for money transfers
- QR codes contain the mobile number information for payment processing
- Scanning integrates seamlessly with the existing send money workflow

### Payment Functionality
- Send money to other users using their mobile number (manual entry or QR scan)
- Receive money from other users
- QR scan-to-pay workflow automatically populates recipient mobile number in send money form
- All transactions are simulated (no real money transfer)
- Transaction amounts are entered manually by users

### Reward System
- Every completed transaction (send or receive) automatically credits ₹90 to both the sender and receiver
- Rewards are applied immediately after transaction completion
- QR code transactions receive the same reward system as manual transactions
- Both parties in a transaction receive ₹90 each as reward

### Balance & History
- Display current total balance
- Show transaction history with:
  - Transaction type (sent/received)
  - Amount
  - Recipient/sender mobile number
  - Timestamp
  - Reward amount (₹90 per transaction)

### User Interface
- Mobile-first responsive design
- Clean, modern UPI app-style interface
- Easy navigation between send money, receive money, QR scanner, QR generator, and balance screens
- Simple forms for transaction input
- ProfileSetupScreen includes SIM verification flow and categorized bank selection during account linking with grouped dropdown menu showing banks organized by type
- QR code display screen showing user's payment QR code
- QR scanner interface for scanning other users' payment codes
- Reward displays and transaction history show ₹90 per transaction

## Backend Data Storage
- User accounts with linked bank details, selected bank name, and mobile numbers
- User balances
- Transaction records including sender, receiver, amount, timestamp, and type
- Reward transaction records with ₹90 amounts
- QR code data associated with user mobile numbers
- Comprehensive categorized bank list with all Indian banks organized by type

## Backend Operations
- Create and manage user accounts with bank selection from comprehensive categorized list
- Provide categorized bank list with all Indian banks organized by type (Nationalized, Private Sector, Small Finance, Regional Rural)
- Generate QR code data for users based on mobile numbers
- Process simulated transactions between users (including QR-initiated transactions)
- Calculate and apply automatic ₹90 rewards to both sender and receiver
- Retrieve user balance and transaction history
- Validate user existence for money transfers
- Handle QR code-based payment requests
- Update balances with ₹90 reward amounts for both parties in each transaction
