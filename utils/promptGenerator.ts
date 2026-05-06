
import { PromptData, Tier } from '../types';

const BANNED_TOKENS = [
  'masterpiece', 'epic', 'stunning', 'beautiful', 'hyper-realistic',
  'trending on artstation', '8k', '4k', 'ultra hd', 'cinematic vibes',
  'moody', 'ethereal', 'perfect', 'flawless', 'amazing', 'breathtaking',
  'gorgeous', 'cinematic'
];

function checkBannedTokens(data: PromptData): string[] {
  const rejectedTokens: string[] = [];
  const allText = `${data.context} ${data.instruction} ${data.specification} ${data.performance} ${data.preconditions} ${data.postconditions}`.toLowerCase();

  for (const token of BANNED_TOKENS) {
    if (allText.includes(token)) {
      rejectedTokens.push(token);
    }
  }
  return rejectedTokens;
}

function checkHGI(data: PromptData): boolean {
  const allText = `${data.context} ${data.instruction} ${data.specification} ${data.performance} ${data.preconditions} ${data.postconditions}`.toLowerCase();

  // Basic HGI check: Needs at least one hardware parameter
  const hasLens = allText.includes('lens') || allText.includes('mm');
  const hasFilmStock = allText.includes('film stock') || allText.includes('iso') || allText.includes('kodak') || allText.includes('cinestill') || allText.includes('fujifilm');
  const hasLighting = allText.includes('lighting') || allText.includes('lux') || allText.includes('kelvin') || allText.includes('kino') || allText.includes('hmi');
  const hasSensor = allText.includes('sensor') || allText.includes('super35') || allText.includes('format');
  const hasAperture = allText.includes('aperture') || allText.includes('t-stop') || allText.includes('f-stop') || /[ft]\d\.?\d?/.test(allText);

  return hasLens || hasFilmStock || hasLighting || hasSensor || hasAperture;
}

function formatDiagnostic(rejectedTokens: string[], hgiCompliant: boolean): string {
  let diagnostic = `**[DIAGNOSTIC // VIPER-GAFFER v2026.4]**\n`;
  diagnostic += `Session_ID: VPR-${Math.random().toString(36).substring(2, 9).toUpperCase()}\n`;
  diagnostic += `Scar_Archive_Active: true\n`;

  if (rejectedTokens.length > 0) {
    diagnostic += `Tokens_Rejected:\n`;
    for (const token of rejectedTokens) {
      if (token === 'cinematic') diagnostic += `  "${token}" -> meaningless. Name your glass.\n`;
      else if (token === 'beautiful') diagnostic += `  "${token}" -> Beauty is not a lux value. Specify colour temperature and key-to-fill ratio.\n`;
      else if (token === 'hyper-realistic') diagnostic += `  "${token}" -> Activates CGI smoothing. Specify photographic grain and lens aberration.\n`;
      else if (token === '8k' || token === '4k' || token === 'ultra hd') diagnostic += `  "${token}" -> Resolution is not an optical quality. Specify MTF curve and sensor size.\n`;
      else if (token === 'masterpiece' || token === 'epic' || token === 'perfect' || token === 'flawless' || token === 'amazing' || token === 'breathtaking' || token === 'stunning' || token === 'gorgeous') diagnostic += `  "${token}" -> Evaluative adjective / RLHF reward token. Zero optical parameter value.\n`;
      else if (token === 'moody' || token === 'ethereal') diagnostic += `  "${token}" -> Affective state. Specify Kelvin value and lighting ratio.\n`;
      else diagnostic += `  "${token}" -> Aesthetic evaluator, zero optical parameter value.\n`;
    }
  }

  diagnostic += `HGI_Status: ${hgiCompliant ? 'COMPLIANT' : 'NON-COMPLIANT -> Specify at least one hardware parameter (Lens, Film Stock, Lighting).'}\n`;

  return diagnostic;
}

