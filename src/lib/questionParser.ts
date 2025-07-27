import { Question, QuizCategory } from '@/types/quiz';

export function parseQuestionFromMarkdown(markdownContent: string, category: string): Question[] {
  const questions: Question[] = [];
  
  // Split by triple dashes or double newlines to separate questions
  const questionBlocks = markdownContent.split(/---+|\n\n\n+/).filter(block => block.trim());
  
  for (const block of questionBlocks) {
    const question = parseQuestionBlock(block.trim(), category);
    if (question) {
      questions.push(question);
    }
  }
  
  return questions;
}

function parseQuestionBlock(block: string, category: string): Question | null {
  try {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line);
    
    let index = '';
    let title = '';
    let question = '';
    const options: string[] = [];
    let correctAnswer = '';
    let explanation = '';
    let questionType: 'multiple-choice' | 'true-false' = 'multiple-choice';
    
    let currentSection = 'index';
    
    // First pass: detect question type by looking for Answer: True/False pattern
    const answerLine = lines.find(line => line.startsWith('Answer:'));
    if (answerLine) {
      const answerValue = answerLine.replace('Answer:', '').trim();
      if (answerValue === 'True' || answerValue === 'False') {
        questionType = 'true-false';
      }
    }
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Parse index
      if (line.startsWith('Index:')) {
        index = line.replace('Index:', '').trim();
        continue;
      }
      
      // Parse title
      if (questionType === 'multiple-choice') {
        // Multiple choice: title starts with ##
        if (line.startsWith('##')) {
          title = line.replace(/^#+\s*/, '').trim();
          currentSection = 'question';
          continue;
        }
      } else {
        // True/false: title is the first line after index (no ## prefix)
        if (index && !title && !line.startsWith('Answer:') && !line.startsWith('Explanation:')) {
          title = line;
          currentSection = 'question';
          continue;
        }
      }
      
      // Parse answer
      if (line.startsWith('Answer:')) {
        correctAnswer = line.replace('Answer:', '').trim();
        currentSection = 'answer';
        continue;
      }
      
      // Parse explanation
      if (line.startsWith('**Explanation:**') || line.startsWith('Explanation:')) {
        explanation = line.replace(/\*\*Explanation:\*\*|Explanation:/, '').trim();
        currentSection = 'explanation';
        continue;
      }
      
      // Parse options for multiple choice (A), B), C), D))
      if (questionType === 'multiple-choice' && /^[A-D]\)\s/.test(line)) {
        const optionText = line.replace(/^[A-D]\)\s*/, '').trim();
        options.push(optionText);
        continue;
      }
      
      // Add to current section
      if (currentSection === 'question' && line && !line.startsWith('A)') && !line.startsWith('Answer:') && !line.startsWith('Explanation:')) {
        question += (question ? ' ' : '') + line;
      } else if (currentSection === 'explanation' && line) {
        explanation += (explanation ? ' ' : '') + line;
      }
    }
    
    // Validate required fields based on question type
    if (questionType === 'multiple-choice') {
      if (!index || !title || !question || options.length !== 4 || !correctAnswer || !explanation) {
        console.warn('Invalid multiple choice question block:', { 
          index, title, question: question.slice(0, 50), 
          optionsCount: options.length, correctAnswer, 
          explanation: explanation.slice(0, 50) 
        });
        return null;
      }
    } else {
      // True/false validation
      if (!index || !title || !question || !correctAnswer || !explanation) {
        console.warn('Invalid true/false question block:', { 
          index, title, question: question.slice(0, 50), 
          correctAnswer, explanation: explanation.slice(0, 50) 
        });
        return null;
      }
      
      if (correctAnswer !== 'True' && correctAnswer !== 'False') {
        console.warn('Invalid true/false answer:', correctAnswer);
        return null;
      }
    }
    
    return {
      index,
      title,
      question,
      type: questionType,
      options: questionType === 'multiple-choice' ? options : undefined,
      correctAnswer,
      explanation,
      category
    };
  } catch (error) {
    console.error('Error parsing question block:', error);
    return null;
  }
}

export async function loadQuestionsFromCategory(categoryId: string): Promise<Question[]> {
  try {
    const response = await fetch(`/data/questions/${categoryId}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load questions for category: ${categoryId}`);
    }
    
    const markdownContent = await response.text();
    return parseQuestionFromMarkdown(markdownContent, categoryId);
  } catch (error) {
    console.error(`Error loading questions from category ${categoryId}:`, error);
    return [];
  }
}

export async function loadAllQuestions(): Promise<Question[]> {
  const categories = await getAvailableCategories();
  const allQuestions: Question[] = [];
  
  for (const category of categories) {
    const questions = await loadQuestionsFromCategory(category.id);
    allQuestions.push(...questions);
  }
  
  return allQuestions;
}

export async function getAvailableCategories(): Promise<QuizCategory[]> {
  // In a real app, this would dynamically scan the questions directory
  // For now, we'll return predefined categories
  return [
    {
      id: 'general-knowledge',
      name: 'General Knowledge',
      description: 'Questions about general knowledge',
      questionCount: 0
    },
    {
      id: 'public-administration',
      name: 'Public Administration',
      description: 'Questions about public service management and administration',
      questionCount: 0
    }
  ];
}

export function validateQuestion(question: Question): boolean {
  // Common validation for all question types
  const baseValidation = !!(
    question.index &&
    question.title &&
    question.question &&
    question.correctAnswer &&
    question.explanation &&
    question.category &&
    question.type
  );
  
  if (!baseValidation) return false;
  
  // Type-specific validation
  if (question.type === 'multiple-choice') {
    return !!(
      question.options &&
      question.options.length === 4 &&
      ['A', 'B', 'C', 'D'].includes(question.correctAnswer)
    );
  } else if (question.type === 'true-false') {
    return ['True', 'False'].includes(question.correctAnswer);
  }
  
  return false;
} 