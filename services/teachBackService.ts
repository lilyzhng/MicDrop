/**
 * Teach-Back Mode Service
 * 
 * Handles conversation management between the user (teacher) and the Junior Engineer,
 * as well as the Dean's post-session evaluation.
 */

import { GoogleGenAI, Type as GeminiType } from '@google/genai';
import { 
    BlindProblem, 
    TeachingTurn, 
    JuniorState, 
    TeachingSession, 
    TeachingReport,
    ReadinessReport 
} from '../types';
import { 
    STRUCTURE_CHECKER_CONFIG,
    JUNIOR_CONFIG,
    LEETCODE_JUNIOR_CONFIG,
    LEETCODE_DEAN_CONFIG,
    SYSTEM_JUNIOR_CONFIG,
    SYSTEM_DEAN_CONFIG,
    DEAN_CONFIG, 
    JUNIOR_RESPONSE_SCHEMA, 
    TEACHING_REPORT_SCHEMA 
} from '../config/teachBackPrompts';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// ============================================================
// STRUCTURE CHECKER (Pass 1 - Readiness to Teach)
// ============================================================

/**
 * Evaluate if the user is ready to teach based on their explanation
 * This is Pass 1 of the paired repetition flow
 */
export async function evaluateReadinessToTeach(
    problem: BlindProblem,
    transcript: string
): Promise<ReadinessReport> {
    const prompt = STRUCTURE_CHECKER_CONFIG.generateEvaluationPrompt(problem, transcript);

    const response = await ai.models.generateContent({
        model: STRUCTURE_CHECKER_CONFIG.model,
        contents: prompt,
        config: {
            systemInstruction: STRUCTURE_CHECKER_CONFIG.systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: GeminiType.OBJECT,
                properties: {
                    readinessScore: { type: GeminiType.INTEGER },
                    isReadyToTeach: { type: GeminiType.BOOLEAN },
                    checklist: {
                        type: GeminiType.OBJECT,
                        properties: {
                            coreInsight: {
                                type: GeminiType.OBJECT,
                                properties: {
                                    present: { type: GeminiType.BOOLEAN },
                                    quality: { type: GeminiType.STRING },
                                    feedback: { type: GeminiType.STRING }
                                },
                                required: ['present', 'quality', 'feedback']
                            },
                            stateDefinition: {
                                type: GeminiType.OBJECT,
                                properties: {
                                    present: { type: GeminiType.BOOLEAN },
                                    quality: { type: GeminiType.STRING },
                                    feedback: { type: GeminiType.STRING }
                                },
                                required: ['present', 'quality', 'feedback']
                            },
                            exampleWalkthrough: {
                                type: GeminiType.OBJECT,
                                properties: {
                                    present: { type: GeminiType.BOOLEAN },
                                    quality: { type: GeminiType.STRING },
                                    feedback: { type: GeminiType.STRING },
                                    modelExample: { type: GeminiType.STRING }
                                },
                                required: ['present', 'quality', 'feedback', 'modelExample']
                            },
                            edgeCases: {
                                type: GeminiType.OBJECT,
                                properties: {
                                    mentioned: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                                    missing: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                                    feedback: { type: GeminiType.STRING }
                                },
                                required: ['mentioned', 'missing', 'feedback']
                            },
                            complexity: {
                                type: GeminiType.OBJECT,
                                properties: {
                                    timeMentioned: { type: GeminiType.BOOLEAN },
                                    timeCorrect: { type: GeminiType.BOOLEAN },
                                    spaceMentioned: { type: GeminiType.BOOLEAN },
                                    spaceCorrect: { type: GeminiType.BOOLEAN },
                                    feedback: { type: GeminiType.STRING },
                                    correctExplanation: { type: GeminiType.STRING }
                                },
                                required: ['timeMentioned', 'timeCorrect', 'spaceMentioned', 'spaceCorrect', 'feedback', 'correctExplanation']
                            }
                        },
                        required: ['coreInsight', 'stateDefinition', 'exampleWalkthrough', 'edgeCases', 'complexity']
                    },
                    missingElements: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                    strengthElements: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                    suggestion: { type: GeminiType.STRING }
                },
                required: ['readinessScore', 'isReadyToTeach', 'checklist', 'missingElements', 'strengthElements', 'suggestion']
            }
        }
    });

    const result = JSON.parse(response.text);
    
    // Ensure isReadyToTeach aligns with score
    result.isReadyToTeach = result.readinessScore >= 70;
    
    return result as ReadinessReport;
}

