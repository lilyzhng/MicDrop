
import { GoogleGenAI, Type as GeminiType, Modality } from '@google/genai';
import { PerformanceReport, HotTakeGlobalContext, HotTakePreference, HotTakeQuestion, BlindProblem } from '../types';
import { TRANSCRIBE_CONFIG, COACH_CONFIG, HOT_TAKE_CONFIG, WALKIE_TALKIE_CONFIG, CODING_INTERVIEW_CONFIG } from '../config/evaluationPrompts';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Remove generateTTS and analyzeTeleprompterRecording imports and functions if they are no longer used.
// Or just remove the specific function `analyzeTeleprompterRecording`.

export const analyzeStage1_Transcribe = async (base64Audio: string, mimeType: string, context: string) => {
    const transcriptResponse = await ai.models.generateContent({
        model: TRANSCRIBE_CONFIG.model,
        config: {
            systemInstruction: TRANSCRIBE_CONFIG.systemPrompt
        },
        contents: {
            parts: [
                { inlineData: { mimeType: mimeType, data: base64Audio } },
                { text: TRANSCRIBE_CONFIG.generatePrompt(context) }
            ]
        }
    });
    
    return transcriptResponse.text;
};

export const analyzeStage2_Coach = async (base64Audio: string | null, transcript: string, context: string, mimeType: string = 'audio/mp3'): Promise<PerformanceReport> => {
    // Construct parts based on available input
    const parts: any[] = [];
    
    if (base64Audio) {
       parts.push({ inlineData: { mimeType: mimeType, data: base64Audio } });
    }

    let promptText = `Context: ${context}\n\n`;
    if (base64Audio) {
        promptText += `Input 1: Attached is the original Audio.\n`;
        promptText += `Input 2: Below is the Transcript generated from this call.\n\n${transcript}\n\n`;
        promptText += `Task:\nBased on the Audio (for tone) and the Text (for content), analyze my performance...`;
    } else {
        promptText += `Input: Below is the Transcript of the interview.\n\n${transcript}\n\n`;
        promptText += `Task:\nBased on the Text content, analyze my performance... Note: Since no audio is provided, focus primarily on content, structure, and strategy. Skip delivery/tone analysis if impossible.`;
    }
    
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
        model: COACH_CONFIG.model,
        config: {
            systemInstruction: COACH_CONFIG.systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: GeminiType.OBJECT,
                properties: {
                    rating: { type: GeminiType.INTEGER },
                    summary: { type: GeminiType.STRING },
                    suggestions: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                    coachingRewrite: {
                        type: GeminiType.OBJECT,
                        properties: {
                            diagnosis: { type: GeminiType.STRING },
                            fix: { type: GeminiType.STRING },
                            rewrite: { type: GeminiType.STRING }
                        },
                        required: ["diagnosis", "fix", "rewrite"]
                    },
                    detailedFeedback: {
                        type: GeminiType.ARRAY,
                        description: "Areas for Improvement. For each issue, provide a Human Rewrite AND the specific question.",
                        items: {
                            type: GeminiType.OBJECT,
                            properties: {
                                category: { type: GeminiType.STRING },
                                question: { type: GeminiType.STRING, description: "The specific question or discussion point from the interviewer that prompted this response." },
                                issue: { type: GeminiType.STRING },
                                instance: { type: GeminiType.STRING },
                                rewrite: { type: GeminiType.STRING, description: "The revised, human-sounding version of the answer." },
                                explanation: { type: GeminiType.STRING, description: "Why this rewrite works (soft skills analysis)." }
                            },
                            required: ["category", "question", "issue", "instance", "rewrite", "explanation"]
                        }
                    },
                    highlights: {
                        type: GeminiType.ARRAY,
                        description: "Positive feedback / Key Strengths / Good Answers. Include the question.",
                        items: {
                            type: GeminiType.OBJECT,
                            properties: {
                                category: { type: GeminiType.STRING },
                                question: { type: GeminiType.STRING, description: "The specific question from the interviewer." },
                                strength: { type: GeminiType.STRING },
                                quote: { type: GeminiType.STRING }
                            },
                            required: ["category", "question", "strength", "quote"]
                        }
                    },
                    pronunciationFeedback: { 
                        type: GeminiType.ARRAY, 
                        description: "3 Specific drills to fix Monotone/Rushed delivery. Include the question context.",
                        items: { 
                            type: GeminiType.OBJECT,
                            properties: {
                                phrase: { type: GeminiType.STRING, description: "The original phrase spoken" },
                                question: { type: GeminiType.STRING, description: "The question being answered when this was said" },
                                issue: { type: GeminiType.STRING, description: "e.g. 'Rushed technical term', 'Monotone'" },
                                practiceDrill: { type: GeminiType.STRING, description: "Visual guide using CAPS and ... for rhythm" },
                                reason: { type: GeminiType.STRING, description: "Why this emphasis matters" }
                            },
                            required: ["phrase", "question", "issue", "practiceDrill", "reason"]
                        } 
                    },
                    flipTheTable: {
                        type: GeminiType.OBJECT,
                        description: "Analysis of questions the candidate asked (or should have asked) to flip the table and show interest.",
                        properties: {
                            candidateQuestions: {
                                type: GeminiType.ARRAY,
                                description: "Questions the candidate actually asked during the interview",
                                items: {
                                    type: GeminiType.OBJECT,
                                    properties: {
                                        questionAsked: { type: GeminiType.STRING, description: "The exact question the candidate asked" },
                                        context: { type: GeminiType.STRING, description: "The conversation context when this question was asked" },
                                        analysis: { type: GeminiType.STRING, description: "What was good or problematic about this question" },
                                        improvedVersion: { type: GeminiType.STRING, description: "How to improve this question (if needed). Leave empty if question was already strong." },
                                        reasoning: { type: GeminiType.STRING, description: "Why the improved version is better, or why the original was strong" }
                                    },
                                    required: ["questionAsked", "context", "analysis", "reasoning"]
                                }
                            },
                            missedOpportunities: {
                                type: GeminiType.ARRAY,
                                description: "Great questions the candidate should have asked but didn't, based on conversation context",
                                items: {
                                    type: GeminiType.OBJECT,
                                    properties: {
                                        suggestedQuestion: { type: GeminiType.STRING, description: "A great question the candidate should have asked" },
                                        context: { type: GeminiType.STRING, description: "When/why this would have been relevant based on the conversation" },
                                        impact: { type: GeminiType.STRING, description: "Why asking this would have made a strong impression" }
                                    },
                                    required: ["suggestedQuestion", "context", "impact"]
                                }
                            },
                            overallAssessment: { type: GeminiType.STRING, description: "General feedback on the candidate's question-asking strategy" }
                        },
                        required: ["candidateQuestions", "missedOpportunities", "overallAssessment"]
                    }
                },
                required: ["rating", "summary", "suggestions", "detailedFeedback", "highlights", "coachingRewrite", "pronunciationFeedback", "flipTheTable"]
            }
        },
        contents: {
            parts: parts
        }
    });

    return JSON.parse(response.text);
};

