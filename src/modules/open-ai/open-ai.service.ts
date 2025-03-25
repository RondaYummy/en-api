import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

interface Lesson {
  lessonHeader: string;
  title: string;
  description: string;
}

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      // baseURL: '',
    });
  }

  // async createChatCompletion(messages: Array<ChatCompletionMessageParam>) {
  //   try {
  //     // "Chat Completions API" (класичний):
  //     const response = await this.openai.chat.completions.create({
  //       model: 'o3-mini', // або gpt-3.5-turbo, gpt-4o...
  //       messages,
  //       // temperature: 0.7,   // "креативність" відповіді
  //       // max_tokens: 500,    // ліміт на к-сть токенів у відповіді
  //       // stream: false,      // для стрімінгової відповіді можна зробити true
  //     });

  //     return response.choices[0]?.message?.content;
  //   } catch (err) {
  //     if (err instanceof OpenAI.APIError) {
  //       throw new Error(`OpenAI error: ${err.message}`);
  //     }
  //     throw err;
  //   }
  // }

  // async createResponse(input: string) {
  //   // "Responses API" (новіший підхід):
  //   const response = await this.openai.responses.create({
  //     model: 'o3-mini',
  //     instructions: 'You are a coding assistant that talks like a pirate',
  //     input,
  //   });

  //   return response.output_text;
  // }

  //   determineLevelOfLanguage(selectedLang: string = 'English', skills: string = 'A1') {
  //     return `You are a skilled language proficiency assessor. Your goal is to determine the user's approximate level in the language they are learning, based on the Common European Framework of Reference (CEFR) or a similar scale. 

  // 1. First, greet the user briefly and explain that you will ask them several questions to assess their language level. 

  // 2. Ask the user a series of questions about their learning background, vocabulary range, grammar knowledge, and comfort with various skills (reading, writing, speaking, listening). For instance:
  //    - How long have you been studying this language?
  //    - What kind of learning materials or methods do you use?
  //    - Can you describe a typical situation where you use this language? 
  //    - How confident are you speaking with native speakers?
  //    - Have you read or written any longer texts (like articles, stories, or essays)? If so, how challenging was it?

  // 3. Ask the user to respond in the target language, so you can evaluate their grammar, vocabulary, and fluency in real-time. Encourage them to provide detailed answers. 

  // 4. If appropriate, ask a few follow-up questions that gradually increase in difficulty or complexity to see how they handle more advanced language structures.

  // 5. Based on their responses, provide an overall assessment of their language level, explaining whether they seem closer to A1, A2, B1, B2, C1, or C2 (or an equivalent scale), and give a brief rationale. If the user's level seems intermediate between two official levels, suggest the closest match.

  // Please begin now by greeting the user and explaining the assessment process and ask the first question right away.
  // Selected language: ${selectedLang}.
  // Approximate level of language skills: ${skills}.`;
  //   }

  async createCoursePlan(nativeLanguage: string, targetLanguage: string, months: number, lessonsPerWeek: number) {
    // Suppose that there are 4 weeks in a month
    const totalLessons = months * 4 * lessonsPerWeek;

    const prompt = `
You are an expert language course designer.
Create a detailed and structured course plan for a student whose native language is "${nativeLanguage}" and who wants to learn "${targetLanguage}".
The course should last for ${months} month(s) with ${lessonsPerWeek} lesson(s) per week, for a total of ${totalLessons} lessons.

The course plan must include:
- A brief course overview,
- A list of lessons with lesson numbers,
- For each lesson: a title and a short description of the objectives and key topics,
- A suggested schedule (e.g., week numbers or dates if applicable).

Ensure that the output is clear, structured, and in plain text format. Use headings and bullet points where appropriate.
    `;

    try {
      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: 'You are a helpful assistant specialized in designing language courses.' },
        { role: 'user', content: prompt }
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // або gpt-3.5-turbo, gpt-4
        messages,
      });

      const coursePlanText = response.choices[0]?.message?.content;
      if (!coursePlanText) {
        return;
      }
      console.log(coursePlanText, 'coursePlanText');
      const parsedCoursePlan = this.parseCoursePlan(coursePlanText);
      return parsedCoursePlan;
    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        throw new Error(`OpenAI error: ${err.message}`);
      }
      throw err;
    }
  }

  parseCoursePlan(coursePlanText: string): any {
    if (!coursePlanText) {
      return null;
    }
    const lessons: Lesson[] = [];
    let currentLesson: Lesson | null = null;
    // Розбиваємо текст на рядки
    const lines = coursePlanText.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      // Припустимо, що кожен урок починається з "Lesson" або "Лекція"
      if (/^(Lesson|Лекція)\s+\d+/.test(trimmedLine)) {
        if (currentLesson) {
          lessons.push(currentLesson);
        }
        // Наприклад: "Lesson 1: Greetings and Introductions"
        const parts = trimmedLine.split(':');
        const header = parts[0].trim(); // Lesson 1
        const title = parts[1] ? parts[1].trim() : '';
        currentLesson = { lessonHeader: header, title, description: '' };
      } else if (currentLesson) {
        // Додаємо рядки до опису уроку
        currentLesson.description += trimmedLine + ' ';
      }
    }
    if (currentLesson) {
      lessons.push(currentLesson);
    }
    return {
      rawText: coursePlanText,
      lessons,
    };
  }
}
