import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getOpenAIResponse = async (input, fileContent) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a personal data file analyst. Write and run code that will clean the uploaded file."
        },
        {
          role: "user",
          content: `Using the data from the uploaded file, answer the following question: ${input}\n\nFile Content:\n${fileContent}`
        }
      ],

    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw new Error('Failed to get response from OpenAI');
  }
};
