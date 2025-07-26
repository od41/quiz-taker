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
    
    let currentSection = 'index';
    
    for (const line of lines) {
      // Parse index
      if (line.startsWith('Index:')) {
        index = line.replace('Index:', '').trim();
        continue;
      }
      
      // Parse title (## format)
      if (line.startsWith('##')) {
        title = line.replace(/^#+\s*/, '').trim();
        currentSection = 'question';
        continue;
      }
      
      // Parse answer
      if (line.startsWith('**Answer:**')) {
        correctAnswer = line.replace('**Answer:**', '').trim();
        currentSection = 'answer';
        continue;
      }
      
      // Parse explanation
      if (line.startsWith('**Explanation:**')) {
        explanation = line.replace('**Explanation:**', '').trim();
        currentSection = 'explanation';
        continue;
      }
      
      // Parse options (A), B), C), D))
      if (/^[A-D]\)\s/.test(line)) {
        const optionText = line.replace(/^[A-D]\)\s*/, '').trim();
        options.push(optionText);
        continue;
      }
      
      // Add to current section
      if (currentSection === 'question' && line && !line.startsWith('A)')) {
        question += (question ? ' ' : '') + line;
      } else if (currentSection === 'explanation' && line) {
        explanation += (explanation ? ' ' : '') + line;
      }
    }
    
    // Validate required fields
    if (!index || !title || !question || options.length !== 4 || !correctAnswer || !explanation) {
      console.warn('Invalid question block:', { index, title, question: question.slice(0, 50), optionsCount: options.length, correctAnswer, explanation: explanation.slice(0, 50) });
      return null;
    }
    
    return {
      index,
      title,
      question,
      options,
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
      id: 'constitutional-law',
      name: 'Constitutional Law',
      description: 'Questions about Nigeria\'s constitutional framework and governance',
      questionCount: 0 // Will be populated when questions are loaded
    },
    {
      id: 'public-administration',
      name: 'Public Administration',
      description: 'Questions about public service management and administration',
      questionCount: 0
    },
    {
      id: 'ethics',
      name: 'Ethics & Conduct',
      description: 'Questions about ethical standards and professional conduct',
      questionCount: 0
    },
    {
      id: 'financial-management',
      name: 'Financial Management',
      description: 'Questions about government financial procedures and budgeting',
      questionCount: 0
    }
  ];
}

export function validateQuestion(question: Question): boolean {
  return !!(
    question.index &&
    question.title &&
    question.question &&
    question.options &&
    question.options.length === 4 &&
    question.correctAnswer &&
    ['A', 'B', 'C', 'D'].includes(question.correctAnswer) &&
    question.explanation &&
    question.category
  );
} 