// ========== WALKIE TALKIE FUNCTIONS ==========

const WALKIE_REPORT_SCHEMA = {
    type: GeminiType.OBJECT,
    properties: {
        rating: { type: GeminiType.INTEGER, description: "Total score 0-100, sum of the 4 rubric scores" },
        summary: { type: GeminiType.STRING, description: "2-3 sentence assessment of the explanation" },
        suggestions: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
        // Strict rubric scoring - each category is 0-25 points
        rubricScores: {
            type: GeminiType.OBJECT,
            description: "Strict rubric scores, each 0-25 points. Total = rating.",
            properties: {
                algorithmScore: { type: GeminiType.INTEGER, description: "0-25: Did they identify the correct algorithm/pattern and explain the core logic?" },
                algorithmFeedback: { type: GeminiType.STRING, description: "What was correct or missing about the algorithm explanation" },
                edgeCasesScore: { type: GeminiType.INTEGER, description: "0-25: Did they mention relevant edge cases?" },
                edgeCasesFeedback: { type: GeminiType.STRING, description: "What edge cases were covered or missed" },
                timeComplexityScore: { type: GeminiType.INTEGER, description: "0-25: Did they correctly analyze time complexity?" },
                timeComplexityFeedback: { type: GeminiType.STRING, description: "What they said about time complexity vs expected" },
                spaceComplexityScore: { type: GeminiType.INTEGER, description: "0-25: Did they correctly analyze space complexity?" },
                spaceComplexityFeedback: { type: GeminiType.STRING, description: "What they said about space complexity vs expected" }
            },
            required: ["algorithmScore", "algorithmFeedback", "edgeCasesScore", "edgeCasesFeedback", "timeComplexityScore", "timeComplexityFeedback", "spaceComplexityScore", "spaceComplexityFeedback"]
        },
        mentalModelChecklist: {
            type: GeminiType.OBJECT,
            description: "Boolean flags indicating what was covered",
            properties: {
                correctPattern: { type: GeminiType.BOOLEAN, description: "Did they identify the correct algorithm pattern?" },
                logicCorrect: { type: GeminiType.BOOLEAN, description: "Is their core logic/approach correct?" },
                timeComplexityMentioned: { type: GeminiType.BOOLEAN, description: "Did they mention time complexity?" },
                timeComplexityCorrect: { type: GeminiType.BOOLEAN, description: "Is their time complexity analysis correct?" },
                spaceComplexityMentioned: { type: GeminiType.BOOLEAN, description: "Did they mention space complexity?" },
                spaceComplexityCorrect: { type: GeminiType.BOOLEAN, description: "Is their space complexity analysis correct?" },
                edgeCasesMentioned: { type: GeminiType.BOOLEAN, description: "Did they mention any edge cases?" }
            }
        },
        missingEdgeCases: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING }, description: "List of edge cases they should have mentioned but didn't" },
        detectedAutoScore: { type: GeminiType.STRING, description: "'good' if rating >= 75, 'partial' if 50-74, 'missed' if < 50" },
        detailedFeedback: {
            type: GeminiType.ARRAY,
            description: "Specific issues that need improvement",
            items: {
                type: GeminiType.OBJECT,
                properties: {
                    category: { type: GeminiType.STRING, description: "'Algorithm', 'Edge Cases', 'Time Complexity', or 'Space Complexity'" },
                    issue: { type: GeminiType.STRING, description: "What was wrong or missing" },
                    instance: { type: GeminiType.STRING, description: "What they said (or 'Not mentioned' if missing)" },
                    rewrite: { type: GeminiType.STRING, description: "What they should have said" },
                    explanation: { type: GeminiType.STRING, description: "Why this matters" }
                },
                required: ["category", "issue", "instance", "rewrite", "explanation"]
            }
        }
    },
    required: ["rating", "summary", "rubricScores", "mentalModelChecklist", "detectedAutoScore", "detailedFeedback", "missingEdgeCases"]
};

