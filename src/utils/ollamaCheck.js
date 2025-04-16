import axios from 'axios';

export const checkOllamaStatus = async () => {
  try {
    const response = await axios.get('/api/tags');
    return { running: true, models: response.data };
  } catch (error) {
    return { 
      running: false, 
      error: 'Ollama server is not running. Please start Ollama and try again.' 
    };
  }
};