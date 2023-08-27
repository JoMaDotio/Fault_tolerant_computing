import './logger';
import logger from './logger';

// Example 1: using try-catch block, logger, and predefined value of error
export function divide(a: number, b: number): number {
    try {
        if (b === 0) {
            throw new Error("Zero division not allowed");
        }
        return a / b;
    } catch (error) {
        logger.error("Zero division performed")
        return NaN;
    }
}

// Example 2: Ussing a test library
export function add(a: number, b: number): number {
    logger.info(`Performing addition on values ${a} and ${b}`)
    return a + b;
} 