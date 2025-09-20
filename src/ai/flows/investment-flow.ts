'use server';
/**
 * @fileOverview Investment-related AI flows.
 *
 * - listInvestments - A function to list available investments.
 * - ListInvestmentsInput - The input type for the listInvestments function.
 * - ListInvestmentsOutput - The return type for the listInvestments function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { INVESTMENT_OPPORTUNITIES } from '@/lib/data';
import type { Investment } from '@/lib/types';

// The input can be extended with filtering/pagination options later.
const ListInvestmentsInputSchema = z.object({});
export type ListInvestmentsInput = z.infer<typeof ListInvestmentsInputSchema>;

const InvestmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  sector: z.enum(['Agriculture', 'Technology', 'Real Estate', 'Finance', 'Other']),
  country: z.string(),
  city: z.string(),
  description: z.string(),
  minInvestment: z.number(),
  expectedReturn: z.string(),
  imageId: z.string(),
});

const ListInvestmentsOutputSchema = z.object({
    investments: z.array(InvestmentSchema)
});
export type ListInvestmentsOutput = z.infer<typeof ListInvestmentsOutputSchema>;

export async function listInvestments(input: ListInvestmentsInput): Promise<ListInvestmentsOutput> {
  return listInvestmentsFlow(input);
}

const listInvestmentsFlow = ai.defineFlow(
  {
    name: 'listInvestmentsFlow',
    inputSchema: ListInvestmentsInputSchema,
    outputSchema: ListInvestmentsOutputSchema,
  },
  async (input) => {
    //
    // IMPORTANT: This is a mock implementation.
    // In a production environment, you would:
    // 1. Get the authenticated user's ID from the auth context.
    // 2. Use the Firebase Admin SDK to connect to Firestore.
    // 3. Query the 'investments' collection, applying any filters from the input.
    // 4. Return the list of investments.
    //
    console.log("Fetching list of investment opportunities.");

    // For now, just return the mock data.
    return { investments: INVESTMENT_OPPORTUNITIES };
  }
);