export const analyzeWalkieSession = async (base64Audio: string, polishedText: string, currentProblem: BlindProblem): Promise<PerformanceReport> => {
    const prompt = WALKIE_TALKIE_CONFIG.generatePrompt({
        title: currentProblem.title,
        prompt: currentProblem.prompt,
        pattern: currentProblem.pattern,
        keyIdea: currentProblem.keyIdea,
        timeComplexity: currentProblem.timeComplexity,
        spaceComplexity: currentProblem.spaceComplexity,
        expectedEdgeCases: currentProblem.expectedEdgeCases,
        steps: currentProblem.steps
    }, polishedText);

    const response = await ai.models.generateContent({
        model: WALKIE_TALKIE_CONFIG.model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: WALKIE_REPORT_SCHEMA
        }
    });
    return JSON.parse(response.text);
};

export const refineTranscript = async (rawTranscript: string, context: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: WALKIE_TALKIE_CONFIG.model,
        contents: WALKIE_TALKIE_CONFIG.generateRefinePrompt(rawTranscript, context)
    });
    return response.text || rawTranscript;
};

// ========== HOT TAKE FUNCTIONS ==========

const HOT_TAKE_REPORT_SCHEMA = {
    type: GeminiType.OBJECT,
    properties: {
        rating: { type: GeminiType.INTEGER },
        summary: { type: GeminiType.STRING },
        suggestions: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
        pronunciationFeedback: { type: GeminiType.ARRAY, items: { type: GeminiType.OBJECT, properties: { phrase: { type: GeminiType.STRING }, issue: { type: GeminiType.STRING }, practiceDrill: { type: GeminiType.STRING }, reason: { type: GeminiType.STRING } } } },
        hotTakeRubric: {
            type: GeminiType.OBJECT,
            properties: {
                clarity: { type: GeminiType.INTEGER },
                technicalDepth: { type: GeminiType.INTEGER },
                strategicThinking: { type: GeminiType.INTEGER },
                executivePresence: { type: GeminiType.INTEGER },
            }
        },
        followUpQuestion: { type: GeminiType.STRING },
        hotTakeMasterRewrite: { type: GeminiType.STRING },
    },
    required: ["rating", "summary", "hotTakeRubric", "followUpQuestion", "hotTakeMasterRewrite"]
};

