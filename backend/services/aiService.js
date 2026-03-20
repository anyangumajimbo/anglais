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

      // Call OpenAI Whisper API
      const transcription = await this.openai.createTranscription(
        fs.createReadStream(tempFilePath),
        'whisper-1',
        undefined,
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

  // Calculate realistic metrics
  static calculateDetailedMetrics(originalScript, userTranscript, duration) {
    // Helper: Levenshtein distance for similarity
    const levenshteinDistance = (str1, str2) => {
      const matrix = [];
      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
      }
      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
      }
      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[str2.length][str1.length];
    };

    // Normalize texts (lowercase, minimal punctuation removal)
    const normalized1 = originalScript.toLowerCase();
    const normalized2 = userTranscript.toLowerCase();

    // 1. Character-level accuracy (Levenshtein similarity)
    const maxLen = Math.max(normalized1.length, normalized2.length);
    const charDist = levenshteinDistance(normalized1, normalized2);
    const characterAccuracy = Math.max(0, 100 - (charDist / maxLen) * 100);

    // 2. Word-level accuracy
    const words1 = normalized1.split(/\s+/).filter(w => w.length > 0);
    const words2 = normalized2.split(/\s+/).filter(w => w.length > 0);
    
    let matchedWords = 0;
    for (const w2 of words2) {
      if (words1.includes(w2)) {
        matchedWords++;
      }
    }
    const wordAccuracy = words1.length > 0 ? (matchedWords / words1.length) * 100 : 0;

    // 3. Completeness (did they read all the words?)
    const completeness = Math.min(100, (words2.length / words1.length) * 100);

    // 4. Words per minute (fluency indicator)
    const wordsPerMinute = duration > 0 ? Math.round((words2.length / duration) * 60) : 0;
    
    // Expected WPM: normal speech = 120-150 WPM
    const fluencyScore = Math.max(0, Math.min(100, 100 - Math.abs(wordsPerMinute - 130) / 1.3));

    // 5. Calculate combined scores
    const pronunciationScore = Math.round((characterAccuracy * 0.7) + (wordAccuracy * 0.3));
    const accuracyScore = Math.round((wordAccuracy * 0.6) + (completeness * 0.4));
    const overallScore = Math.round((pronunciationScore * 0.4) + (accuracyScore * 0.3) + (fluencyScore * 0.3));

    // 6. Generate realistic comments
    const comments = this.generateRealisticComments(
      pronunciationScore,
      accuracyScore,
      fluencyScore,
      wordsPerMinute,
      completeness
    );

    return {
      overallScore: Math.max(0, Math.min(100, overallScore)),
      pronunciationScore: Math.max(0, Math.min(100, pronunciationScore)),
      accuracyScore: Math.max(0, Math.min(100, accuracyScore)),
      fluencyScore: Math.max(0, Math.min(100, fluencyScore)),
      wordsPerMinute,
      comments
    };
  }

  // Generate realistic feedback comments
  static generateRealisticComments(pronunciation, accuracy, fluency, wpm, completeness) {
    const comments = [];

    // Pronunciation feedback
    if (pronunciation >= 85) {
      comments.push('Excellent pronunciation!');
    } else if (pronunciation >= 70) {
      comments.push('Good pronunciation overall.');
    } else if (pronunciation >= 50) {
      comments.push('Work on pronunciation clarity.');
    } else {
      comments.push('Focus on accurate pronunciation.');
    }

    // Accuracy feedback
    if (accuracy >= 85) {
      comments.push('Very accurate word reading!');
    } else if (accuracy >= 70) {
      comments.push('Good accuracy, some missed words.');
    } else if (accuracy >= 50) {
      comments.push('Several words need work.');
    } else {
      comments.push('Review the text carefully.');
    }

    // Fluency & pacing feedback
    if (wpm >= 140) {
      comments.push('Slow down slightly for clarity.');
    } else if (wpm >= 110) {
      comments.push('Good natural pacing!');
    } else if (wpm >= 80) {
      comments.push('Try speaking a bit faster.');
    } else {
      comments.push('Speak more fluently.');
    }

    // Ensure we have exactly 3 comments
    while (comments.length < 3) {
      comments.push('Keep practicing!');
    }

    return comments.slice(0, 3);
  }
}

module.exports = AIService;
