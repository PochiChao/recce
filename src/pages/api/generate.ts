import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "assistant",
        content: generatePrompt(req.body.selected, req.body.recomRefine),
      },
    ],
    temperature: 0.8,
    max_tokens: 300,
  });
  // console.log(completion.config.data);
  res
    .status(200)
    .json({ result: completion.data.choices![0]!.message!.content });
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
  return `Provide 3 recommendations for ${selected.name} like ${
    recomRefine.recommendation
  }. 
  Provide a brief description (1-3 sentences) of each recommendation. The recommendations 
  cannot include ${recomRefine.recommendation} but must be similar to ${
    recomRefine.recommendation
  } and 
  MUST BE ${selected.name}s (e.g. if ${
    recomRefine.recommendation
  } is a book, the recommendations must be books).
  The recommendations should meet the following requirements: ${
    recomRefine.refinement !== ""
      ? recomRefine.refinement
      : "no other requirements"
  }.
  
  Follow the format below for the appropriate MEDIA TYPE:
  If MEDIA TYPE is BOOK: [Recommendation] | [Author] | [Year Published] | [Brief Description] 
  If MEDIA TYPE is POEM: [Recommendation] | [Author] | [Year Published] | [Brief Description]
  If MEDIA TYPE is MOVIE: [Recommendation] | [Director] | [Year Released] | [Brief Description] 
  If MEDIA TYPE is TV SHOW: [Recommendation] | [Author] | [Years Active] | [Brief Description]
  If MEDIA TYPE is MANGA: [Recommendation] | [Author, Artist] | [Years Published] | [Brief Description] 
  If MEDIA TYPE is GAME: [Recommendation] | [Developer Company] | [Year Released] | [Brief Description]
  
  ###### START OF EXAMPLE #1 ###### 
  MEDIA TYPE: Book
  REFERENCE: Where the Crawdads Sing
  SEARCH REFINEMENT: less than 500 pages, written in the past 100 years
  
  1. All the Single Ladies: Unmarried Women and the Rise of an Independent Nation | Rebecca Traister | 2016| A New York Times bestseller, All the Single Ladies is a remarkable portrait of how single women have shaped our nation over the past two centuries. 
  2. The Sun Does Shine: How I Found Life and Freedom on Death Row | Anthony Ray Hinton | 2018 | The Sun Does Shine is an extraordinary memoir of hope and triumph from a man who spent thirty years on death row for a crime he didn't commit. 
  3. Just Mercy: A Story of Justice and Redemption | Bryan Stevenson | 2014 | A powerful true story about the potential for mercy to redeem us, and a clarion call to fix our broken system of justice—from one of the most brilliant and influential lawyers of our time.
  ###### END OF EXAMPLE #1 ###### 
  
  ###### START OF EXAMPLE #2 ###### 
  MEDIA TYPE: Movie
  REFERENCE: Lord of the Rings: Fellowship of the Ring
  SEARCH REFINEMENT: fantasy, less than 3 hours long, originally released in the last 50 years
  
  1. The Chronicles of Narnia: The Lion, the Witch, and the Wardrobe | Andrew Adamson | 2005 | A tale of good versus evil, The Chronicles of Narnia: The Lion, the Witch, and the Wardrobe is a classic fantasy film that is sure to enchant viewers of all ages. 
  2. The Hobbit: An Unexpected Journey | Peter Jackson | 2012 | The first installment of Peter Jackson's The Hobbit trilogy, An Unexpected Journey follows the story of Bilbo Baggins as he is swept up into an adventure with a group of dwarves. 
  3. Harry Potter and the Philosopher's Stone | Chris Columbus | 2001 | The first film in the Harry Potter series, Harry Potter and the Philosopher's Stone introduces viewers to the Wizarding World and the young wizard Harry Potter.
  ###### END OF EXAMPLE #2######
  
  ###### START OF EXAMPLE #3 ###### 
  MEDIA TYPE: Poem
  REFERENCE: Lady Lazarus
  SEARCH REFINEMENT: originally written in the last 100 years
  
  1. The Waste Land | T.S. Eliot | 1922 | The Waste Land is a modernist poem by T.S. Eliot that reflects on the disillusionment of the post-World War I generation. 
  2. The Love Song of J. Alfred Prufrock | T.S. Eliot | 1915 | The Love Song of J. Alfred Prufrock is a poem by T.S. Eliot that is known for its stream-of-consciousness style. 
  3. To His Coy Mistress | Andrew Marvell | 1681 | To His Coy Mistress is a metaphysical poem by Andrew Marvell that addresses the theme of carpe diem.
  ###### END OF EXAMPLE #3 ######
  
  ###### START OF EXAMPLE #4 ###### 
  MEDIA TYPE: Games
  REFERENCE: Call of Duty 4: Modern Warfare
  SEARCH REFINEMENT: First Person Shooter, combat, highly rated, released in the past 10 years
  
  1. Halo 5: Guardians | 343 Industries | 2015 | Halo 5: Guardians is a first-person shooter video game developed by 343 Industries and published by Microsoft Studios for the Xbox One. 
  2. Gears of War 4 | The Coalition | 2016 | Gears of War 4 is a third-person shooter video game developed by The Coalition and published by Microsoft Studios for Microsoft Windows and Xbox One. 
  3. Battlefield 1 | DICE | 2016 | Battlefield 1 is a first-person shooter video game developed by EA DICE and published by Electronic Arts.
  ###### END OF EXAMPLE #4 ######
  
  ###### START OF EXAMPLE #5 ######
  MEDIA TYPE: Manga
  REFERENCE: Sousou no Frieren
  SEARCH REFINEMENT: great art, highly rated, not one of the most popular series
  
  1. Kaze Hikaru | Taeko Watanabe | 1994-2010 | Set during the Bakumatsu period in Japan, Kaze Hikaru follows the story of Tominaga Sei, a young woman who disguises herself as a man in order to fight as a samurai. 
  2. Ooku: The Inner Chambers | Fumi Yoshinaga | 2006-2010 | Ooku: The Inner Chambers is an alternate history manga set in the Edo period of Japan in which the majority of the population is female and men are relegated to a secondary role. 
  3. Natsume's Book of Friends | Yuki Midorikawa | 2005-ongoing | Natsume's Book of Friends is a manga series about a boy who inherits a book of names from his grandmother, who was a yokai spirit medium.
  ###### END OF EXAMPLE #5 ######
  
  ###### START OF EXAMPLE #6 ######
  MEDIA TYPE: TV Show
  REFERENCE: The Last Dance
  SEARCH REFINEMENT: highly rated, sports documentary, non-fiction
  
  1. Cheer | Greg Whiteley | 2020 | Cheer is a documentary series that follows the Navarro College cheerleaders as they prepare for the national championships. 
  2. The Test: A New Era for Australia's Team | Tim Paine | 2020 | The Test is a documentary series that follows the Australian cricket team during the 2018-2019 cricket season. 
  3. All or Nothing: Manchester City | Roger Bennett | 2018 | All or Nothing is a documentary series that follows Manchester City during the 2017-2018 Premier League season.
  ###### END OF EXAMPLE #6 ######
  
  
  ###### START OF EXAMPLE #7 ###### 
  MEDIA TYPE: TV Show
  REFERENCE: Succession
  SEARCH REFINEMENT: highly rated, originally released in the last 20 years, corporate, family drama
  
  1. Billions | Brian Koppelman, David Levien, Andrew Ross Sorkin | 2016-present | Billions is a television drama series that follows the story of two rival hedge fund managers who are engaged in a bitter feud. 
  2. The Crown | Peter Morgan | 2016-present | The Crown is a historical drama television series that follows the life of Queen Elizabeth II from her wedding in 1947 to the present day. 
  3. Mad Men | Matthew Weiner | 2007-2015 | Mad Men is a period drama television series that follows the lives of the employees of an advertising agency in New York City during the 1960s.
  ###### END OF EXAMPLE #7 ######

###### START OF INPUT ###### 
MEDIA TYPE: ${selected.name}
REFERENCE: ${recomRefine.recommendation}
SEARCH REFINEMENT: ${recomRefine.refinement}
###### END OF INPUT ###### 

`;
}
