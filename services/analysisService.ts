
import { GoogleGenAI, Type as GeminiType, Modality } from '@google/genai';
import { PerformanceReport, ArenaGlobalContext, ArenaPreference, ArenaQuestion, BlindProblem, HiringCommitteeVerdict, EndGameRoundResult } from '../types';
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

export const evaluateArenaInitial = async (
    transcript: string, 
    question: string, 
    context: string, 
    globalContext: ArenaGlobalContext, 
    preferences: ArenaPreference[]
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

export const finalizeArena = async (historyJson: string, globalContext: ArenaGlobalContext): Promise<PerformanceReport> => {
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

export const customizeArenaQuestions = async (baseQuestions: ArenaQuestion[], globalContext: ArenaGlobalContext): Promise<ArenaQuestion[]> => {
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

export const regenerateArenaFollowUp = async (
    transcript: string,
    previousQuestion: string,
    feedback: string,
    globalContext: ArenaGlobalContext
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
        contents: `You are a TEXT SPLITTER, not a writer. Your ONLY job is to split this wall of text into labeled sections for display.

**ABSOLUTE RULES - VIOLATION = FAILURE:**
1. COPY-PASTE ONLY. Never rewrite, rephrase, summarize, or "improve" any text.
2. ZERO content changes. Every single character, word, number, and symbol must be preserved EXACTLY.
3. NO additions. Do not add explanations, clarifications, or any text that isn't in the original.
4. NO deletions. Do not remove or shorten anything.
5. Split at natural boundaries (like "Background", "Task:", "Example:") that already exist in the text.

**Problem Text to Split:**
${rawProblem}

**Your Task:**
Find natural section boundaries in the text above and tag each chunk. You are a text SPLITTER, not an editor.

**Section Types to use:**
- heading: Words that serve as section titles in the original (e.g., "Background", "Algorithm Description", "Task")
- paragraph: Regular text blocks - COPY VERBATIM
- code: Code snippets - preserve EXACT formatting, whitespace, indentation
- example: Input/output examples - COPY VERBATIM including labels
- list: Any list-like content - COPY EACH ITEM VERBATIM
- constraint: Constraint statements if present

**Verification:**
If you concatenated all section contents, it should reproduce the EXACT original text (minus only the boundary markers you used for splitting).`,
        config: {
            responseMimeType: "application/json",
            responseSchema: PROBLEM_FORMATTER_SCHEMA
        }
    });

    return JSON.parse(response.text);
};

// ============================================================
// TEACHING METADATA GENERATION
// ============================================================

/**
 * Generate teaching metadata for a system coding problem.
 * This fills in the missing fields needed for teaching mode.
 */
export interface SystemCodingReportData {
    title: string;
    prompt: string;
    solutionCode: string;
    correctSolution: string | null;
    codeLanguage: string;
    company: string | null;
    knownBugs: Array<{
        title: string;
        type: string;
        severity: string;
        impact: Record<string, string>;
        evidence: { lineNumbers: number[]; codeSnippet: string };
        fix: string;
    }>;
    rubricScores: {
        problemUnderstanding: number;
        solutionApproach: number;
        functionalCorrectness: number;
        codeHygiene: number;
        communication: number | null;
    } | null;
    transcript: string | null;
    weakAreas: {
        primaryFailureMode: string;
        biggestImpactFix: string;
    } | null;
}

export interface TeachingMetadata {
    keyIdea: string;
    pattern: string;
    steps: string[];
    timeComplexity: string;
    spaceComplexity: string;
    detailedHint: string;
    expectedEdgeCases: string[];
    correctSolution: string;
}

const TEACHING_METADATA_SCHEMA = {
    type: GeminiType.OBJECT,
    properties: {
        keyIdea: { type: GeminiType.STRING, description: 'The core insight or key idea for solving this problem (1-2 sentences)' },
        pattern: { type: GeminiType.STRING, description: 'The implementation pattern, e.g., "Hash Ring + Binary Search"' },
        steps: { 
            type: GeminiType.ARRAY, 
            items: { type: GeminiType.STRING },
            description: 'Step-by-step correct approach (4-6 steps)'
        },
        timeComplexity: { type: GeminiType.STRING, description: 'Time complexity with brief reasoning, e.g., "O(log N) for binary search lookup"' },
        spaceComplexity: { type: GeminiType.STRING, description: 'Space complexity with brief reasoning, e.g., "O(N) to store N servers"' },
        detailedHint: { type: GeminiType.STRING, description: 'A teaching walkthrough hint (2-3 sentences) to help explain the approach' },
        expectedEdgeCases: {
            type: GeminiType.ARRAY,
            items: { type: GeminiType.STRING },
            description: 'List of edge cases to consider (3-5 items)'
        },
        correctSolution: { type: GeminiType.STRING, description: 'A correct, clean implementation of the solution' }
    },
    required: ['keyIdea', 'pattern', 'steps', 'timeComplexity', 'spaceComplexity', 'detailedHint', 'expectedEdgeCases', 'correctSolution']
};

export async function generateTeachingMetadata(reportData: SystemCodingReportData): Promise<TeachingMetadata> {
    // Build context from known bugs
    const bugContext = reportData.knownBugs.length > 0
        ? `Known bugs in the solution:\n${reportData.knownBugs.map(b => `- ${b.title}: ${b.fix}`).join('\n')}`
        : 'No bugs identified.';
    
    // Build weak areas context
    const weakAreasContext = reportData.weakAreas
        ? `Primary failure: ${reportData.weakAreas.primaryFailureMode}\nBiggest fix: ${reportData.weakAreas.biggestImpactFix}`
        : '';

    const prompt = `You are an expert coding instructor. Given a system coding interview problem and an attempted solution, generate teaching metadata to help the student learn this problem properly.

## Problem
Title: ${reportData.title}

Description:
${reportData.prompt}

## Student's Attempted Solution (${reportData.codeLanguage})
\`\`\`${reportData.codeLanguage}
${reportData.solutionCode}
\`\`\`

## Analysis
${bugContext}

${weakAreasContext}

## Your Task
Generate teaching metadata for this problem:
1. **keyIdea**: The core insight (1-2 sentences) - what's the "aha moment"?
2. **pattern**: The implementation pattern name (e.g., "Hash Ring + Binary Search", "Trie + DFS")
3. **steps**: 4-6 step-by-step approach to solve correctly
4. **timeComplexity**: Correct time complexity with reasoning
5. **spaceComplexity**: Correct space complexity with reasoning  
6. **detailedHint**: A teaching hint to help explain the approach (2-3 sentences)
7. **expectedEdgeCases**: 3-5 edge cases to consider
8. **correctSolution**: A correct, clean implementation in ${reportData.codeLanguage}

${reportData.correctSolution ? `Note: A corrected solution was already provided:\n\`\`\`${reportData.codeLanguage}\n${reportData.correctSolution}\n\`\`\`\nUse this as reference but feel free to improve it.` : 'Generate a correct solution from scratch.'}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: TEACHING_METADATA_SCHEMA
        }
    });

    return JSON.parse(response.text);
}

