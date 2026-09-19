import OpenAI from "openai";

export class OpenAIOperations {
    constructor(file_context, openai_key, model_name, history_length) {
        this.messages = [
            {
                role: "system",
                content: file_context
            }
        ];

        this.openai = new OpenAI({
    apiKey: openai_key,
    baseURL: "https://api.groq.com/openai/v1"
});

        this.model_name = model_name;
        this.history_length = Number(history_length) || 5;
    }

    check_history_length() {
        if (this.messages.length > (this.history_length * 2 + 1)) {
            this.messages.splice(1, 2);
        }
    }

    async make_openai_call(text) {
        try {
            this.messages.push({
                role: "user",
                content: text
            });

            this.check_history_length();

            const response = await this.openai.chat.completions.create({
                model: this.model_name,
                messages: this.messages,
                max_completion_tokens: 256
            });

            const agent_response = response.choices?.[0]?.message?.content;

            if (!agent_response) {
                throw new Error("OpenAI returned an empty response");
            }

            this.messages.push({
                role: "assistant",
                content: agent_response
            });

            console.log("Agent Response:", agent_response);

            return agent_response;

        } catch (error) {
            console.error("OpenAI ERROR:", {
                status: error?.status,
                code: error?.code,
                type: error?.type,
                message: error?.message
            });

            return "Sorry, something went wrong. Please try again later.";
        }
    }

    async make_openai_call_completion(text) {
        try {
            const response = await this.openai.chat.completions.create({
                model: this.model_name,
                messages: [
                    {
                        role: "user",
                        content: text
                    }
                ],
                max_completion_tokens: 256
            });

            const agent_response = response.choices?.[0]?.message?.content;

            if (!agent_response) {
                throw new Error("OpenAI returned an empty response");
            }

            console.log("Agent Response:", agent_response);

            return agent_response;

        } catch (error) {
            console.error("OpenAI ERROR:", {
                status: error?.status,
                code: error?.code,
                type: error?.type,
                message: error?.message
            });

            return "Sorry, something went wrong. Please try again later.";
        }
    }
}