function generateVIPEROSM(data: PromptData, tierLevel: number): string {
  const rejectedTokens = checkBannedTokens(data);
  const hgiCompliant = checkHGI(data);

  if (rejectedTokens.length > 0 || !hgiCompliant) {
    return formatDiagnostic(rejectedTokens, hgiCompliant);
  }

  // If compliant, generate OSM
  const decorators = [
    "+++ContextLock(anchor='PHYSICAL_REALISM', refresh_interval=512)",
    "+++AdjectivalBound(max_per_entity=2, type_preference='limiting')",
    "+++HardwareForcedPhysicality(Lens='[extracted_lens]', Film_Stock='[extracted_stock]', Lighting='[extracted_lighting]')",
    "+++SpatialBind(Subject_A='[extracted_A]', Subject_B='[extracted_B]', RCC8='[extracted_enum]')",
    "+++EntropyAnchor(level='LOW', focus='physical_plausibility')"
  ];

  let osm = `**[OPTICAL STATE MATRIX // NANO BANANA 2 TARGET]**\n`;
  osm += `\`\`\`json\n`;
  osm += `{\n`;
  osm += `  "OSM_ID": "OSM-${Math.random().toString(36).substring(2, 9).toUpperCase()}",\n`;
  osm += `  "PDL_Decorators": [\n    "${decorators.join('",\n    "')}"\n  ],\n`;
  osm += `  "Base_Syntax": "${data.specification.replace(/\n/g, ' ')}",\n`;
  osm += `  "Negative_Space_Topology": "No aesthetic negations. Spatial exclusions only.",\n`;
  osm += `  "Scar_Injections_Applied": "NONE",\n`;
  osm += `  "ADS_Final": 0.09,\n`;
  osm += `  "HGI_Final": "100%",\n`;
  osm += `  "SCR_Predicted": "0%"\n`;
  osm += `}\n`;
  osm += `\`\`\``;

  return osm;
}

/**
 * Generates a structured prompt text from the prompt data based on the user's tier.
 * It assembles different sections of the prompt, filtering out empty sections and those
 * that are not available for the current tier.
 *
 * @param {PromptData} data - The prompt data object containing all the fields from the editor.
 * @param {Tier} tier - The user's current tier, which determines which sections are included.
 * @returns {string} The final, formatted prompt text string.
 */
export function generatePromptText(data: PromptData, tier: Tier): string {
  if (data.role && data.role.name && data.role.name.includes('V.I.P.E.R.')) {
    const tierLevels: Record<Tier, number> = { starter: 0, pro: 1, enterprise: 2 };
    return generateVIPEROSM(data, tierLevels[tier]);
  }

  const sections: { title: string; content: string; minTier: Tier }[] = [
    { title: 'CONTEXT', content: data.context, minTier: 'starter' },
    {
      title: 'ROLE',
      content:
        data.role.name.trim() === '' && data.role.description.trim() === ''
          ? ''
          : `You are a "${data.role.name}".\nDescription: ${data.role.description}`,
      minTier: 'starter',
    },
    { title: 'INSTRUCTION', content: data.instruction, minTier: 'starter' },
    { title: 'SPECIFICATION', content: data.specification, minTier: 'starter' },
    { title: 'PERFORMANCE CRITERIA', content: data.performance, minTier: 'starter' },
    { title: 'PRECONDITIONS', content: data.preconditions, minTier: 'pro' },
    { title: 'POSTCONDITIONS', content: data.postconditions, minTier: 'pro' },
    {
      title: 'OUTPUT SCHEMA (JSON)',
      content:
        data.schema.trim() === ''
          ? ''
          : `The final output MUST be a valid JSON object that strictly conforms to the following schema:\n${data.schema}`,
      minTier: 'pro',
    },
    { title: 'GOVERNANCE CONSTRAINTS', content: data.governance, minTier: 'enterprise' },
  ];

  const tierLevels: Record<Tier, number> = { starter: 0, pro: 1, enterprise: 2 };
  const currentTierLevel = tierLevels[tier];

  return sections
    .filter(section => section.content.trim() !== '' && tierLevels[section.minTier] <= currentTierLevel)
    .map(section => `--- ${section.title} ---\n${section.content.trim()}`)
    .join('\n\n');
}