const HOT_TAKE_QUESTION_SCHEMA = {
    type: GeminiType.ARRAY,
    items: {
        type: GeminiType.OBJECT,
        properties: {
            id: { type: GeminiType.STRING },
            title: { type: GeminiType.STRING },
            context: { type: GeminiType.STRING },
            probingPrompt: { type: GeminiType.STRING },
        }
    }
};

export const evaluateHotTakeInitial = async (
    transcript: string, 
    question: string, 
    context: string, 
    globalContext: HotTakeGlobalContext, 
    preferences: HotTakePreference[]
): Promise<PerformanceReport> => {
    const prefSummary = preferences.map(p => `- [${p.type}] on "${p.questionText}": ${p.feedback}`).join('\n');
    
    const prompt = HOT_TAKE_CONFIG.generatePrompt(
        question,
        context,
        transcript,
        globalContext.interviewer || 'Senior Hiring Manager',
        globalContext.company || 'a top tech company',
        globalContext.roundFocus || 'General behavioral interview',
        prefSummary
    );

    const response = await ai.models.generateContent({
        model: HOT_TAKE_CONFIG.model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: HOT_TAKE_REPORT_SCHEMA
        }
    });
    return JSON.parse(response.text);
};

export const finalizeHotTake = async (historyJson: string, globalContext: HotTakeGlobalContext): Promise<PerformanceReport> => {
    const prompt = HOT_TAKE_CONFIG.generateFinalizePrompt(
        historyJson,
        globalContext.company || '',
        globalContext.roundFocus || ''
    );

    const response = await ai.models.generateContent({
        model: HOT_TAKE_CONFIG.model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: HOT_TAKE_REPORT_SCHEMA
        }
    });
    return JSON.parse(response.text);
};

export const customizeHotTakeQuestions = async (baseQuestions: HotTakeQuestion[], globalContext: HotTakeGlobalContext): Promise<HotTakeQuestion[]> => {
    if (!globalContext.company && !globalContext.roundFocus) {
        return baseQuestions;
    }
    
    const prompt = HOT_TAKE_CONFIG.generateCustomizeQuestionsPrompt(
        JSON.stringify(baseQuestions),
        globalContext.company || '',
        globalContext.interviewer || '',
        globalContext.roundFocus || ''
    );

    const response = await ai.models.generateContent({
        model: HOT_TAKE_CONFIG.model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: HOT_TAKE_QUESTION_SCHEMA
        }
    });
    return JSON.parse(response.text || "[]");
};

