
import { executeTool } from '../src/lib/ai-tools';

async function testHelp() {
    console.log("Testing get_treasury_balance...");
    const balance = await executeTool('get_treasury_balance', {});
    console.log("Balance Result:", JSON.stringify(balance, null, 2));
}

testHelp();
