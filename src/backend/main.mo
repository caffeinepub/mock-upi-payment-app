import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";
import Nat "mo:core/Nat";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let transactionRecords = Map.empty<Principal, [TransactionRecord]>();
  let balances = Map.empty<Principal, Float>();
  let qrCodes = Map.empty<Text, QRCode>();
  let otpChallenges = Map.empty<Principal, OtpChallenge>();

  public type OtpChallenge = {
    mobileNumber : Text;
    otpCode : Nat;
    timestamp : Int;
    isVerified : Bool;
  };

  public type UserProfile = {
    bankAccountNumber : Text;
    mobileNumber : Text;
    selectedBank : Text;
  };

  public type Bank = {
    name : Text;
    code : Text;
  };

  public type BankCategory = {
    category : Text;
    totalInCategory : Int;
    banks : [Bank];
  };

  public type QRCode = {
    mobileNumber : Text;
    bank : Text;
  };

  public type TransactionType = {
    #sent;
    #received;
  };

  public type TransactionRecord = {
    transactionType : TransactionType;
    amount : Float;
    counterpartyMobile : Text;
    timestamp : Int;
    rewardAmount : Float;
  };

  module TransactionRecord {
    public func compareByAmount(record1 : TransactionRecord, record2 : TransactionRecord) : Order.Order {
      Float.compare(record1.amount, record2.amount);
    };

    public func compareByTimestamp(record1 : TransactionRecord, record2 : TransactionRecord) : Order.Order {
      Int.compare(record1.timestamp, record2.timestamp);
    };
  };

  public query func getCategorizedBankList() : async [BankCategory] {
    let categorized : [BankCategory] = [
      {
        category = "Nationalized Banks";
        totalInCategory = 12;
        banks = [
          { name = "State Bank of India"; code = "SBI" },
          { name = "Punjab National Bank"; code = "PNB" },
          { name = "Bank of Baroda"; code = "BOB" },
          { name = "Canara Bank"; code = "CANARA" },
          { name = "Union Bank of India"; code = "UNION" },
          { name = "Indian Bank"; code = "INDIAN" },
          { name = "Central Bank of India"; code = "CBI" },
          { name = "Bank of India"; code = "BOI" },
          { name = "Indian Overseas Bank"; code = "IOB" },
          { name = "UCO Bank"; code = "UCO" },
          { name = "Bank of Maharashtra"; code = "MAHARASHTRA" },
          { name = "Punjab & Sind Bank"; code = "PSB" },
        ];
      },
      {
        category = "Private Sector Banks";
        totalInCategory = 15;
        banks = [
          { name = "HDFC Bank"; code = "HDFC" },
          { name = "ICICI Bank"; code = "ICICI" },
          { name = "Axis Bank"; code = "AXIS" },
          { name = "Kotak Mahindra Bank"; code = "KOTAK" },
          { name = "Yes Bank"; code = "YESBANK" },
          { name = "IndusInd Bank"; code = "INDUSIND" },
          { name = "IDFC First Bank"; code = "IDFCFIRST" },
          { name = "Federal Bank"; code = "FEDERAL" },
          { name = "South Indian Bank"; code = "SIB" },
          { name = "Karur Vysya Bank"; code = "KVB" },
          { name = "City Union Bank"; code = "CUB" },
          { name = "Dhanlaxmi Bank"; code = "DHANLAXMI" },
          { name = "Lakshmi Vilas Bank"; code = "LVB" },
          { name = "Nainital Bank"; code = "NAINITAL" },
          { name = "Tamilnad Mercantile Bank"; code = "TMB" },
        ];
      },
      {
        category = "Small Finance Banks";
        totalInCategory = 10;
        banks = [
          { name = "Equitas Small Finance Bank"; code = "EQUITAS" },
          { name = "Ujjivan Small Finance Bank"; code = "UJJIVAN" },
          { name = "AU Small Finance Bank"; code = "AU" },
          { name = "Capital Small Finance Bank"; code = "CAPITAL" },
          { name = "Fincare Small Finance Bank"; code = "FINCARE" },
          { name = "Jana Small Finance Bank"; code = "JANA" },
          { name = "North East Small Finance Bank"; code = "NORTH_EAST" },
          { name = "Suryoday Small Finance Bank"; code = "SURYODAY" },
          { name = "Unity Small Finance Bank"; code = "UNITY" },
          { name = "ESAF Small Finance Bank"; code = "ESAF" },
        ];
      },
      {
        category = "Regional Rural Banks";
        totalInCategory = 31;
        banks = [
          { name = "Andhra Pradesh Grameena Vikas Bank"; code = "APGVB" },
          { name = "Aryavart Bank"; code = "ARYAVART" },
          { name = "Assam Gramin Vikash Bank"; code = "AGVB" },
          { name = "Baroda Gujarat Gramin Bank"; code = "BGGB" },
          { name = "Bihar Gramin Bank"; code = "BGB" },
          { name = "Chhattisgarh Rajya Gramin Bank"; code = "CRGB" },
          { name = "Dakshin Bihar Gramin Bank"; code = "DBGB" },
          { name = "Himachal Pradesh Gramin Bank"; code = "HPGB" },
          { name = "J&K Grameen Bank"; code = "JKGB" },
          { name = "Karnataka Gramin Bank"; code = "KGB" },
          { name = "Kerala Gramin Bank"; code = "KGB_KERALA" },
          { name = "Madhya Pradesh Gramin Bank"; code = "MPGB" },
          { name = "Maharashtra Gramin Bank"; code = "MHGB" },
          { name = "Manipur Rural Bank"; code = "MRB" },
          { name = "Meghalaya Rural Bank"; code = "MEGRB" },
          { name = "Mizoram Rural Bank"; code = "MRB_MIZORAM" },
          { name = "Nagaland Rural Bank"; code = "NRB" },
          { name = "Odisha Gramya Bank"; code = "OGB" },
          { name = "Paschim Banga Gramin Bank"; code = "PBGB" },
          { name = "Puduvai Bharathiar Grama Bank"; code = "PBGB_PUDUVAI" },
          { name = "Punjab Gramin Bank"; code = "PGB" },
          { name = "Rajasthan Marudhara Gramin Bank"; code = "RMGB" },
          { name = "RBL Bank"; code = "RBL" },
          { name = "Sarva Haryana Gramin Bank"; code = "SHGB" },
          { name = "Tamil Nadu Grama Bank"; code = "TNGB" },
          { name = "Telangana Grameena Bank"; code = "TGB" },
          { name = "Tripura Gramin Bank"; code = "TGB_TRIPURA" },
          { name = "Utkal Grameen Bank"; code = "UTKAL" },
          { name = "Uttar Bihar Gramin Bank"; code = "UBGB" },
          { name = "Uttarakhand Gramin Bank"; code = "UTRKGGB" },
          { name = "Uttarbanga Kshetriya Gramin Bank"; code = "UBKGB" },
          { name = "Vidharbha Konkan Gramin Bank"; code = "VKGB" },
        ];
      },
    ];
    categorized;
  };

  public shared ({ caller }) func startOtpChallenge(mobileNumber : Text, code : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request OTP challenges");
    };

    let challenge : OtpChallenge = {
      mobileNumber;
      otpCode = code;
      timestamp = Time.now();
      isVerified = false;
    };
    otpChallenges.add(caller, challenge);
  };

  public shared ({ caller }) func verifyOtp(enteredCode : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify OTP challenges");
    };

    switch (otpChallenges.get(caller)) {
      case (null) { Runtime.trap("OTP challenge not found") };
      case (?challenge) {
        if (challenge.otpCode != enteredCode) {
          Runtime.trap("Incorrect OTP code");
        };
        let verifiedChallenge = { challenge with isVerified = true };
        otpChallenges.add(caller, verifiedChallenge);
      };
    };
  };

  public query ({ caller }) func isMobileVerified(mobileNumber : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check mobile verification status");
    };

    switch (otpChallenges.get(caller)) {
      case (null) { false };
      case (?challenge) {
        challenge.mobileNumber == mobileNumber and challenge.isVerified;
      };
    };
  };

  func checkMobileVerifiedForAction(caller : Principal, mobileNumber : Text) {
    switch (otpChallenges.get(caller)) {
      case (null) { Runtime.trap("OTP challenge not found for this number") };
      case (?challenge) {
        if (challenge.mobileNumber != mobileNumber) {
          Runtime.trap("Incorrect mobile number for OTP challenge");
        };
        if (not challenge.isVerified) {
          Runtime.trap("Mobile number has not been verified with OTP");
        };
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    checkMobileVerifiedForAction(caller, profile.mobileNumber);

    userProfiles.add(caller, profile);
    switch (balances.get(caller)) {
      case (null) { balances.add(caller, 0.0) };
      case (?_) {};
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func linkBankAccount(bankAccountNumber : Text, mobileNumber : Text, selectedBank : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can link bank accounts");
    };

    checkMobileVerifiedForAction(caller, mobileNumber);

    let profile : UserProfile = {
      bankAccountNumber;
      mobileNumber;
      selectedBank;
    };
    userProfiles.add(caller, profile);

    switch (balances.get(caller)) {
      case (null) { balances.add(caller, 0.0) };
      case (?_) {};
    };

    let qrCode : QRCode = {
      mobileNumber;
      bank = selectedBank;
    };
    qrCodes.add(mobileNumber, qrCode);
  };

  public shared ({ caller }) func sendMoney(receiverMobile : Text, amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send money");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Sender not found. Please link your bank account.") };
      case (?senderProfile) {
        if (amount <= 0) { Runtime.trap("Invalid transaction amount") };

        let recipientEntry = userProfiles.entries().toArray().find(
          func((_, profile)) { profile.mobileNumber == receiverMobile }
        );

        let (recipientPrincipal, recipientProfile) = switch (recipientEntry) {
          case (null) { Runtime.trap("Recipient not found") };
          case (?entry) { entry };
        };

        let senderBalance = switch (balances.get(caller)) {
          case (null) { 0.0 };
          case (?balance) { balance };
        };

        if (amount > senderBalance) { Runtime.trap("Insufficient funds") };

        let rewardAmount = 90.0;

        let newSenderBalance = senderBalance - amount + rewardAmount;
        balances.add(caller, newSenderBalance);

        let senderRecord : TransactionRecord = {
          transactionType = #sent;
          amount;
          counterpartyMobile = receiverMobile;
          timestamp = Time.now();
          rewardAmount;
        };

        let senderTransactions = switch (transactionRecords.get(caller)) {
          case (null) { [] };
          case (?records) { records };
        };
        transactionRecords.add(caller, senderTransactions.concat([senderRecord]));

        let recipientBalance = switch (balances.get(recipientPrincipal)) {
          case (null) { 0.0 };
          case (?balance) { balance };
        };
        let newRecipientBalance = recipientBalance + amount + rewardAmount;
        balances.add(recipientPrincipal, newRecipientBalance);

        let recipientRecord : TransactionRecord = {
          transactionType = #received;
          amount;
          counterpartyMobile = senderProfile.mobileNumber;
          timestamp = Time.now();
          rewardAmount;
        };

        let recipientTransactions = switch (transactionRecords.get(recipientPrincipal)) {
          case (null) { [] };
          case (?records) { records };
        };
        transactionRecords.add(recipientPrincipal, recipientTransactions.concat([recipientRecord]));
      };
    };
  };

  public query ({ caller }) func getBalance() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };

    switch (balances.get(caller)) {
      case (null) { 0.0 };
      case (?balance) { balance };
    };
  };

  public query ({ caller }) func getBalanceByUser(user : Principal) : async Float {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own balance");
    };

    switch (balances.get(user)) {
      case (null) { 0.0 };
      case (?balance) { balance };
    };
  };

  public query ({ caller }) func getTransactionHistory() : async [TransactionRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transaction history");
    };

    let transactions : [TransactionRecord] = switch (transactionRecords.get(caller)) {
      case (null) { [] };
      case (?records) { records };
    };
    transactions.sort(TransactionRecord.compareByTimestamp);
  };

  public query ({ caller }) func getTransactionHistoryByUser(user : Principal) : async [TransactionRecord] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own transaction history");
    };

    let transactions : [TransactionRecord] = switch (transactionRecords.get(user)) {
      case (null) { [] };
      case (?records) { records };
    };
    transactions.sort(TransactionRecord.compareByTimestamp);
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };

    let profiles = userProfiles.values().toArray();
    profiles;
  };

  public query ({ caller }) func getQRCodeByMobile(mobileNumber : Text) : async ?QRCode {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access QR code data");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    if (callerProfile.mobileNumber != mobileNumber) {
      Runtime.trap("Unauthorized: Can only access your own QR code");
    };

    qrCodes.get(mobileNumber);
  };

  public query ({ caller }) func getCallerQRCode() : async ?QRCode {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access QR code data");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile };
    };

    qrCodes.get(callerProfile.mobileNumber);
  };

  public query ({ caller }) func getAllQRCodes() : async [QRCode] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all QR codes");
    };
    qrCodes.values().toArray();
  };
};
