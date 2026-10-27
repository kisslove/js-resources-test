import { FunctionAgent } from "@geoscene/ai-components/agent-utils/FunctionAgent.js";
import { LLMAgent } from "@geoscene/ai-components/agent-utils/LLMAgent.js";
import { WorkflowAgent } from "@geoscene/ai-components/agent-utils/WorkflowAgent.js";
import { SequentialWorkflow } from "@geoscene/ai-components/agent-utils/workflows/SequentialWorkflow.js";
import {
  createHumanInTheLoopMiddleware,
  getHumanInTheLoopPayload,
} from "@geoscene/ai-components/agent-utils/middlewares/humanInTheLoop.js";
import type { AgentRegistration } from "@geoscene/ai-components/utils/index.js";
import type { FunctionAgentExecute } from "@geoscene/ai-components/agent-utils/FunctionAgent.js";
import z from "zod";
import FeatureLayer from "@geoscene/core/layers/FeatureLayer.js";
import Graphic from "@geoscene/core/Graphic.js";
import Point from "@geoscene/core/geometry/Point.js";
import type { GeoSceneMap } from "@geoscene/map-components/components/geoscene-map";

interface ServiceMaintenanceTicket {
  category: "Blockage" | "Cracks" | "Debris" | "Erosion" | "Faded Paint" | "Other" | "Pothole";
  address: string;
  notes: string;
  severity: "Critical" | "High" | "Low" | "Moderate";
  CreationDate?: Date;
}

type ServiceMaintenanceContext = {
  mapElement: GeoSceneMap;
};

type MaintenanceWorkflowState = {
  ticket?: ServiceMaintenanceTicket | null;
};

const serviceMaintenanceIncidentPrompt = String.raw`
你是城市公共工程部门中负责登记道路养护问题的助手。

请从用户的消息中提取以下内容：
- "category"：必须是以下类别之一："Pothole"、"Cracks"、"Faded Paint"、"Debris"、"Erosion"、"Blockage" 或 "Other"。如果无法确定类别，请使用 "Other"。
- "notes"：关于该问题的任何补充细节，可能对市政工作人员有帮助。
- "severity"：问题的严重程度，取值为 "Low"、"Moderate"、"High" 或 "Critical"。如果无法确定严重程度，默认使用 "Moderate"。
- "address"：位置或地址，写成一行文本（例如 "380 New York St, Redlands"）。

如果用户提供的是地标名称或不完整的地址，请尽可能将其规范化为一行文本。
如果确实无法找到地址，请将 "address" 设为 "unknown"。
`;

const maintenanceTicketSchema = z.object({
  category: z.enum(["Pothole", "Cracks", "Faded Paint", "Debris", "Erosion", "Blockage", "Other"]),
  notes: z
    .string()
    .describe("未在其他字段中体现的养护问题补充细节")
    .max(250),
  severity: z.enum(["Low", "Moderate", "High", "Critical"]),
  address: z.string(),
});

const extractMaintenanceOutputSchema = z.object({
  ticket: maintenanceTicketSchema.nullable(),
});

const approvalMaintenanceOutputSchema = z.object({
  ticket: maintenanceTicketSchema.nullable(),
});

const persistMaintenanceInputSchema = z.object({
  ticket: maintenanceTicketSchema.nullable(),
});

const extractMaintenanceAgent = new LLMAgent<MaintenanceWorkflowState, { ticket: ServiceMaintenanceTicket | null }>({
  name: "提取养护事件",
  description: "从用户请求中提取养护类别、备注、严重程度和地址。",
  prompt: serviceMaintenanceIncidentPrompt,
  modelTier: "default",
  outputSchema: extractMaintenanceOutputSchema,
});

const approvalMaintenanceExecute: FunctionAgentExecute<
  MaintenanceWorkflowState,
  { ticket: ServiceMaintenanceTicket | null }
> = (state, config) => {
  const ticket = state.ticket ?? null;

  if (!ticket) {
    return {
      ticket: null,
    };
  }

  const response = getHumanInTheLoopPayload<string>(config);

  const approved = response === "是";

  if (!approved) {
    return {
      ticket: null,
    };
  }

  return {
    ticket: {
      ...ticket,
      CreationDate: ticket.CreationDate ?? new Date(),
    },
  };
};

const approvalMaintenanceAgent = new FunctionAgent<
  MaintenanceWorkflowState,
  { ticket: ServiceMaintenanceTicket | null }
