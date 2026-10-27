# AI Components (beta) custom agent HIL React sample

This sample shows how to create a custom agent with a human-in-the-loop (HIL) workflow for the `geoscene-assistant` component (beta) using React + TypeScript.

Human-in-the-loop provides an interrupt in an agentic workflow that prompts the human/user for additional information prior to proceeding. This is often used to safeguard against LLMs making decisions that lead to destructive actions. For example, you may use an interrupt to prompt the user to confirm whether to proceed with given parameters before executing a tool. The LLM may also not have confidence in a user's intent and could prompt them to provide more information in freeform text. You can also present deterministic options as a menu to the user before proceeding with a workflow.

📁 **[Click here to download this directory as a ZIP file](https://github/geoscene/jsapi-resources/zips/ai-components-custom-agent-hil-react.zip)** 📁 or run:

```bash
npx @geoscene/create -n my-geoscene-app -t "ai-components-custom-agent-hil-react (beta)"
```

See the [Get started with npm guide](https://doc.geoscene.cn/javascript/latest/get-started/#use-geoscenecreate) for full instructions and the [AI components (beta) reference](https://doc.geoscene.cn/javascript/latest/references/ai-components/) documentation for more information.

See the [Custom agents](https://doc.geoscene.cn/javascript/latest/agentic-apps/ai-custom-agents/) conceptual guide for more guidance on getting started with building a custom agent.

**AI components are currently in [beta](https://doc.geoscene.cn/javascript/latest/faq/#what-does-the-beta-tag-mean).** Due to the non-deterministic nature of generative AI, there may be inaccuracies or unexpected behavior when using the out-of-the-box agents. We are actively working on improving the accuracy and capabilities of the agents. During the beta period, we welcome your [feedback](https://doc.geoscene.cn/javascript/latest/faq/#how-can-i-provide-feedback-or-request-features-for-ai-components) to help us improve and shape the future of these capabilities.

This template shows how to build custom agents using the following third party dependencies:

- [LangGraph](https://docs.langchain.com/oss/javascript/langgraph/overview) (v1.1) is used to define the orchestration graph agents and tools, manages global state and LLM calls, and defines multi-step workflows
- [LangChainJS](https://docs.langchain.com/oss/javascript/langchain/overview) (v1.1) manages LLM and embeddings calls
- [Zod](https://zod.dev/) (v3) enforces structured outputs, schemas, and typing

> The JS Maps SDK provides [agent utilities](https://doc.geoscene.cn/javascript/latest/agentic-apps/ai-custom-agents/#agent-utilities) for building custom agents. We encourage developers to use these utilities when building custom agents. See the [AI Components (beta) agent utils HIL React sample](https://github.com/geoscene/jsapi-resources/tree/main/templates/ai-components-agent-utils-hil-react) for an example of how to build the app in this template with the agent utilities provided by the SDK.
