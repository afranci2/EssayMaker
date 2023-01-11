import express from 'express';
//imports everything as dotenv. gets data from the env file we made
import * as dotenv from 'dotenv';
//for cross origin requests
import cors from 'cors';
//open ai
import { Configuration, OpenAIApi } from 'openai';

//to start use of env variables
dotenv.config();

//added at the end
console.log(process.env.API);


//function that accepts an object where we pass api key that is equal to 'process.env.[variable used in env]'
const configuration = new Configuration({
    apiKey: process.env.API,
});

console.log(configuration.apiKey);


//create instance of open ai we imported where we pass in the configuration we made
const openai = new OpenAIApi(configuration);

//initialize express backend application
const app = express();
//register middlewares with use method on express
//cors allows cross origin requests and to be called from front end
app.use(cors());
//allows to pass json from front end to back end
app.use(express.json());


//difference between app.get and app.post
//app.get route cant receive data from front end
//app.post allows us to have body or payload


//dummy root route
//async function that accepts request and response
//returns res.status(200) and message
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex',
    })
})

//route of '/'
//accepts request and response same as before
//get data from body of front end
//add try and catch 

/* 

app.post('/', async (req, res) => {
    res.status(200).send({
        "key1":"hello",
        "key2":"hi"
    })
})*/

app.post('/', async (req, res) => {
    try {
        //get prompt from front end 
        const prompt = req.body.prompt;
        const parameters = req.body.parameters;


        //create response from openai
        //read docs
                const response = await openai.createCompletion({
                    //parameters to pass in to model of openai
                    model: "text-davinci-003",
                    prompt: `${prompt}`,
                    //takes more risks (.3-1)
                    temperature: 1,
                    //long response (100-10000)
                    max_tokens: 3000,
                    top_p: 1,
                    //it wont repeat similar sentences often (higher means less likely to say similar thing)
                    frequency_penalty: parameters.frequencyPenalty,
                    presence_penalty:  parameters.presencePenalty,
                })
                console.log(response);
                console.log(parameters.presencePenalty)

                //send response to front end
                res.status(200).send({
                    bot: response.data.choices[0].text
                })
            }
            catch {
                console.log(error);
                //send error
                res.status(500).send(error || "Something went wrong in the prompt catch");
                console.log("something went wrong in the prompt catch")
            }
})


//make sure app always  for req
//callback function to let know we have 
app.listen(5010, () => console.log('Server is running on port http://localhost:5010'));