export const regenerateHotTakeFollowUp = async (
    transcript: string,
    previousQuestion: string,
    feedback: string,
    globalContext: HotTakeGlobalContext
): Promise<string> => {
    const prompt = HOT_TAKE_CONFIG.generateRegenerateFollowUpPrompt(
        transcript,
        previousQuestion,
        feedback,
        globalContext.interviewer || '',
        globalContext.company || ''
    );

    const response = await ai.models.generateContent({
        model: HOT_TAKE_CONFIG.model,
        contents: prompt
    });
    return response.text || "Could you elaborate on that point?";
};

// ========== CODING INTERVIEW FUNCTIONS ==========

// Validation helper for coding interview reports
function validateCodingReport(report: any): boolean {
    try {
        // Check required top-level fields
        if (typeof report.rating !== 'number' || report.rating < 0 || report.rating > 100) return false;
        if (typeof report.summary !== 'string') return false;
        
        // Check rubric structure
        const rubric = report.codingRubric;
        if (!rubric) return false;
        if (typeof rubric.problemUnderstanding !== 'number' || rubric.problemUnderstanding < 0 || rubric.problemUnderstanding > 25) return false;
        if (typeof rubric.solutionApproach !== 'number' || rubric.solutionApproach < 0 || rubric.solutionApproach > 25) return false;
        if (typeof rubric.functionalCorrectness !== 'number' || rubric.functionalCorrectness < 0 || rubric.functionalCorrectness > 20) return false;
        if (typeof rubric.codeHygiene !== 'number' || rubric.codeHygiene < 0 || rubric.codeHygiene > 5) return false;
        if (rubric.communication !== null && (typeof rubric.communication !== 'number' || rubric.communication < 0 || rubric.communication > 25)) return false;
        
        // Check arrays exist
        if (!Array.isArray(report.codeIssues)) return false;
        if (!Array.isArray(report.problemSolvingTimeline)) return false;
        if (!Array.isArray(report.nextTimeHabits)) return false;
        if (!Array.isArray(report.highlights)) return false;
        
        // Validate code issues structure
        for (const issue of report.codeIssues) {
            if (!issue.title || !issue.type || !issue.severity || !issue.evidence || !issue.fix) return false;
            if (!issue.evidence.lineNumbers || !Array.isArray(issue.evidence.lineNumbers)) return false;
            if (!issue.evidence.codeSnippet) return false;
        }
        
        // Validate timeline structure
        for (const event of report.problemSolvingTimeline) {
            if (!event.timestamp || !event.moment || !event.category || !event.evidence) return false;
        }
        
        return true;
    } catch (e) {
        console.error('Validation error:', e);
        return false;
    }
}

