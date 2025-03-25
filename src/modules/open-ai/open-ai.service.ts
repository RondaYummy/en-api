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

  async createCoursePlan(
    nativeLanguage: string,
    targetLanguage: string,
    months: number,
    available_days: number[],
    level: string,
  ) {
    const lessonsPerWeek = available_days.length;
    const totalLessons = months * 4 * lessonsPerWeek;

    const prompt = `
You are an expert language course designer.
Design a fully detailed and interactive language course for a student whose native language is "${nativeLanguage}" and who wants to learn "${targetLanguage}". 
The course should last for ${months} month(s) with ${lessonsPerWeek} lesson(s) per week, for a total of ${totalLessons} lessons.

For each lesson, provide:
- A clear lesson title and lesson number.
- A detailed lesson plan that explains what the student will learn and what interactive tasks they should perform. Include all necessary content (e.g., a dialogue to read, text to analyze, or instructions for a recording) so that the student can complete the tasks without additional resources.
- A control question at the end of the lesson that the student must answer to confirm they have understood the material.

Output the entire course plan in plain text format, using clear headings and bullet points for each lesson.
  `;

    try {
      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: 'You are a helpful assistant specialized in designing interactive language courses.'
        },
        { role: 'user', content: prompt }
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      });

      const coursePlanText = response.choices[0]?.message?.content;
      if (!coursePlanText) {
        throw new Error('No course plan was generated by OpenAI.');
      }
      console.log(coursePlanText, 'coursePlanText');
      const parsedCoursePlan = this.parseCoursePlan(coursePlanText);

      const finalCourse = {
        user_id: '7dc1eedf-74c1-4f26-9218-11de30e88bd9', // TODO
        title:
          parsedCoursePlan.lessons && parsedCoursePlan.lessons.length
            ? parsedCoursePlan.lessons[0].title
            : 'Untitled Course',
        description: coursePlanText,
        questions: parsedCoursePlan.lessons.map((lesson: any) => lesson.questions),
        available_days: available_days,
        lang: targetLanguage,
        level: level,
        month: months,
        status: 'active',
        user_lang: nativeLanguage
      };

      return finalCourse;
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
    interface Lesson {
      lessonHeader: string;
      title: string;
      questions: {
        plan: string;
        controlQuestion: string;
      };
    }
    const lessons: Lesson[] = [];
    let currentLesson: Lesson | null = null;
    const lines = coursePlanText.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      if (/^(Lesson|Лекція)\s+\d+/.test(trimmedLine)) {
        if (currentLesson) {
          lessons.push(currentLesson);
        }
        const parts = trimmedLine.split(':');
        const header = parts[0].trim();
        const title = parts[1] ? parts[1].trim() : '';
        currentLesson = { lessonHeader: header, title, questions: { plan: '', controlQuestion: '' } };
      } else if (currentLesson) {
        if (/^Control Question[:\-]/i.test(trimmedLine)) {
          currentLesson.questions.controlQuestion = trimmedLine.replace(/^Control Question[:\-]\s*/i, '');
        } else {
          currentLesson.questions.plan += trimmedLine + ' ';
        }
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
