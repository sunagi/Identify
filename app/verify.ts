"use client";

import { VerificationLevel } from "@worldcoin/idkit-core";
import { verifyCloudProof } from "@worldcoin/idkit-core/backend";
import type { ISuccessResult } from "@worldcoin/idkit";

export type VerifyReply = {
  success: boolean;
  code?: string;
  attribute?: string | null;
  detail?: string;
};

const app_id = "app_staging_a9666c29d84c54d82dec4e5080b2c686";
const action = "test";

// ISuccessResultの型に問題があるため、anyを使用
export async function verify(result: any): Promise<VerifyReply> {
  try {
    console.log("Verifying WorldID proof:", result);
    
    // 固定のsignalを使用して検証
    const signal = "identifi-auth";
    
    // APIを使用して検証 (IDKitの型の問題を回避)
    const verifyRes = await verifyCloudProof(
      result.proof,
      app_id,
      action,
      signal
    );
    
    if (verifyRes.success) {
      return { success: true };
    } else {
      return { 
        success: false, 
        code: verifyRes.code, 
        attribute: verifyRes.attribute, 
        detail: verifyRes.detail 
      };
    }
  } catch (error) {
    console.error("WorldID verification error:", error);
    return { 
      success: false, 
      detail: error instanceof Error ? error.message : "Unknown error occurred during verification" 
    };
  }
}