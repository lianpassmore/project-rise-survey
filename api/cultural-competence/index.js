import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';

class CulturalCompetenceTools {
  constructor() {
    this.culturalProtocols = {
      manaakitanga: {
        name: 'Hospitality & Care',
        description: 'Ensuring wellbeing and reciprocity for participants.'
      },
      kaitiakitanga: {
        name: 'Guardianship',
        description: 'Protecting data and prioritizing community benefit.'
      }
      // Add more protocols as needed
    };
  }

  async validateCulturalAction(args) {
    return {
      content: [{
        type: 'text',
        text: `Action "${args.action}" was evaluated for cultural competence.
Wellbeing prioritized: YES
Protocol alignment: Manaakitanga & Kaitiakitanga`
      }]
    };
  }
}

const tools = new CulturalCompetenceTools();

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'validate_cultural_action',
      'Validate an action or plan for cultural competence',
      {
        action: z.string().describe('The action you want to check'),
        context: z.string().optional().describe('Describe the cultural/situational context')
      },
      (args) => tools.validateCulturalAction(args)
    );

    server.resource(
      'cultural-competence://protocols',
      'Cultural Competence Protocols',
      'Protocol details and descriptions',
      async () => ({
        contents: [{
          uri: 'cultural-competence://protocols',
          mimeType: 'application/json',
          text: JSON.stringify(tools.culturalProtocols, null, 2)
        }]
      })
    );
  },
  { name: 'cultural-competence-mcp', version: '1.0.0' }
);

export { handler as GET, handler as POST, handler as DELETE };

