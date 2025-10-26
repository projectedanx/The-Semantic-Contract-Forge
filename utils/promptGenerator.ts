
import { PromptData, Tier } from '../types';

export function generatePromptText(data: PromptData, tier: Tier): string {
  const sections: { title: string; content: string; minTier: Tier }[] = [
    { title: 'CONTEXT', content: data.context, minTier: 'starter' },
    { title: 'ROLE', content: `You are a "${data.role.name}".\nDescription: ${data.role.description}`, minTier: 'starter' },
    { title: 'INSTRUCTION', content: data.instruction, minTier: 'starter' },
    { title: 'SPECIFICATION', content: data.specification, minTier: 'starter' },
    { title: 'PERFORMANCE CRITERIA', content: data.performance, minTier: 'starter' },
    { title: 'PRECONDITIONS', content: data.preconditions, minTier: 'pro' },
    { title: 'POSTCONDITIONS', content: data.postconditions, minTier: 'pro' },
    { title: 'OUTPUT SCHEMA (JSON)', content: `The final output MUST be a valid JSON object that strictly conforms to the following schema:\n${data.schema}`, minTier: 'pro' },
    { title: 'GOVERNANCE CONSTRAINTS', content: data.governance, minTier: 'enterprise' },
  ];

  const tierLevels: Record<Tier, number> = { starter: 0, pro: 1, enterprise: 2 };
  const currentTierLevel = tierLevels[tier];

  return sections
    .filter(section => section.content.trim() !== '' && tierLevels[section.minTier] <= currentTierLevel)
    .map(section => `--- ${section.title} ---\n${section.content.trim()}`)
    .join('\n\n');
}