// ============================================================
// END GAME - HIRING COMMITTEE EVALUATION
// ============================================================

const HIRING_COMMITTEE_SYSTEM_PROMPT = `Role: You are the Hiring Committee at a Tier-1 Tech Company.
Input: You have received interview packets for the same candidate across multiple rounds.

The rounds may include:
1. Behavioral Round (Culture, Conflict)
2. ML Deep Dive (Theoretical Depth)
3. Coding Round (Algorithms, Correctness)
4. System Coding (Implementation Skills)
5. ML System Design (Scalability, Trade-offs)

Task: Synthesize these signals into a final hiring decision.

Rules:
- A strong coding round CANNOT save a candidate who failed Culture or System Design.
- L6 (Staff) requires proactive trade-off discussions, cross-functional thinking, and technical leadership.
- Identify contradictions (e.g., strong scaling claims in behavioral vs. weak design skills).
- Be rigorous but fair. Look for patterns across rounds.
- If any round was skipped/placeholder, note that limited data was available.`;

const HIRING_COMMITTEE_SCHEMA = {
    type: GeminiType.OBJECT,
    properties: {
        verdict: { 
            type: GeminiType.STRING, 
            description: "STRONG HIRE, LEAN HIRE, or NO HIRE" 
        },
        level: { 
            type: GeminiType.STRING, 
            description: "L6 if candidate demonstrates staff-level competency, N/A otherwise" 
        },
        debriefSummary: { 
            type: GeminiType.STRING, 
            description: "2-3 paragraph summary explaining the decision, citing evidence from each round" 
        },
        primaryBlocker: { 
            type: GeminiType.STRING, 
            description: "The single biggest concern that could change the decision, or 'None' if strong hire" 
        }
    },
    required: ["verdict", "level", "debriefSummary", "primaryBlocker"]
};

export const evaluateHiringCommittee = async (
    roundReports: EndGameRoundResult[]
): Promise<HiringCommitteeVerdict> => {
    // Build the interview packets from round reports
    const packets = roundReports.map((r, idx) => {
        const report = r.report;
        let roundSummary = `## Round ${idx + 1}: ${r.round}\n`;
        roundSummary += `Score: ${report.rating}/100\n`;
        roundSummary += `Summary: ${report.summary}\n`;
        
        // Add round-specific details
        if (report.hotTakeRubric) {
            roundSummary += `Rubric: ${JSON.stringify(report.hotTakeRubric)}\n`;
        }
        if (report.teachingReportData) {
            const tr = report.teachingReportData;
            roundSummary += `Student Outcome: ${tr.studentOutcome}\n`;
            roundSummary += `Top Gaps: ${tr.topGaps.join(', ')}\n`;
        }
        if (report.codingRubric) {
            roundSummary += `Coding Rubric: ${JSON.stringify(report.codingRubric)}\n`;
        }
        if (report.suggestions && report.suggestions.length > 0) {
            roundSummary += `Key Feedback: ${report.suggestions.slice(0, 3).join('; ')}\n`;
        }
        
        return roundSummary;
    }).join('\n---\n');

    const prompt = `You are evaluating a candidate for a Staff-level (L6) ML Engineering position.

${packets}

Based on these interview signals, provide your hiring committee decision.

Remember:
- The bar for L6 is HIGH: proactive trade-offs, technical leadership, system-wide thinking
- Look for consistency across rounds
- A single bad round in culture/design is a strong signal
- Consider what's missing if any rounds were placeholders`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: HIRING_COMMITTEE_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: HIRING_COMMITTEE_SCHEMA
        }
    });

    const result = JSON.parse(response.text);
    
    // Normalize the verdict and level values
    return {
        verdict: normalizeVerdict(result.verdict),
        level: normalizeLevel(result.level),
        debriefSummary: result.debriefSummary,
        primaryBlocker: result.primaryBlocker
    };
};

function normalizeVerdict(verdict: string): 'STRONG HIRE' | 'LEAN HIRE' | 'NO HIRE' {
    const upper = verdict.toUpperCase().trim();
    if (upper.includes('STRONG')) return 'STRONG HIRE';
    if (upper.includes('LEAN')) return 'LEAN HIRE';
    return 'NO HIRE';
}

function normalizeLevel(level: string): 'L6' | 'N/A' {
    const upper = level.toUpperCase().trim();
    if (upper.includes('L6') || upper.includes('STAFF')) return 'L6';
    return 'N/A';
}
