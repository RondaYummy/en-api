import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      // baseURL: '',
    });
  }

  async createChatCompletion(messages: Array<ChatCompletionMessageParam>) {
    try {
      // "Chat Completions API" (класичний):
      const response = await this.openai.chat.completions.create({
        model: 'o3-mini', // або gpt-3.5-turbo, gpt-4o...
        messages,
        // temperature: 0.7,   // "креативність" відповіді
        // max_tokens: 500,    // ліміт на к-сть токенів у відповіді
        // stream: false,      // для стрімінгової відповіді можна зробити true
      });

      return response.choices[0]?.message?.content;
    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        throw new Error(`OpenAI error: ${err.message}`);
      }
      throw err;
    }
  }

  async createResponse(input: string) {
    // "Responses API" (новіший підхід):
    const response = await this.openai.responses.create({
      model: 'o3-mini',
      instructions: 'You are a coding assistant that talks like a pirate',
      input,
    });

    return response.output_text;
  }

  determineLevelOfLanguage(selectedLang: string = 'English', skills: string = 'A1') {
    return `You are a skilled language proficiency assessor. Your goal is to determine the user’s approximate level in the language they are learning, based on the Common European Framework of Reference (CEFR) or a similar scale. 

1. First, greet the user briefly and explain that you will ask them several questions to assess their language level. 

2. Ask the user a series of questions about their learning background, vocabulary range, grammar knowledge, and comfort with various skills (reading, writing, speaking, listening). For instance:
   - How long have you been studying this language?
   - What kind of learning materials or methods do you use?
   - Can you describe a typical situation where you use this language? 
   - How confident are you speaking with native speakers?
   - Have you read or written any longer texts (like articles, stories, or essays)? If so, how challenging was it?

3. Ask the user to respond in the target language, so you can evaluate their grammar, vocabulary, and fluency in real-time. Encourage them to provide detailed answers. 

4. If appropriate, ask a few follow-up questions that gradually increase in difficulty or complexity to see how they handle more advanced language structures.

5. Based on their responses, provide an overall assessment of their language level, explaining whether they seem closer to A1, A2, B1, B2, C1, or C2 (or an equivalent scale), and give a brief rationale. If the user’s level seems intermediate between two official levels, suggest the closest match.

Please begin now by greeting the user and explaining the assessment process and ask the first question right away.
Selected language: ${selectedLang}.
Approximate level of language skills: ${skills}.`;
  }
}
