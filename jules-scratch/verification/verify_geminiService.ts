import { validatePromptOutput, generateRole } from '../../services/geminiService.ts';
import { PromptData } from '../../types.ts';

const mockPromptData: PromptData = {
    context: 'test context',
    role: { name: 'test role', description: 'test description' },
    instruction: 'test instruction',
    specification: 'test specification',
    performance: 'test performance',
    preconditions: 'test pre',
    postconditions: 'test post',
    schema: '{ invalid json }',
    governance: 'test gov'
};

async function runTest() {
    try {
        await validatePromptOutput(mockPromptData, 'pro', 'dummy_key');
        console.error("Test failed: expected an error");
    } catch (e) {
        if (e.message.includes('Invalid JSON')) {
            console.log("validatePromptOutput correctly rejected invalid JSON");
        } else {
            console.error("Test failed with unexpected error:", e.message);
        }
    }
}

runTest();
