const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
const os = require('os');

class AIService {
  static openai = null;

  // Initialize OpenAI client
  static initialize() {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is required');
      }
      const configuration = new Configuration({
        apiKey: apiKey,
        organization: process.env.OPENAI_ORG_ID
      });
      this.openai = new OpenAIApi(configuration);
    }
  }

  // Transcribe audio using Whisper API
  static async transcribeAudio(audioBuffer, language = 'english') {
    let tempFilePath = null;

    try {
      this.initialize();

      // Validate audio buffer
      if (!audioBuffer || audioBuffer.length === 0) {
        throw new Error('Audio buffer is empty. Please record audio before submitting.');
      }

      console.log('Starting Whisper transcription. Buffer size:', audioBuffer.length, 'bytes');

      // Determine language code for Whisper
      const languageCode = this.getLanguageCode(language);

      // Write buffer to temporary file
      const tempDir = os.tmpdir();
      const timestamp = Date.now();
      tempFilePath = path.join(tempDir, `audio-${timestamp}.wav`);

      fs.writeFileSync(tempFilePath, audioBuffer);
      console.log('Wrote audio buffer to temp file:', tempFilePath);

      console.log('Calling OpenAI Whisper API with language:', languageCode);

      // Call OpenAI Whisper API with explicit language parameter
      const transcription = await this.openai.createTranscription(
        fs.createReadStream(tempFilePath),
        'whisper-1',
        languageCode, // Pass language code ('en' for English) explicitly to Whisper
        'json'
      );

      if (!transcription || !transcription.data || !transcription.data.text) {
        throw new Error('Whisper API returned empty transcription');
      }

      console.log('Transcription successful. Text length:', transcription.data.text.length);

      return {
        transcript: transcription.data.text,
        confidence: 0.9
      };
    } catch (error) {
      console.error('Whisper API error:', error);

      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();

        if (errorMsg.includes('401') || errorMsg.includes('unauthorized') || errorMsg.includes('api_key')) {
          console.error('Authentication failed - check OPENAI_API_KEY');
          throw new Error('Invalid OpenAI API key. Please check your configuration.');
        } else if (errorMsg.includes('429') || errorMsg.includes('rate_limit')) {
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        } else if (errorMsg.includes('413') || errorMsg.includes('too large')) {
          throw new Error('Audio file too large. Please record a shorter audio clip.');
        }

        throw new Error(`Failed to transcribe: ${error.message}`);
      }

      throw new Error('Failed to transcribe audio. Please try again.');
    } finally {
      // Clean up temporary file
      if (tempFilePath) {
        try {
          fs.unlinkSync(tempFilePath);
          console.log('Cleaned up temp file:', tempFilePath);
        } catch (unlinkError) {
          console.error('Failed to clean up temp file:', unlinkError);
        }
      }
    }
  }

  // Helper method to convert language names to Whisper language codes
  static getLanguageCode(language) {
    const languageMap = {
      'english': 'en',
      'french': 'fr',
      'swahili': 'sw',
      'spanish': 'es',
      'german': 'de',
      'en': 'en',
      'fr': 'fr',
      'sw': 'sw'
    };

    return languageMap[language.toLowerCase()] || 'en';
  }

  // More realistic feedback generation with better grading
  static async generateFeedback(originalScript, userTranscript, duration = 10) {
    try {
      console.log('Generating realistic feedback...');

      // Calculate detailed metrics
      const metrics = this.calculateDetailedMetrics(originalScript, userTranscript, duration);

      console.log('Feedback metrics:', metrics);

      return {
        overallScore: `${metrics.overallScore}%`,
        pronunciationScore: `${metrics.pronunciationScore}%`,
        fluencyScore: `${metrics.fluencyScore}%`,
        accuracyScore: `${metrics.accuracyScore}%`,
        comments: metrics.comments,
        wordsPerMinute: `${metrics.wordsPerMinute} WPM`
      };
    } catch (error) {
      console.error('Feedback generation error:', error);
      throw new Error('Failed to generate feedback');
    }
  }

  // Calculate realistic metrics - Simplified clean approach
  static calculateDetailedMetrics(originalScript, userTranscript, duration) {
    // Helper function to strip punctuation from words
    const stripPunctuation = (word) => {
      return word.replace(/[^\w]/g, '').toLowerCase();
    };

    // Parse words from original script (punctuation independent)
    const originalWords = originalScript.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => stripPunctuation(word))
      .filter(word => word.length > 0);

    // Parse words from user transcript (punctuation independent)
    const userWords = userTranscript.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => stripPunctuation(word))
      .filter(word => word.length > 0);

    // 1. Calculate accuracy (word match percentage) - punctuation independent
    const matchedWords = userWords.filter(word => originalWords.includes(word)).length;
    const accuracy = originalWords.length > 0 
      ? Math.min(100, (matchedWords / originalWords.length) * 100)
      : 0;

    // 2. Calculate words per minute
    const wordsPerMinute = duration > 0 
      ? Math.round((userWords.length / duration) * 60)
      : 0;

    // 3. Calculate fluency score (based on accuracy and speech rate)
    // 70% weight on accuracy (reading correctly), 30% weight on speed
    const fluency = Math.min(100, (accuracy * 0.7) + (Math.min(100, wordsPerMinute) * 0.3));

    // 4. Overall score (weighted average)
    // 60% accuracy (most important), 40% fluency (speaking pace)
    const overallScore = Math.round((accuracy * 0.6) + (fluency * 0.4));

    // 5. Generate feedback comments
    const comments = this.generateFeedbackComments(accuracy, fluency, wordsPerMinute);

    return {
      overallScore: Math.max(0, Math.min(100, overallScore)),
      pronunciationScore: Math.max(0, Math.min(100, Math.round(accuracy))), // For UI compatibility
      accuracyScore: Math.max(0, Math.min(100, Math.round(accuracy))),
      fluencyScore: Math.max(0, Math.min(100, Math.round(fluency))),
      wordsPerMinute,
      comments
    };
  }

  // Generate feedback comments (clean and concise)
  static generateFeedbackComments(accuracy, fluency, wordsPerMinute) {
    const comments = [];

    // Accuracy-based feedback
    if (accuracy >= 90) {
      comments.push("Excellent word accuracy!");
    } else if (accuracy >= 70) {
      comments.push("Good accuracy, keep practicing.");
    } else if (accuracy >= 50) {
      comments.push("Focus on word pronunciation.");
    } else {
      comments.push("Review the script carefully.");
    }

    // Fluency-based feedback
    if (fluency >= 85) {
      comments.push("Great speaking pace!");
    } else if (fluency >= 60) {
      comments.push("Work on speaking speed.");
    } else {
      comments.push("Practice reading aloud more.");
    }

    // Word count feedback
    const feedbackComments = comments.slice(0, 2);
    if (feedbackComments.length < 2) {
      feedbackComments.push("Keep up the good work!");
    }

    return feedbackComments;
  }
}

module.exports = AIService;
