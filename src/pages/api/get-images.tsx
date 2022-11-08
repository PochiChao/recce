// This calls Bing Image Search to provide 1 image per query
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

let config = {
    headers : {
        "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY,
    }
}


// Figure out a way to change the search term based on a state variable in the app.

const getImages = async( req: NextApiRequest, res: NextApiResponse) => {
    
    let term = req.body.term + " " + req.body.genre;
    let url = "https://api.bing.microsoft.com/v7.0/images/search?q=" + encodeURIComponent(`${term}`) + "&count=1&offset=0";

    await axios.get(url, config)
    .then((response) => {
        res.send(response.data.value[0].contentUrl);
        console.log(response.data.value[0].contentUrl);
    });
}

export default getImages;   