// ============================================================
// JUNIOR ENGINEER FUNCTIONS
// ============================================================

/**
 * Get the Junior's initial state when starting a teaching session
 */
export function getInitialJuniorState(): JuniorState {
    return {
        currentUnderstanding: [],
        confusionPoints: ['Everything - just starting to learn'],
        likelyMisimplementations: ['Would not know where to start'],
        readyToSummarize: false
    };
}

/**
 * Build multimodal content array for Gemini when images are present
 * Gemini accepts an array of parts: text and inline images
 */
function buildMultimodalContent(
    textPrompt: string, 
    teachingHistory: TeachingTurn[]
): { role: string; parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }[] {
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
    
    // Add the main text prompt
    parts.push({ text: textPrompt });
    
    // Add any images from the teaching history
    const imagesWithContext = teachingHistory
        .filter(turn => turn.speaker === 'teacher' && turn.imageBase64)
        .map((turn, idx) => ({
            index: idx + 1,
            image: turn.imageBase64!,
            text: turn.content
        }));
    
    if (imagesWithContext.length > 0) {
        parts.push({ 
            text: `\n\n--- WHITEBOARD DRAWINGS FROM TEACHER ---\nThe teacher has drawn ${imagesWithContext.length} diagram(s) on the whiteboard. Analyze them to understand what they're explaining:\n` 
        });
        
        for (const item of imagesWithContext) {
            parts.push({ 
                text: `\nWhiteboard drawing #${item.index}${item.text ? ` (Teacher said: "${item.text}")` : ''}:` 
            });
            parts.push({
                inlineData: {
                    mimeType: 'image/png',
                    data: item.image.replace(/^data:image\/\w+;base64,/, '') // Remove data URL prefix if present
                }
            });
        }
    }
    
    return [{ role: 'user', parts }];
}

/**
 * Generate the Junior's next response based on the teaching so far
 * Uses SYSTEM_JUNIOR_CONFIG for system coding problems, LEETCODE_JUNIOR_CONFIG for LeetCode
 * Supports multimodal content (text + whiteboard drawings)
 */
export async function getJuniorResponse(
    problem: BlindProblem,
    teachingHistory: TeachingTurn[],
    currentState: JuniorState
): Promise<{ response: string; newState: JuniorState; isComplete: boolean }> {
    // Select the appropriate Junior config based on problem type
    const juniorConfig = problem.isSystemCoding ? SYSTEM_JUNIOR_CONFIG : LEETCODE_JUNIOR_CONFIG;
    
    const prompt = juniorConfig.generateResponsePrompt(problem, teachingHistory, currentState);
    
    // Check if there are any images in the teaching history
    const hasImages = teachingHistory.some(turn => turn.imageBase64);
    
    // Build content - use multimodal format if images exist
    const contents = hasImages 
        ? buildMultimodalContent(prompt, teachingHistory)
        : prompt;

    const response = await ai.models.generateContent({
        model: juniorConfig.model,
        contents,
        config: {
            systemInstruction: juniorConfig.systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: GeminiType.OBJECT,
                properties: {
                    response: { type: GeminiType.STRING },
                    newState: {
                        type: GeminiType.OBJECT,
                        properties: {
                            currentUnderstanding: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                            confusionPoints: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                            likelyMisimplementations: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                            readyToSummarize: { type: GeminiType.BOOLEAN }
                        },
                        required: ['currentUnderstanding', 'confusionPoints', 'likelyMisimplementations', 'readyToSummarize']
                    },
                    isComplete: { type: GeminiType.BOOLEAN }
                },
                required: ['response', 'newState', 'isComplete']
            }
        }
    });

    const result = JSON.parse(response.text);
    
    if (problem.isSystemCoding) {
        console.log('[TeachBack] Using System Junior for system coding problem');
    }
    if (hasImages) {
        console.log('[TeachBack] Sent multimodal content with images to Gemini');
    }
    
    return {
        response: result.response,
        newState: result.newState,
        isComplete: result.isComplete
    };
}

/**
 * Generate the Junior's final summary after they understand the solution
 */
