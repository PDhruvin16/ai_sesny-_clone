// utils/parseTemplates.js
// utils/parseTemplates.js

export const parseTemplates = (apiData) => {
    return apiData.result.map(template => {
      const components = template.components || [];
  
      const header = components.find(c => c.type === 'HEADER')?.text || '';
      const body = components.find(c => c.type === 'BODY')?.text || '';
      // const footer = components.find(c => c.type === 'FOOTER')?.text || '';
      const footer = typeof components.find(c => c.type === 'FOOTER')?.text === 'string'
      ? components.find(c => c.type === 'FOOTER')?.text
      : ''; // Ensure footer is a string

      const buttonComponent = components.find(c => c.type === 'BUTTONS');
      const buttons = buttonComponent?.buttons?.map(btn => ({
        text: btn.text,
        type: btn.type,
        url: btn.url || null,
      })) || [];
  
      return {
        id: template.id,
        name: template.name,
        header,
        body,
        footer,
        buttons,
      };
    });
  };
  

  export const parseChatbots = (apiData) => {
    return apiData.map(chatbot => ({
      id: chatbot._id,
      name: chatbot.chatbot_name,
      description: chatbot.description,
      source: chatbot.sourceBy,
      createdAt: chatbot.createdAt,
      updatedAt: chatbot.updatedAt,
    }));
  };