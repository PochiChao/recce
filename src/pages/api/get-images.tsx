// This calls Bing Image Search to provide the 1 image per query
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

let config = {
    headers: {
        "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY,
    }
}

let term = "";
let count = 1;
let url = "https://api.bing.microsoft.com/v7.0/images/search?q=" + `count=${count}` + `${term}`;

const getImages = async( req: NextApiRequest, res: NextApiResponse) => {
    await axios.get(url, config)
    .then((response) => {
      res.send(response.data);
    });
}

export default getImages;