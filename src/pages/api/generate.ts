import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req: NextApiRequest, res: NextApiResponse) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(req.body.selected, req.body.recomRefine),
    temperature: 0.4,
    max_tokens: 200,
    n: 1,
  });
  // console.log(completion.config.data);
  res.status(200).json({ result: completion.data.choices![0]!.text });
}

function generatePrompt(
  selected: {
    id: number;
    name: string;
    emoji: string;
  },
  recomRefine: {
    recommendation: string;
    refinement: string;
  }
) {
  return `Provide 3 recommendations for ${selected.name} like ${recomRefine.recommendation}. 
  Provide a brief description (1-3 sentences) of each recommendation. The recommendations 
  cannot include ${recomRefine.recommendation} but must be similar to ${recomRefine.recommendation} and 
  MUST BE ${selected.name}s (e.g. if ${recomRefine.recommendation} is a book, the recommendations must be books).
  The recommendations should meet the following requirements: ${
    recomRefine.refinement !== ""
      ? recomRefine.refinement
      : "no other requirements"
  }.
  
${process.env.TRAINING_DATA}

###### START OF INPUT ###### 
MEDIA TYPE: ${selected.name}
REFERENCE: ${recomRefine.recommendation}
SEARCH REFINEMENT: ${recomRefine.refinement}
###### END OF INPUT ###### 

`
}
