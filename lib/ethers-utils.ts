import { utils, constants } from 'ethers';

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
    return utils.formatUnits(value, decimals);
  } catch (error) {
    console.error("Error formatting units:", error)
    return "0"
  }
}

// Helper function to format ether safely
export const formatEther = (value: any): string => {
  try {
    return utils.formatEther(value);
  } catch (error) {
    console.error("Error formatting ether:", error)
    return "0"
  }
}

// Helper function to parse units safely
export const parseUnits = (value: string, decimals: number): any => {
  try {
    return utils.parseUnits(value, decimals);
  } catch (error) {
    console.error("Error parsing units:", error)
    return "0"
  }
}

// Helper function to parse ether safely
export const parseEther = (value: string): any => {
  try {
    return utils.parseEther(value);
  } catch (error) {
    console.error("Error parsing ether:", error)
    return "0"
  }
}

// Constants
export const MaxUint256 = () => {
  return constants.MaxUint256;
} 