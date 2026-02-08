import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Float "mo:core/Float";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, { bankAccountNumber : Text; mobileNumber : Text; selectedBank : Text }>;
    transactionRecords : Map.Map<Principal, [{ transactionType : { #sent; #received }; amount : Float; counterpartyMobile : Text; timestamp : Int; rewardAmount : Float }]>;
    balances : Map.Map<Principal, Float>;
    qrCodes : Map.Map<Text, { mobileNumber : Text; bank : Text }>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { bankAccountNumber : Text; mobileNumber : Text; selectedBank : Text }>;
    transactionRecords : Map.Map<Principal, [{ transactionType : { #sent; #received }; amount : Float; counterpartyMobile : Text; timestamp : Int; rewardAmount : Float }]>;
    balances : Map.Map<Principal, Float>;
    qrCodes : Map.Map<Text, { mobileNumber : Text; bank : Text }>;
    otpChallenges : Map.Map<Principal, {
      mobileNumber : Text;
      otpCode : Nat;
      timestamp : Int;
      isVerified : Bool;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    { old with otpChallenges = Map.empty<Principal, { mobileNumber : Text; otpCode : Nat; timestamp : Int; isVerified : Bool }>() };
  };
};