const CODING_REPORT_SCHEMA = {
    type: GeminiType.OBJECT,
    properties: {
        rating: { type: GeminiType.INTEGER, description: "Total score 0-100, sum of the 5 rubric scores (null communication counts as 0)" },
        summary: { type: GeminiType.STRING, description: "2-3 sentence overall assessment" },
        suggestions: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
        correctedSolution: { type: GeminiType.STRING, description: "ONLY show affected functions/methods with fixes. Use '# ... unchanged ...' for unmodified code. Remove personal notes. Add brief comments explaining fixes." },
        codingRubric: {
            type: GeminiType.OBJECT,
            description: "Rubric scores for coding interview - split code quality into correctness + hygiene",
            properties: {
                problemUnderstanding: { type: GeminiType.INTEGER, description: "0-25: Did they clarify requirements with concrete evidence?" },
                solutionApproach: { type: GeminiType.INTEGER, description: "0-25: Did they explain approach and analyze complexity?" },
                functionalCorrectness: { type: GeminiType.INTEGER, description: "0-20: Is the code correct? Any bugs or edge case issues?" },
                codeHygiene: { type: GeminiType.INTEGER, description: "0-5: Readability and style only (4x less weight than correctness)" },
                communication: { type: GeminiType.INTEGER, description: "0-25 or null if transcript <100 words: Clear and concise explanation?" }
            },
            required: ["problemUnderstanding", "solutionApproach", "functionalCorrectness", "codeHygiene", "communication"]
        },
        codeIssues: {
            type: GeminiType.ARRAY,
            description: "List of code problems found with evidence",
            items: {
                type: GeminiType.OBJECT,
                properties: {
                    title: { type: GeminiType.STRING, description: "Short description of issue" },
                    type: { type: GeminiType.STRING, description: "correctness, edge-case, complexity, or style" },
                    severity: { type: GeminiType.STRING, description: "critical, major, or minor" },
                    impact: { 
                        type: GeminiType.OBJECT,
                        properties: {
                            correctness: { type: GeminiType.STRING, description: "What breaks? Specific failing input" },
                            runtime: { type: GeminiType.STRING, description: "Performance impact" },
                            robustness: { type: GeminiType.STRING, description: "Edge case handling" },
                            maintainability: { type: GeminiType.STRING, description: "Readability impact" }
                        }
                    },
                    evidence: {
                        type: GeminiType.OBJECT,
                        properties: {
                            lineNumbers: { type: GeminiType.ARRAY, items: { type: GeminiType.INTEGER } },
                            codeSnippet: { type: GeminiType.STRING, description: "Actual code with line numbers" }
                        },
                        required: ["lineNumbers", "codeSnippet"]
                    },
                    fix: { type: GeminiType.STRING, description: "Exact code change to apply" }
                },
                required: ["title", "type", "severity", "impact", "evidence", "fix"]
            }
        },
        problemSolvingTimeline: {
            type: GeminiType.ARRAY,
            description: "Key moments from interview, MAX 6-8 events",
            items: {
                type: GeminiType.OBJECT,
                properties: {
                    timestamp: { type: GeminiType.STRING, description: "MM:SS format or 'unknown'" },
                    moment: { type: GeminiType.STRING, description: "What happened, max 100 chars" },
                    category: { type: GeminiType.STRING, description: "clarification, approach, coding_start, coding_main, debugging, or testing" },
                    evidence: { type: GeminiType.STRING, description: "Quote from transcript" }
                },
                required: ["timestamp", "moment", "category", "evidence"]
            }
        },
        highlights: {
            type: GeminiType.ARRAY,
            description: "What they did well",
            items: {
                type: GeminiType.OBJECT,
                properties: {
                    category: { type: GeminiType.STRING, description: "Which rubric category" },
                    strength: { type: GeminiType.STRING, description: "What they did well" },
                    quote: { type: GeminiType.STRING, description: "Code snippet with line numbers OR transcript quote" }
                },
                required: ["category", "strength", "quote"]
            }
        },
        nextTimeHabits: {
            type: GeminiType.ARRAY,
            description: "Exactly 3 specific, actionable behavior changes for next time",
            items: { type: GeminiType.STRING }
        },
        pronunciationFeedback: { 
            type: GeminiType.ARRAY, 
            description: "Specific drills to fix delivery issues (if audio provided)",
            items: { 
                type: GeminiType.OBJECT,
                properties: {
                    phrase: { type: GeminiType.STRING, description: "The original phrase spoken" },
                    issue: { type: GeminiType.STRING, description: "e.g. 'Rushed technical term', 'Monotone'" },
                    practiceDrill: { type: GeminiType.STRING, description: "Visual guide using CAPS and ... for rhythm" },
                    reason: { type: GeminiType.STRING, description: "Why this emphasis matters" }
                },
                required: ["phrase", "issue", "practiceDrill", "reason"]
            } 
        }
    },
    required: ["rating", "summary", "correctedSolution", "codingRubric", "codeIssues", "problemSolvingTimeline", "highlights", "nextTimeHabits", "suggestions"]
};

