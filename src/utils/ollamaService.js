import axios from 'axios';

const OLLAMA_API_URL = "http://localhost:11434/api/generate";

export const checkOllamaServer = async () => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags');
    return { running: true, models: response.data };
  } catch (error) {
    return { running: false, error: error.message };
  }
};

export const analyzePatientCondition = async (patientData) => {
  const prompt = `
    Act as a medical expert. Analyze the following patient data and provide:
    1. Severity Level (Mild/Moderate/Severe/Critical)
    2. Key Concerns
    3. Recommended Actions
    4. Required Precautions

    Patient Data:
    ${JSON.stringify(patientData, null, 2)}
  `;

  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: "llama2",
      prompt: prompt,
      stream: false
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to analyze patient data: ${error.message}`);
  }
};