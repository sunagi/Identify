import * as ethers from "ethers"

/**
 * Interface to help with type checking for ethers v5 utils
 */
interface EthersV5Utils {
  formatUnits: (value: any, decimals: number) => string;
  formatEther: (value: any) => string;
  parseUnits: (value: string, decimals: number) => any;
  parseEther: (value: string) => any;
}

/**
 * Interface to help with type checking for ethers v5 constants
 */
interface EthersV5Constants {
  MaxUint256: any;
}

// Type guard for checking if ethers has utils (v5 style)
function hasV5Utils(ethers: any): ethers is { utils: EthersV5Utils } {
  return ethers && typeof ethers.utils === 'object' && ethers.utils !== null;
}

// Type guard for checking if ethers has constants (v5 style)
function hasV5Constants(ethers: any): ethers is { constants: EthersV5Constants } {
  return ethers && typeof ethers.constants === 'object' && ethers.constants !== null;
}

// Helper function to format units safely
export const formatUnits = (value: any, decimals: number): string => {
  try {
    // Try ethers v6 format
    if (typeof (ethers as any).formatUnits === "function") {
      return (ethers as any).formatUnits(value, decimals)
    }
    // Fall back to ethers v5 format
    if (hasV5Utils(ethers) && typeof ethers.utils.formatUnits === "function") {
      return ethers.utils.formatUnits(value, decimals)
    }
    // Manual fallback
    return (Number(value) / Math.pow(10, decimals)).toString()
  } catch (error) {
    console.error("Error formatting units:", error)
    return "0"
  }
}

// Helper function to format ether safely
export const formatEther = (value: any): string => {
  try {
    // Try ethers v6 format
    if (typeof (ethers as any).formatEther === "function") {
      return (ethers as any).formatEther(value)
    }
    // Fall back to ethers v5 format
    if (hasV5Utils(ethers) && typeof ethers.utils.formatEther === "function") {
      return ethers.utils.formatEther(value)
    }
    // Manual fallback
    return (Number(value) / 1e18).toString()
  } catch (error) {
    console.error("Error formatting ether:", error)
    return "0"
  }
}

// Helper function to parse units safely
export const parseUnits = (value: string, decimals: number): any => {
  try {
    // Try ethers v6 format
    if (typeof (ethers as any).parseUnits === "function") {
      return (ethers as any).parseUnits(value, decimals)
    }
    // Fall back to ethers v5 format
    if (hasV5Utils(ethers) && typeof ethers.utils.parseUnits === "function") {
      return ethers.utils.parseUnits(value, decimals)
    }
    // Manual fallback
    return (Number(value) * Math.pow(10, decimals)).toString()
  } catch (error) {
    console.error("Error parsing units:", error)
    return "0"
  }
}

// Helper function to parse ether safely
export const parseEther = (value: string): any => {
  try {
    // Try ethers v6 format
    if (typeof (ethers as any).parseEther === "function") {
      return (ethers as any).parseEther(value)
    }
    // Fall back to ethers v5 format
    if (hasV5Utils(ethers) && typeof ethers.utils.parseEther === "function") {
      return ethers.utils.parseEther(value)
    }
    // Manual fallback
    return (Number(value) * 1e18).toString()
  } catch (error) {
    console.error("Error parsing ether:", error)
    return "0"
  }
}

// Constants
export const MaxUint256 = () => {
  // Try ethers v6 constants
  if ((ethers as any).MaxUint256) {
    return (ethers as any).MaxUint256
  }
  // Try ethers v5 constants
  if (hasV5Constants(ethers) && ethers.constants.MaxUint256) {
    return ethers.constants.MaxUint256
  }
  // Fallback: manually define MaxUint256
  return '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
} 