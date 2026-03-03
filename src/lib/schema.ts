export const ANALYSIS_JSON_SCHEMA = {
  type: "object" as const,
  properties: {
    overallScore: {
      type: "number" as const,
      description: "Overall swing score from 1-100",
    },
    summary: {
      type: "string" as const,
      description: "2-3 sentence overall assessment of the swing",
    },
    phases: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          phase: {
            type: "string" as const,
            enum: [
              "address",
              "takeaway",
              "top",
              "transition",
              "mid-downswing",
              "impact",
              "follow-through",
              "finish",
            ],
          },
          score: { type: "number" as const },
          observations: {
            type: "array" as const,
            items: { type: "string" as const },
          },
          faults: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                description: { type: "string" as const },
                severity: {
                  type: "string" as const,
                  enum: ["minor", "moderate", "major"],
                },
                rootCause: { type: "string" as const },
                downstreamEffect: { type: "string" as const },
              },
              required: ["description", "severity", "rootCause", "downstreamEffect"] as const,
              additionalProperties: false,
            },
          },
        },
        required: ["phase", "score", "observations", "faults"] as const,
        additionalProperties: false,
      },
    },
    causeEffectChains: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          title: { type: "string" as const },
          nodes: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                phase: { type: "string" as const },
                observation: { type: "string" as const },
                type: {
                  type: "string" as const,
                  enum: ["fault", "cause", "effect"],
                },
              },
              required: ["phase", "observation", "type"] as const,
              additionalProperties: false,
            },
          },
          correction: { type: "string" as const },
        },
        required: ["title", "nodes", "correction"] as const,
        additionalProperties: false,
      },
    },
    improvements: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          name: { type: "string" as const },
          priority: { type: "number" as const, enum: [1, 2, 3] },
          targetFault: { type: "string" as const },
          description: { type: "string" as const },
          equipmentNeeded: { type: "string" as const },
          repetitions: { type: "string" as const },
          feelCue: { type: "string" as const },
        },
        required: [
          "name",
          "priority",
          "targetFault",
          "description",
          "equipmentNeeded",
          "repetitions",
          "feelCue",
        ] as const,
        additionalProperties: false,
      },
    },
  },
  required: ["overallScore", "summary", "phases", "causeEffectChains", "improvements"] as const,
  additionalProperties: false,
};
