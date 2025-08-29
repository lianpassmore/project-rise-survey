import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';

// Your existing Cultural Compliance Server class (modified)
class CulturalComplianceTools {
  constructor() {
    // Move your existing tikangaProtocols, ethicalCompass, and pasifikaFrameworks here
    this.tikangaProtocols = {
      // ... your existing protocols
    };
    
    this.ethicalCompass = {
      // ... your existing compass points
    };
    
    this.pasifikaFrameworks = {
      // ... your existing frameworks
    };
  }

  // Keep all your existing validation methods
  async validateTikangaCompliance(args) {
    // ... your existing implementation
  }

  async ethicalCompassCheck(args) {
    // ... your existing implementation
  }

  // ... other existing methods
}

const culturalTools = new CulturalComplianceTools();

const handler = createMcpHandler(
  (server) => {
    // Convert your existing tools to the mcp-handler format
    server.tool(
      'validate_tikanga_compliance',
      'Validate an action or decision against tikanga Māori protocols',
      {
        action: z.string().describe('The proposed action or decision'),
        context: z.string().describe('Cultural and situational context'),
        phase: z.enum(['planning', 'engagement', 'codesign', 'prototype', 'testing', 'analysis', 'return', 'closure']).describe('Current project phase'),
        stakeholders: z.array(z.string()).optional().describe('Affected community members/groups')
      },
      async (args) => {
        const result = await culturalTools.validateTikangaCompliance(args);
        return result;
      }
    );

    server.tool(
      'ethical_compass_check',
      'Evaluate decision through Kiri Dell\'s Ethical Compass framework',
      {
        decision: z.string().describe('The decision to evaluate'),
        compass_point: z.enum(['kei_raro', 'kei_mua', 'kei_runga', 'kei_roto', 'kei_waho']).optional().describe('Specific compass point to focus on'),
        community_context: z.string().describe('Relevant community context')
      },
      async (args) => {
        const result = await culturalTools.ethicalCompassCheck(args);
        return result;
      }
    );

    server.tool(
      'pasifika_framework_alignment',
      'Check alignment with Pasifika frameworks (Tafatolu, Fa\'afaletui)',
      {
        proposal: z.string().describe('Proposal or approach to evaluate'),
        framework: z.enum(['tafatolu', 'faafaletui', 'both']).describe('Which framework(s) to apply'),
        wellbeing_dimensions: z.array(z.string()).optional().describe('Relevant wellbeing dimensions')
      },
      async (args) => {
        const result = await culturalTools.pasifikaFrameworkAlignment(args);
        return result;
      }
    );

    server.tool(
      'cultural_risk_assessment',
      'Assess cultural risks and provide mitigation strategies',
      {
        activity: z.string().describe('Activity or process to assess'),
        risk_categories: z.array(z.string()).optional().describe('Categories of risk to evaluate'),
        mitigation_required: z.boolean().default(true).describe('Whether mitigation strategies are needed')
      },
      async (args) => {
        const result = await culturalTools.culturalRiskAssessment(args);
        return result;
      }
    );

    server.tool(
      'generate_reflexivity_prompt',
      'Generate culturally-informed reflexivity questions for weekly practice',
      {
        day: z.enum(['tuesday', 'wednesday', 'friday']).describe('Day of reflexivity cycle'),
        phase: z.string().describe('Current project phase'),
        recent_activities: z.array(z.string()).optional().describe('Recent project activities')
      },
      async (args) => {
        const result = await culturalTools.generateReflexivityPrompt(args);
        return result;
      }
    );

    server.tool(
      'reciprocity_tracker',
      'Track and suggest reciprocity measures for community engagement',
      {
        engagement_type: z.string().describe('Type of community engagement'),
        participants: z.array(z.string()).optional().describe('Participants involved'),
        value_extracted: z.string().describe('Value/knowledge gained from community'),
        reciprocity_preferences: z.array(z.string()).optional().describe('Community preferred forms of reciprocity')
      },
      async (args) => {
        const result = await culturalTools.reciprocityTracker(args);
        return result;
      }
    );

    // Add resources
    server.resource(
      'tikanga://protocols',
      'Tikanga Māori Protocols',
      'Complete tikanga protocols for True Review project',
      async () => ({
        contents: [{
          uri: 'tikanga://protocols',
          mimeType: 'application/json',
          text: JSON.stringify(culturalTools.tikangaProtocols, null, 2)
        }]
      })
    );

    server.resource(
      'compass://ethical-framework',
      'Kiri Dell Ethical Compass',
      'Ethical compass points and cultural lenses',
      async () => ({
        contents: [{
          uri: 'compass://ethical-framework',
          mimeType: 'application/json',
          text: JSON.stringify(culturalTools.ethicalCompass, null, 2)
        }]
      })
    );

    server.resource(
      'pasifika://frameworks',
      'Pasifika Cultural Frameworks',
      'Tafatolu and Fa\'afaletui frameworks',
      async () => ({
        contents: [{
          uri: 'pasifika://frameworks',
          mimeType: 'application/json',
          text: JSON.stringify(culturalTools.pasifikaFrameworks, null, 2)
        }]
      })
    );
  },
  {
    name: 'true-review-cultural-compliance',
    version: '1.0.0'
  },
  {
    basePath: '/api',
    maxDuration: 60,
    verboseLogs: true
  }
);

export { handler as GET, handler as POST, handler as DELETE };
