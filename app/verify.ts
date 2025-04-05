"use server";

import { VerificationLevel } from "@worldcoin/idkit-core";
import { verifyCloudProof } from "@worldcoin/idkit-core/backend";
import type { ISuccessResult } from "@worldcoin/idkit";

export type VerifyReply = {
  success: boolean;
  code?: string;
  attribute?: string | null;
  detail?: string;
};

// 未使用のため最小限に
export async function verify(result: any): Promise<VerifyReply> {
  return { success: true };
}