export async function getJuniorSummary(
    problem: BlindProblem,
    teachingHistory: TeachingTurn[]
): Promise<string> {
    const prompt = JUNIOR_CONFIG.generateSummaryPrompt(problem, teachingHistory);

    const response = await ai.models.generateContent({
        model: JUNIOR_CONFIG.model,
        contents: prompt,
        config: {
            systemInstruction: JUNIOR_CONFIG.systemPrompt
        }
    });

    return response.text || "I think I understand it now, but I'm having trouble putting it into words.";
}

// ============================================================
// DEAN EVALUATION FUNCTIONS
// ============================================================

/**
 * Have the Dean evaluate the complete teaching session
 * Uses SYSTEM_DEAN_CONFIG for system coding problems, LEETCODE_DEAN_CONFIG for LeetCode
 */
export async function evaluateTeaching(
    problem: BlindProblem,
    session: TeachingSession
): Promise<TeachingReport> {
    // Select the appropriate Dean config based on problem type
    const deanConfig = problem.isSystemCoding ? SYSTEM_DEAN_CONFIG : LEETCODE_DEAN_CONFIG;
    
    if (problem.isSystemCoding) {
        console.log('[TeachBack] Using System Dean to evaluate system coding teaching');
    }
    
    const prompt = deanConfig.generateEvaluationPrompt(problem, session);

    const response = await ai.models.generateContent({
        model: deanConfig.model,
        contents: prompt,
        config: {
            systemInstruction: deanConfig.systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: GeminiType.OBJECT,
                properties: {
                    teachingScore: { type: GeminiType.INTEGER },
                    breakdown: {
                        type: GeminiType.OBJECT,
                        properties: {
                            clarity: { type: GeminiType.INTEGER },
                            correctness: { type: GeminiType.INTEGER },
                            completeness: { type: GeminiType.INTEGER },
                            studentMastery: { type: GeminiType.INTEGER },
                            scaffolding: { type: GeminiType.INTEGER }
                        },
                        required: ['clarity', 'correctness', 'completeness', 'studentMastery', 'scaffolding']
                    },
                    factualErrors: {
                        type: GeminiType.ARRAY,
                        items: {
                            type: GeminiType.OBJECT,
                            properties: {
                                whatTeacherSaid: { type: GeminiType.STRING },
                                whatIsCorrect: { type: GeminiType.STRING },
                                whyItMatters: { type: GeminiType.STRING }
                            },
                            required: ['whatTeacherSaid', 'whatIsCorrect', 'whyItMatters']
                        }
                    },
                    dialogueAnnotations: {
                        type: GeminiType.ARRAY,
                        items: {
                            type: GeminiType.OBJECT,
                            properties: {
                                turnIndex: { type: GeminiType.INTEGER },
                                speaker: { type: GeminiType.STRING },
                                annotation: { type: GeminiType.STRING },
                                issueType: { type: GeminiType.STRING }
                            },
                            required: ['turnIndex', 'speaker', 'annotation']
                        }
                    },
                    evidenceNotes: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                    topGaps: { type: GeminiType.ARRAY, items: { type: GeminiType.STRING } },
                    concreteImprovement: { type: GeminiType.STRING },
                    studentOutcome: { type: GeminiType.STRING },
                    juniorSummaryCorrect: { type: GeminiType.BOOLEAN }
                },
                required: ['teachingScore', 'breakdown', 'factualErrors', 'dialogueAnnotations', 'evidenceNotes', 'topGaps', 'concreteImprovement', 'studentOutcome', 'juniorSummaryCorrect']
            }
        }
    });

    const result = JSON.parse(response.text);
    
    // Ensure studentOutcome is a valid value
    const validOutcomes = ['can_implement', 'conceptual_only', 'still_confused'];
    if (!validOutcomes.includes(result.studentOutcome)) {
        result.studentOutcome = 'conceptual_only';
    }
    
    // Ensure factualErrors is always an array
    if (!result.factualErrors) {
        result.factualErrors = [];
    }
    
    // Ensure dialogueAnnotations is always an array
    if (!result.dialogueAnnotations) {
        result.dialogueAnnotations = [];
    }

    return result as TeachingReport;
}

// ============================================================
// TEXT-TO-SPEECH FUNCTIONS
// ============================================================

/**
 * Speak the Junior's response using Web Speech API
 * Configured to sound like a young, casual junior engineer
 */
