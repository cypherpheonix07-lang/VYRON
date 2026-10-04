export * from "./src/pipeline/state";
export * from "./src/pipeline/pipeline";
export * from "./src/streaming/sse.service";
export * from "./src/server";

export const Layer24Manifest = {
  id: "24",
  name: "24 — COPILOT ORCHESTRATOR",
  stages: 26,
  pipelineStages: [
    "24A_Request_Ingestion",
    "24B_Identity_Resolution",
    "24C_Session_Resolution",
    "24D_Intent_Classification",
    "24E_Query_Decomposition",
    "24F_Complexity_Estimation",
    "24G_Context_Discovery",
    "24H_Memory_Retrieval",
    "24I_Permission_Validation",
    "24J_Knowledge_Retrieval",
    "24K_Source_Ranking",
    "24L_Tool_Selection",
    "24M_Model_Selection",
    "24N_Planning",
    "24O_Parallel_Execution",
    "24P_Agent_Delegation",
    "24Q_Tool_Execution",
    "24R_Evidence_Validation",
    "24S_Hallucination_Detection",
    "24T_Response_Synthesis",
    "24U_Citation_Generation",
    "24V_Safety_Validation",
    "24W_Latency_Optimization",
    "24X_Output_Streaming",
    "24Y_Telemetry_Capture",
    "24Z_Memory_Update_Decision",
  ],
  status: "ACTIVE",
};
