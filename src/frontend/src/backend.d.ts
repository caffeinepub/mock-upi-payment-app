import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BankCategory {
    category: string;
    banks: Array<Bank>;
    totalInCategory: bigint;
}
export interface QRCode {
    bank: string;
    mobileNumber: string;
}
export interface Bank {
    code: string;
    name: string;
}
export interface UserProfile {
    bankAccountNumber: string;
    mobileNumber: string;
    selectedBank: string;
}
export interface TransactionRecord {
    transactionType: TransactionType;
    rewardAmount: number;
    timestamp: bigint;
    counterpartyMobile: string;
    amount: number;
}
export enum TransactionType {
    sent = "sent",
    received = "received"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllQRCodes(): Promise<Array<QRCode>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getBalance(): Promise<number>;
    getBalanceByUser(user: Principal): Promise<number>;
    getCallerQRCode(): Promise<QRCode | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategorizedBankList(): Promise<Array<BankCategory>>;
    getQRCodeByMobile(mobileNumber: string): Promise<QRCode | null>;
    getTransactionHistory(): Promise<Array<TransactionRecord>>;
    getTransactionHistoryByUser(user: Principal): Promise<Array<TransactionRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isMobileVerified(mobileNumber: string): Promise<boolean>;
    linkBankAccount(bankAccountNumber: string, mobileNumber: string, selectedBank: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMoney(receiverMobile: string, amount: number): Promise<void>;
    startOtpChallenge(mobileNumber: string, code: bigint): Promise<void>;
    verifyOtp(enteredCode: bigint): Promise<void>;
}
