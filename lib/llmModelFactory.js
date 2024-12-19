import {openAi} from "./llm_providers/openai"

export default class llmModelFactory {
  constructor(modelName) {
    const CLIENT_MAP = {
      "gpt-3.5-turbo": openAiClient
    }
    // throw new Error(`Unsupported LLM model: ${modelName}`);
    this.ai_provider_client = CLIENT_MAP[modelName];
    this.model = modelName;
  }

  async createChat(messages = null) {
    return this.ai_provider_client.createChatCompletion(this.model, messages);
  }
}

class openAiClient {
  static async createChatCompletion(model, messages) {
    const response = await openAi.chat.completions.create({
      model,
      messages
    });
    return response.choices[0].message.content;
  }
}