export const analyzeStage2_CodingInterview = async (
    base64Audio: string | null,
    transcript: string,
    questionDescription: string,
    solutionCode: string,
    context: string,
    language: string = 'python',
    mimeType: string = 'audio/mp3',
    maxRetries: number = 2
): Promise<PerformanceReport> => {
    const prompt = CODING_INTERVIEW_CONFIG.generatePrompt(
        questionDescription,
        solutionCode,
        transcript,
        language,
        context
    );

    let lastError: Error | null = null;
    
    // Retry logic for robustness
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: CODING_INTERVIEW_CONFIG.model,
                contents: prompt,
                config: {
                    systemInstruction: CODING_INTERVIEW_CONFIG.systemPrompt,
                    responseMimeType: "application/json",
                    responseSchema: CODING_REPORT_SCHEMA
                }
            });

            const report = JSON.parse(response.text);
            
            // Validate the response structure
            if (!validateCodingReport(report)) {
                throw new Error('Response validation failed: Missing required fields or invalid structure');
            }
            
            // Add the coding-specific fields to the report
            report.codingQuestion = questionDescription;
            report.solutionCode = solutionCode;
            report.correctedSolution = report.correctedSolution || solutionCode; // Fallback to original if not generated
            report.codeLanguage = language;
            
            // Format the problem statement for better display
            try {
                report.formattedProblemStatement = await formatProblemStatement(questionDescription);
            } catch (formatError) {
                console.warn('Failed to format problem statement, using raw text:', formatError);
                report.formattedProblemStatement = null; // Will fall back to raw text in UI
            }
            
            console.log(`✓ Coding interview analysis succeeded on attempt ${attempt + 1}`);
            return report as PerformanceReport;
            
        } catch (error: any) {
            lastError = error;
            console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error.message);
            
            if (attempt < maxRetries) {
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            }
        }
    }
    
    // All retries failed
    console.error('All retry attempts failed for coding interview analysis');
    throw lastError || new Error('Coding interview analysis failed after all retries');
};

// ========== PROBLEM STATEMENT FORMATTER ==========

interface ProblemSection {
    type: 'heading' | 'paragraph' | 'code' | 'example' | 'list' | 'constraint';
    content: string;
    items?: string[]; // For lists
    language?: string; // For code blocks
    label?: string; // For examples (e.g., "Example 1", "Input", "Output")
}

interface FormattedProblemStatement {
    title?: string;
    sections: ProblemSection[];
}

const PROBLEM_FORMATTER_SCHEMA = {
    type: GeminiType.OBJECT,
    properties: {
        title: { type: GeminiType.STRING, description: "Main problem title if present" },
        sections: {
            type: GeminiType.ARRAY,
            description: "Ordered sections of the problem statement",
            items: {
                type: GeminiType.OBJECT,
                properties: {
                    type: { 
                        type: GeminiType.STRING, 
                        description: "heading | paragraph | code | example | list | constraint" 
                    },
                    content: { type: GeminiType.STRING, description: "Main content text" },
                    items: { 
                        type: GeminiType.ARRAY, 
                        items: { type: GeminiType.STRING },
                        description: "Array of items for lists or constraints"
                    },
                    language: { type: GeminiType.STRING, description: "Programming language for code blocks" },
                    label: { type: GeminiType.STRING, description: "Label like 'Example 1', 'Input', 'Output'" }
                },
                required: ["type", "content"]
            }
        }
    },
    required: ["sections"]
};

export const formatProblemStatement = async (rawProblem: string): Promise<FormattedProblemStatement> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a problem statement formatter. Parse this coding problem and structure it into semantic sections.

**Problem Text:**
${rawProblem}

**Instructions:**
- Identify the main title if present
- Break down into semantic sections
- Detect headings (Description, Examples, Constraints, etc.)
- Identify code blocks and their language
- Separate examples with their inputs/outputs
- Extract constraint lists
- Preserve exact code and example formatting

**Section Types:**
- heading: Section titles like "Description:", "Examples:", "Constraints:"
- paragraph: Regular descriptive text
- code: Code snippets (detect language)
- example: Example inputs/outputs with labels
- list: Bulleted or numbered lists
- constraint: Constraint items

Return structured JSON with semantic sections that can be beautifully rendered.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: PROBLEM_FORMATTER_SCHEMA
        }
    });

    return JSON.parse(response.text);
};