>({
  name: "审批养护事件",
  description: "在登记养护事件之前，请求用户明确确认。",
  execute: approvalMaintenanceExecute,
  outputSchema: approvalMaintenanceOutputSchema,
  middlewares: [
    createHumanInTheLoopMiddleware<MaintenanceWorkflowState>({
      interrupt: async ({ state, agentId }) => {
        const ticket = state.ticket as ServiceMaintenanceTicket | null | undefined;

        if (!ticket) {
          return {
            kind: "singleSelection",
            message: "无法根据该消息创建养护工单。请描述问题并提供地址。",
            metadata: ["好的"],
          };
        }

        const userFriendlyTime = (ticket.CreationDate ?? new Date()).toLocaleString();
        const confirmationMessage = [
          "我已准备好以下养护报告：",
          "",
          `- 类别：${ticket.category}`,
          `- 备注：${ticket.notes}`,
          `- 严重程度：${ticket.severity}`,
          `- 地址：${ticket.address}`,
          `- 上报时间：${userFriendlyTime}`,
          "",
          "确定要继续吗？",
        ].join("\n");

        return {
          agentId,
          kind: "singleSelection",
          message: confirmationMessage,
          metadata: ["是", "否", "稍后"],
        };
      },
    }),
  ],
});

async function saveMaintenanceTicketToDb(
  ticket: ServiceMaintenanceTicket,
  layer: FeatureLayer,
  location: Point,
): Promise<void> {
  const reportedAtEpoch = ticket.CreationDate instanceof Date ? ticket.CreationDate.getTime() : Date.now();

  const features = [
    new Graphic({
      geometry: location,
      attributes: {
        category: ticket.category,
        notes: ticket.notes,
        severity: ticket.severity,
        address: ticket.address,
        ReportedAt: reportedAtEpoch,
      },
    }),
  ];

  await layer.load();

  const editsResults = await layer.applyEdits({
    addFeatures: features,
  });

  layer.refresh();

  if (!editsResults?.addFeatureResults?.length) {
    throw new Error("无法将养护工单添加到数据库。");
  }
}

const persistMaintenanceExecute: FunctionAgentExecute<MaintenanceWorkflowState, Record<string, never>> = async (
  state,
  config,
) => {
  const ticket = (state.ticket as ServiceMaintenanceTicket | null | undefined) ?? null;

  if (!ticket) {
    return "无法根据该消息创建养护工单。请描述问题并提供地址。";
  }

  const context = config?.configurable?.context as ServiceMaintenanceContext | undefined;
  if (!context?.mapElement) {
    throw new Error("可配置上下文（configurable context）中需要包含带有 mapElement 的养护上下文");
  }

  const layer = context.mapElement.map?.layers.find((item) => item.title === "Maintenance issues");

  if (!layer) {
    throw new Error("地图上未找到 Maintenance issues（养护问题）图层");
  }

  await saveMaintenanceTicketToDb(ticket, layer, context.mapElement.center);

  const humanReadableTime = (ticket.CreationDate ?? new Date()).toLocaleString();

  context.mapElement.graphics.removeAll();

  return [
    "感谢，我已登记您的养护报告：",
    "",
    `- 类别：${ticket.category}`,
    `- 备注：${ticket.notes}`,
    `- 严重程度：${ticket.severity}`,
    `- 地址：${ticket.address}`,
    `- 上报时间：${humanReadableTime}`,
  ].join("\n");
};

const persistMaintenanceAgent = new FunctionAgent<MaintenanceWorkflowState, Record<string, never>>({
  name: "养护事件登记器",
  description: "将已确认的养护事件写入 Maintenance issues（养护问题）图层。",
  inputSchema: persistMaintenanceInputSchema,
  execute: persistMaintenanceExecute,
});

const maintenanceWorkflow = new SequentialWorkflow<MaintenanceWorkflowState>({
  agents: [extractMaintenanceAgent, approvalMaintenanceAgent, persistMaintenanceAgent],
});

const ServiceMaintenanceAgentDescription = String.raw`- **养护（Maintenance）** — 用户想要上报街道养护问题，例如坑洞、褪色标线、杂物、侵蚀、堵塞或其他隐患。助手应从用户消息中提取问题类别、严重程度、备注和地址，然后在登记该问题之前请求用户确认。

  该智能体会从用户请求中提取问题类别、严重程度、备注和地址，使用当前时间为其添加时间戳，并将养护工单写入数据库。
  _示例："我在 Redlands 市 New York 街 380 号看到一个坑洞"_
  → 类别（Category）："Pothole"
  → 备注（Notes）："街道中间有一个大坑洞"
  → 严重程度（Severity）："Moderate"
  → 地址（Address）："380 New York St, Redlands, CA"
  → 上报时间：[智能体运行时的当前时间]。`;

const maintenanceWorkflowAgent = new WorkflowAgent<MaintenanceWorkflowState>({
  name: "养护服务智能体",
  description: ServiceMaintenanceAgentDescription,
  workflow: maintenanceWorkflow,
});

const ServiceMaintenanceAgent: AgentRegistration = maintenanceWorkflowAgent.registration;

export { ServiceMaintenanceAgent };
