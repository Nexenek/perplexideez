import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import type { ChatOllama } from "@langchain/ollama";
import type { ChatOpenAI } from "@langchain/openai";

const stringParser = new StringOutputParser();

export const generateTitle = async (
  llm: ChatOllama | ChatOpenAI,
  query: string,
  result: string
) => {
  const titleGenerationChain = createTitleGenerationChain(llm, query, result);
  const title = await titleGenerationChain.invoke({});
  return title;
};

export const createTitleGenerationChain = (
  llm: ChatOllama | ChatOpenAI,
  query: string,
  result: string
) => {
  llm.temperature = 0;

  return RunnableSequence.from([
    PromptTemplate.fromTemplate(titleGenerationPrompt(query, result)),
    llm,
    stringParser,
  ]).withConfig({
    runName: "TitleGenerator",
  });
};

const titleGenerationPrompt = (query: string, result: string) => `
You are an AI agent that generates titles for web searches and their summarised result. Your will be given a query and the summarised search result. Your task is to generate a title for the search result. The title should be concise and informative. You can use the query and the search result to generate the title. The title should be between 5 and 20 words long.
You must always return a title, even if the search result is empty. If the search result is empty, you can use the query to generate the title. If the search result is not empty, you can use the query and the search result to generate the title. Do not return the query as the title. The title should be a summary of the search topic. Do not include any personal opinions in the title. The title should be neutral and informative. Do not return anything that isn't the title.
There are several examples attached for your reference inside the below \`example\` XML block. Inside the \`example\` XML block, there will be an \`query\` XML block that contains the user's query. Then there will be a \`result\` XML block that contains the summarised search result. The title generated by the AI agent will be inside the \`title\` XML block. You can refer to these examples to understand the task better. Respond only with the \`title\` XML block.

<example>
<query>
What is SvelteKit?
</query>
<result>
**SvelteKit: A Modern Web Framework**

SvelteKit is an application framework powered by Svelte, a compiler that converts components into JavaScript. It's designed to simplify web development with Svelte, making it easier to build complex applications.

* SvelteKit is built on top of Svelte and provides powerful features like server-side rendering (SSR), code splitting, file-based routing, and API routes [1].
* It's a modern web framework that empowers developers to create lightning-fast and highly responsive web applications with ease [3].
* SvelteKit is the successor to Sapper, the previous generation of the full-stack prerendering framework for Svelte [5].

**Key Features**

SvelteKit offers an impressive array of tools and features, including:

* Server-side rendering (SSR) for faster page loads
* Code splitting for efficient resource management
* File-based routing for easy navigation
* API routes for seamless data integration

**Purpose**

The primary purpose of SvelteKit is to solve the tricky problems of building something production-ready. It's designed to help developers create complex applications with ease, using a lightweight and versatile package [7].

**Relationship with Svelte**

SvelteKit is closely tied to Svelte, a UI component framework that developers love for its performance and ease of use. While Svelte is a component framework, SvelteKit adds production-grade requirements to the bundle [12].

References:

[1] - SvelteKit is a new framework that simplifies web development with Svelte, a compiler that converts components into JavaScript.
[3] - SvelteKit is a modern web framework that empowers developers to create lightning-fast and highly responsive web applications with ease.
[5] - SvelteKit is the successor to Sapper, the previous generation of the full-stack prerendering framework for Svelte.
[7] - SvelteKit is an app framework (or 'metaframework', depending on who you ask) that solves the tricky problems of building something production-ready.
[12] - Svelte is the UI library while SvelteKit adds production-grade requirements to the bundle such as routing, data fetching, build optimization, ...
</result>

<title>
SvelteKit: A Modern Web Framework
</title>
</example>

<example>
<query>
What are the origins of the word joke?
</query>

<result>
The origin of the word "joke" can be traced back to Middle English and Dutch.

* The word "joke" originates from the Middle English term "jopen," meaning "to jest or talk idly." This is believed to have derived from the Middle Dutch word "jopen," which has a similar meaning [1].
* The earliest known use of the noun joke is in the late 1600s, with OED's earliest evidence for joke being from 1670, in the writing of John Eachard, college head [2].
* The word "joke" is apparently a borrowing from Latin, with its etymon being the Latin word "jocus," meaning "a jest or joke" [3].

In summary, the origins of the word "joke" are rooted in Middle English and Dutch, with influences from Latin.

References:
[1] - Context 1
[2] - Context 2
[3] - Context 3
</result>

<title>
The Origins of the Word "Joke"
</title>
</example>

<example>
<query>
What is cheese?
</query>

<result>
**What is Cheese?**

Cheese is a dairy product made from milk, which has been coagulated and separated into solid parts (curd) and liquid parts (whey). This process involves adding acid or bacteria to the milk, causing it to curdle and separate into its components. The resulting cheese can be classified into various types based on factors such as texture, flavor, and production methods.

**Types of Cheese**

There are over 2,000 different types of cheese, ranging from soft and semi-hard cheeses like mozzarella and feta, to hard block cheeses like Parmigiano-Reggiano and aged cheddar. The nutritional profiles of these cheeses vary accordingly, with some being rich in protein, fats, and minerals.

**Production Process**

Cheese is made by combining milk with salt, live cultures, and an acid or enzyme called rennet. This process involves several steps, including:

* Coagulation: Milk is coagulated using acid or bacteria to separate it into curd and whey.
* Curdling: The curd is then cut and stirred to release more whey and create a smooth texture.
* Shaping: The curd is molded into its desired shape, such as a wheel or block.
* Aging: The cheese is left to age, which allows the flavors and textures to develop.

**Nutritional Benefits**

Cheese is a nutrient-dense dairy food, providing protein, fats, and minerals. It is also rich in vitamins and other nutrients, making it a popular choice for many people worldwide.

References:

* [1] Cheese is defined as a fresh or matured product obtained from milk coagulation... (Context 1)
* [3] During production, milk is usually acidified and either the enzymes of ... (Context 3)
* [10] Produced from the milk of farm animals, cheese is made by combining milk with salt, live cultures and an acid or enzyme called rennet. (Context 10)
* [11] There are many different ways to classify cheeses... (Context 11)
</result>

<title>
Cheese: A Dairy Product Made from Milk
</title>
</example>

Everything below is the actual data you will be working with. Good luck!

<query>
${query}
</query>

<result>
${result}
</result>
`;