export function speakJuniorResponse(text: string): Promise<void> {
    return new Promise((resolve) => {
        if (!('speechSynthesis' in window)) {
            console.warn('Text-to-speech not supported in this browser');
            resolve();
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        
        // Find a young, casual-sounding voice
        // Prioritize voices that sound younger and more natural
        const preferredVoice = voices.find(v => 
            // Young-sounding macOS voices
            v.name === 'Karen' ||           // Australian, sounds young
            v.name === 'Moira' ||            // Irish, casual
            v.name === 'Tessa' ||            // South African
            v.name === 'Fiona' ||            // Scottish
            v.name.includes('Samantha')      // Default macOS, fairly natural
        ) || voices.find(v =>
            // Fallbacks
            v.name.includes('Google US English Female') ||
            v.name.includes('Microsoft Aria') ||
            (v.lang.startsWith('en') && v.localService && v.name.includes('Female'))
        ) || voices.find(v =>
            v.lang.startsWith('en-') && v.localService
        );

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Make it sound more conversational and young
        utterance.rate = 1.05;   // Slightly faster = more casual, energetic
        utterance.pitch = 1.15;  // Slightly higher pitch = younger sounding
        utterance.volume = 1.0;

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (e) => {
            console.error('TTS error:', e);
            resolve(); // Don't reject, just continue
        };

        window.speechSynthesis.speak(utterance);
    });
}

/**
 * Stop any ongoing TTS
 */
export function stopSpeaking(): void {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// ============================================================
// TRANSCRIPT REFINEMENT
// ============================================================

/**
 * Refine raw speech-to-text transcript for teaching context
 * IMPORTANT: This should be MINIMAL refinement - only fix transcription errors,
 * never remove or condense content, especially examples and traces.
 */
export async function refineTeachingTranscript(
    rawTranscript: string, 
    problemTitle: string
): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a transcript cleaner. Your job is to fix speech-to-text errors while preserving ALL content.

Problem being taught: ${problemTitle}

## CRITICAL RULES - DO NOT VIOLATE:
1. **NEVER remove or condense content** - Every idea the speaker expressed must remain
2. **NEVER summarize** - Keep all details, even if verbose
3. **PRESERVE ALL EXAMPLES** - Step-by-step traces, specific values, walkthrough examples are ESSENTIAL
4. **PRESERVE ALL BRACKET/PARENTHESIS EXAMPLES** - Like "open paren, open bracket, close paren" or "([)]" - these are critical teaching examples

## What TO fix:
- Fix technical terms: "hash mop" → "hash map", "oh of en" → "O(n)", "die namic" → "dynamic"
- Fix bracket transcription: "open paren" → "(", "close bracket" → "]", etc.
- Remove ONLY pure filler sounds: "um", "uh", "ah"
- Fix obvious grammar errors

## What NOT to do:
- DO NOT remove repetition (the speaker may be emphasizing)
- DO NOT condense multiple sentences into one
- DO NOT remove "like", "so", "you know" if they're part of explanations
- DO NOT remove example walkthroughs even if they seem verbose
- DO NOT shorten step-by-step traces

Raw transcript: "${rawTranscript}"

Return the cleaned transcript. It should be roughly the same length as the input.`
    });

    return response.text || rawTranscript;
}

// ============================================================
// SESSION MANAGEMENT HELPERS
// ============================================================

/**
 * Create a new teaching session
 */
export function createTeachingSession(problemId: string): TeachingSession {
    return {
        problemId,
        turns: [],
        juniorState: getInitialJuniorState(),
        juniorSummary: undefined
    };
}

/**
 * Add a turn to the teaching session
 */
export function addTurn(
    session: TeachingSession, 
    speaker: 'teacher' | 'junior', 
    content: string,
    rawContent?: string, // Original unrefined transcript (for debugging)
    imageBase64?: string // Optional whiteboard/Excalidraw image
): TeachingSession {
    return {
        ...session,
        turns: [
            ...session.turns,
            {
                speaker,
                content,
                rawContent,
                timestamp: Date.now(),
                imageBase64
            }
        ]
    };
}

/**
 * Update the junior's state in the session
 */
export function updateJuniorState(
    session: TeachingSession,
    newState: JuniorState
): TeachingSession {
    return {
        ...session,
        juniorState: newState
    };
}

/**
 * Set the junior's final summary
 */
export function setJuniorSummary(
    session: TeachingSession,
    summary: string
): TeachingSession {
    return {
        ...session,
        juniorSummary: summary
    };
}
