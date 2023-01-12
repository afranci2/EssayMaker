import bot from './assets/bot.svg';
import user from './assets/user.svg';

var userProfile = {
    assignment: "",
    wordLength: "",
    sections: "",
    styleAndTone: "",
    selectedOutline: "",
    selectedOutlineLength: 0,
    selectedTitle: "",
    targetAudience: "",
    additional: "",
    purpose: "",
    format: "",
    subscribed: true,
    stillPlaying: true,
}

var serverRequest = {
    assignment: [],
    outline: [],
    title: [],
    selectedOutlineLength: [],
}

var serverResponse = {
    title: [],
    outline: [],
    assignment: [],
};
var sectionTrack = 1;
let click = 0;
var subsectionTrack = 0;
var errorCode = 0;


//problems need to solve
// 1. select elements on screen
// 2. make thinkning dots function
// 3. make animation of ai writing
// 4. make unique id to track each response
// 5. function to create new html code to contain response
// 6. function to handle each submission


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

var romanToInt = function (s) {
    var param = function () {
    };
    var count = 0
    var total = 0;
    for (var i = 0; i < s.length; i++) {
        if (s[i] === ".") {
            if(s[i-1] === ("I")){
                count++;
            }
            else if (s[i-1] === ("V")){
                count++;
            }
            else if (s[i-1] === ("X")){
                count++;
            }
            else if (s[i-1] === ("L")){
                count++;
            }
            else if (s[i-1] === ("C")){
                count++;
            }
            else if (s[i-1] === ("D")){
                count++;
            }
            else if (s[i-1] === ("M")){
                count++;
            }
        }
            if (s[i] === "I") {
                total = total + 1;

            }
            else if (s[i] === "V") {
                if (s[i - 1] === "I") {
                    total = total - 2;
                }
                total = total + 5;
            }
            else if (s[i] === "X") {
                if (s[i - 1] === "I") {
                    total = total - 2;
                }
                total = total + 10;
            }
            else if (s[i] === "L") {
                if (s[i - 1] === "X") {
                    total = total - 20;
                }
                total = total + 50;

            }
            else if (s[i] === "C") {
                if (s[i - 1] === "X") {
                    total = total - 20;

                }
                total = total + 100;

            }
            else if (s[i] === "D") {
                if (s[i - 1] === "C") {
                    total = total - 200;

                }
                total = total + 500;

            }
            else if (s[i] === "M") {
                if (s[i - 1] === "C") {
                    total = total - 200;

                }
                total = total + 1000;

            }
        
    }

    return count;
};

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

//function that types text and takes in the html element and the content
function typeText(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;

}
const exampleText = ""

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const addNewElement = (isAi, value, uniqueId) => {
    chatContainer.innerHTML += chatStripe(isAi, value, uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

const handleSubmit1 = async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    let userSubmit = data.get('prompt')
    let uniqueId = generateUniqueId();
    addNewElement(false, userSubmit, uniqueId)
    //get data typed into form
    //turn on loader to show the dots and pass in the div we made before
    if (userProfile.stillPlaying === true) {
        if (sectionTrack === 1 && subsectionTrack === 0) {
            userProfile.assignment = userSubmit;
            //clear text area input. reset method resets to default values on forms and form controls such as inputs
            //make bots chatsripe
            //make bots unique id for message
            const uniqueId = generateUniqueId();
            //make bot chatstripe(pass in true because AI is typing, then pass in empty string because it will be filled up with the loader function, then pass in unique ID)
            addNewElement(true, "What is the word length?", uniqueId);
            //turn the div into something empty because we are not sure at which point in loading we are
            //we could be at one dot or three dots but we want it to be empty
            subsectionTrack++;
        }
        else if (sectionTrack === 1 && subsectionTrack === 1) {
            userProfile.wordLength = userSubmit;
            //make bot chatstripe(pass in true because AI is typing, then pass in empty string because it will be filled up with the loader function, then pass in unique ID)
            addNewElement(true, "What are the headings? If none, click submit.", uniqueId);
            sectionTrack++;
        }
        else if (sectionTrack === 2) {
            addNewElement(true, 'Creating your outline...', uniqueId);

            subsectionTrack = 0;
            //make bot chatstripe(pass in true because AI is typing, then pass in empty string because it will be filled up with the loader function, then pass in unique ID)
            if (!userProfile.sections) {
                serverRequest.outline.push(`Make an outline for an essay based on this prompt (IMPORTANT: When writing the outline, make sure to separate the sections by skipping a line to make the outline readable.): "${userProfile.assignment}" with a word length of ${userProfile.wordLength}`);
                serverRequest.outline.push(`This tool is being used for an essay maker for a web app based on the input of the user (IMPORTANT: When writing the outline, make sure to separate the sections by skipping a line to make the outline readable.). Create an outline for a paper based on this assignment: '${userProfile.assignment}' with a word length of '${userProfile.wordLength}'.`);
                serverRequest.outline.push(`Make an outline for this assignment (IMPORTANT: When writing the outline, make sure to separate the sections by skipping a line to make the outline readable.): '${userProfile.assignment}' that has a word limit or range of ${userProfile.wordLength}`);
                serverRequest.title.push(`Make a title for a paper based on this: '${userProfile.assignment}' that has a word limit or range of ${userProfile.wordLength}`);
                serverRequest.title.push(`This tool is being used for an essay maker for a web app based on the input of the user. Create a title for a paper based on this assignment: '${userProfile.assignment}' with a word length of '${userProfile.wordLength}'.`);
                serverRequest.title.push(`Make a title for this assignment: '${userProfile.assignment}' that has a word limit or range of ${userProfile.wordLength}`);
            }
            else if (userProfile.sections) {
                serverRequest.outline.push(`Make an outline for an essay based on this prompt (IMPORTANT: When writing the outline, make sure to separate the sections by skipping a line to make the outline readable.): "${userProfile.assignment}" with a word length of ${userProfile.wordLength} and with these heading: ${userProfile.sections}`);
                serverRequest.outline.push(`This tool is being used for an essay maker for a web app based on the input of the user (IMPORTANT: When writing the outline, make sure to separate the sections by skipping a line to make the outline readable.). Create an outline for a paper based on this assignment: '${userProfile.assignment}' with a word length of '${userProfile.wordLength}'. These are headings provided by the user: ${userProfile.sections}`);
                serverRequest.outline.push(`Make an outline for this assignment (IMPORTANT: When writing the outline, make sure to separate the sections by skipping a line to make the outline readable.): '${userProfile.assignment}' that has a word limit or range of ${userProfile.wordLength} with these these headings included: ${userProfile.sections}`);
                serverRequest.title.push(`Make a title for a paper based on this: '${userProfile.assignment}' that has a word limit or range of ${userProfile.wordLength} with these these headings: ${userProfile.sections}`);
                serverRequest.title.push(`This tool is being used for an essay maker for a web app based on the input of the user. Create a title for a paper based on this assignment: '${userProfile.assignment}' with a word length of '${userProfile.wordLength}'. These are headings provided by the user: ${userProfile.sections}`);
                serverRequest.title.push(`Make a title for this assignment: '${userProfile.assignment}' that has a word limit or range of ${userProfile.wordLength} with these these headings included: ${userProfile.sections}`);
            }
            console.log(serverRequest)
            errorCode = 1;

            for (var i = 0; i < serverRequest.outline.length; i++) {
                var serverResp = await fetch('https://outline-try.onrender.com', {
                    //object with all the options
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        //pass in object
                        //data/message coming from text area element on screen
                        prompt: serverRequest.outline[i],
                        parameters: {
                            frequencyPenalty: .25,
                            presencePenalty: .5,
                        },
                    })
                })
                if (serverResp.ok) {
                    const data = await serverResp.json()
                    const parsedData = data.bot.trim();
                    console.log(parsedData)
                    serverResponse.outline.push(parsedData);
                    console.log("this is first server response", serverResponse)
                }
                else {
                    const err = await serverResp.text();
                    alert(err);

                }

            }
            //after response


            //after response
            clearInterval(loadInterval);
            //turn the div into something empty because we are not sure at which point in loading we are
            //we could be at one dot or three dots but we want it to be empty

            //



            addNewElement(true, 'Please choose an outline by submitting the number below:', uniqueId);
            sectionTrack++;
            subsectionTrack = 0;
            for (var i = 0; i < serverResponse.outline.length; i++) {
                addNewElement(true, serverResponse.outline[i]);
                console.log("this is roman", romanToInt(serverResponse.outline[i]));


            }



        }
        //section to pick title
        else if (sectionTrack === 3) {
            let outlineOption = userSubmit;
            if (!isNaN(outlineOption) && outlineOption >= 1 && outlineOption <= 3) {
                userProfile.selectedOutline = serverResponse.outline[outlineOption - 1];
                userProfile.selectedOutlineLength = romanToInt(userProfile.selectedOutline)
                addNewElement(true, `Outline ${outlineOption} selected`)
                addNewElement(true, 'Creating your titles...')
                for (let i = 0; i < serverRequest.title.length; i++) {
                    var serverResp1 = await fetch('https://outline-try.onrender.com', {
                        //object with all the options
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            //pass in object
                            //data/message coming from text area element on screen
                            prompt: serverRequest.title[i],
                            parameters: {
                                frequencyPenalty: .25,
                                presencePenalty: .5,
                            },
                        })
                    })
                    if (serverResp1.ok) {
                        const data = await serverResp1.json()
                        const parsedData = data.bot.trim();
                        console.log(parsedData)
                        serverResponse.title.push(parsedData);
                    }
                    else {
                        const err = await serverResponse.title[i].text();
                        alert(err);
                    }
                }
                addNewElement(true, 'Choose a title')
                for (var i = 0; i < serverResponse.outline.length; i++) {
                    addNewElement(true, serverResponse.title[i])
                }
                sectionTrack++;
            }
            else {
                addNewElement(true, `Please input a number from 1-3.`)
                console.error("Please input a number");

            }
            subsectionTrack = 0;
            console.log(sectionTrack, subsectionTrack)
        }
        else if (sectionTrack === 4) {
            if (sectionTrack === 4 && subsectionTrack === 0) {
                if (!isNaN(userSubmit) && userSubmit >= 1 && userSubmit <= 3) {
                    userProfile.selectedTitle = serverResponse.title[userSubmit - 1];
                    form.reset();
                    addNewElement(true, `Title ${userSubmit} selected`)
                    if (userProfile.subscribed === true) {
                        addNewElement(true, 'Would you like to receive essay or input more parameters? Type 1 for first option and 2 for second.')
                        subsectionTrack++;
                    }
                    else {
                        addNewElement(true, "Please subscribe to receive your essay")

                    }
                }
                else {

                    addNewElement(true, 'Please input a number from 1-3')

                    console.error("Please input a number");

                }
            } else if (sectionTrack === 4 && subsectionTrack === 1) {
                if (!isNaN(userSubmit) && userSubmit >= 1 && userSubmit <= 2) {
                    if (userSubmit === "1") {
                        addNewElement(true, 'Your essay is loading...')
                        console.log(userProfile.selectedOutlineLength.length)
                        for (var i = 1; i < userProfile.selectedOutlineLength.length + 1; i++) {
                            serverRequest.assignment.push(`Write only section ${i} of this outline based on this assignment "${userProfile.assignment}" with a word length of '${userProfile.wordLength}' based off of this outline: '${userProfile.selectedOutline}'.'`);
                        }
                        console.log(userProfile)
                        console.log("this is after /serverRequest", serverRequest)
                        console.log("this is after /serverResponse", serverResponse)
                        //serverRequest.assignment.push(`This tool is being used for an essay maker for a web app based on the input of the user. Create a paper based on this assignment: '${userProfile.assignment}' with a word length of '${userProfile.wordLength}'. These are headings and organization provided by CHATGPT for this essay: '${userProfile.selectedOutline}'. Include this title at the beginning: '${userProfile.selectedTitle}'`);
                        //serverRequest.assignment.push(`Make an essay for this assignment: '${userProfile.assignment}' that has a word limit of '${userProfile.wordLength}' based off this outline: ${userProfile.selectedOutline}. Use this title, '${userProfile.selectedTitle}'`);
                        serverResponse.assignment = [];
                        for (var i = 0; i < serverRequest.assignment.length; i++) {
                            var serverResp = await fetch('https://outline-try.onrender.com', {
                                //object with all the options
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    //pass in object
                                    //data/message coming from text area element on screen
                                    prompt: serverRequest.assignment[i],
                                    parameters: {
                                        frequencyPenalty: 1.9,
                                        presencePenalty: .9,
                                    },
                                })
                            })
                            if (serverResp.ok) {
                                const data = await serverResp.json()
                                const parsedData = data.bot.trim();
                                console.log(parsedData)
                                serverResponse.assignment.push(parsedData);
                                console.log("this is the first server response", serverResponse)
                            }
                            else {
                                const err = await serverResponse.assignment[i].text();
                                alert(err);

                            }
                            //after response
                            clearInterval(loadInterval);

                            //turn the div into something empty because we are not sure at which point in loading we are
                            //we could be at one dot or three dots but we want it to be empty

                            //

                        }
                        addNewElement(true, userProfile.selectedTitle)
                        for (var i = 0; i < serverResponse.assignment.length; i++) {

                            addNewElement(true, serverResponse.assignment[i], uniqueId);
                        }

                    }
                    else {
                        addNewElement(true, 'Please answer the following questions to the best of your ability')
                        addNewElement(true, 'Please describe in detail the tone and style of the essay? (Ex: "Essay formally written in analytic style of Loiuse Penny and written in the style of a freshman in college")');
                        sectionTrack++;
                    }
                    userProfile.stillPlaying = false;

                }
                else {
                    addNewElement(true, 'Please input a number from 1-2')
                    console.error("Please input a number");
                }
            }


        }
        else if (sectionTrack === 5) {
            userProfile.styleAndTone = userSubmit;
            addNewElement(true, 'Who is the target audience?')
            sectionTrack++;


        }
        else if (sectionTrack === 6) {
            userProfile.targetAudience = userSubmit;
            addNewElement(true, 'What is the purpose of the assignmnt?')
            sectionTrack++;


        }
        else if (sectionTrack === 6) {
            userProfile.purpose = userSubmit;
            addNewElement(true, 'What is the format of the assignment? (Ex: MLA, APA)')
            sectionTrack++;
        }
        else if (sectionTrack === 7) {
            userProfile.format = userSubmit;
            addNewElement(true, 'Any additional requirements/instructions? (Ex: "Include some of my analysis from the readings. Include how in the Miller-Spoolman If none click submit')
            sectionTrack++;
        }
        else if (sectionTrack === 8) {
            userProfile.additional = userSubmit;
            addNewElement(true, 'Loading essay...')
            serverRequest.assignment.push(`Make this essay in the style and tone of, '${userProfile.styleAndTone}'based on this prompt: "${userProfile.assignment}" with a word length of '${userProfile.wordLength}' and with these headings: '${userProfile.selectedOutline}'. Include this selected title for the title of the essay '${userProfile.selectedTitle}.' This is the format of the essay: '${userProfile.format}.' This is the purpose of the essay: '${userProfile.purpose}'. This is the target audience, if any: '${userProfile.targetAudience}'. Include these additional instructions: ${userProfile.additional}`);
            serverRequest.assignment.push(`This tool is being used for an essay maker for a web app based on the input of the user. Create a paper based on this assignment: '${userProfile.assignment}' with a word length of '${userProfile.wordLength}'. These are headings and organization provided by CHATGPT for this essay: '${userProfile.selectedOutline}'. Include this title at the beginning: '${userProfile.selectedTitle}'. Make the essay including these parameters: Style and Tone: '${userProfile.styleAndTone}', Target Audience: '${userProfile.targetAudience}', Purpose: '${userProfile.purpose}', Format: '${userProfile.format}', Additional Instructions (if any): '${userProfile.additional}'`);
            serverRequest.assignment.push(`Make an essay for this assignment:'${userProfile.assignment}' in the style and tone of: '${userProfile.styleAndTone}' in this format: '${userProfile.format}' that has a word limit of '${userProfile.wordLength}' based off this outline: ${userProfile.selectedOutline}. Use this title, '${userProfile.selectedTitle}' Base the essay using these parameters. The target audience is: '${userProfile.targetAudience}.' The purpose of the assignment is: '${userProfile.purpose}' Here are additional instructions to consider when writing the essay, if any: '${userProfile.additional}'`);
            for (var i = 0; i < 3; i++) {
                var serverResp = await fetch('https://outline-try.onrender.com', {
                    //object with all the options
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        //pass in object
                        //data/message coming from text area element on screen
                        assignmentPrompt: serverRequest.assignment[i]
                    })
                })
                if (serverResp.ok) {
                    const data = await serverResp.json()
                    const parsedData = data.bot.trim();
                    console.log(parsedData)
                    serverResponse.assignment.push(parsedData);
                }
                else {
                    const err = await serverResponse.assignment[i].text();
                    alert(err);

                }
                //after response
                clearInterval(loadInterval);

                //turn the div into something empty because we are not sure at which point in loading we are
                //we could be at one dot or three dots but we want it to be empty

                //
            }
            for (var i = 0; i < 3; i++) {
                addNewElement(true, serverResponse.assignment[i], uniqueId);
            }
            userProfile.stillPlaying = false;
        }
    }
    else if (errorCode = 1) {
        addNewElement(true, "Please wait until we provide a response...")
    }
    else {
        addNewElement(true, "Your essay has already been provided. To edit a parameter, restart.")
    }
    form.reset();
    console.log("userprofile:", userProfile)
    console.log("server request:", serverRequest)
    console.log("server response:", serverResponse)
}



/*const handleSubmit = async (e) => {
    click++;
    console.log(click)
    e.preventDefault();
    //get data typed into form
    const data = new FormData(form)
    let userInput = data.get('prompt');
    //user's chat stripe gets made (pass in false becuase this is not AI, then pass in the data)
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    //clear text area input. reset method resets to default values on forms and form controls such as inputs
    form.reset();
    //make bots chatsripe
    //make bots unique id for message
    const uniqueId = generateUniqueId();
    //make bot chatstripe(pass in true because AI is typing, then pass in empty string because it will be filled up with the loader function, then pass in unique ID)
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)
    //as user types we want to automatically scroll down to see message. Puts new message in view. DELETE TO SEE EFFECT
    chatContainer.scrollTop = chatContainer.scrollHeight;
    //fetch and store new message by the UNiqueID that was made
    const messageDiv = document.getElementById(uniqueId)
    //turn on loader to show the dots and pass in the div we made before
    loader(messageDiv);

    //make outline


        //fetch data from server
        //create new response
        //http instead of https since its only local CHANGE LATER
        //research more on how to get responses from server
        const response = await fetch('http://localhost:5010', {
            //object with all the options
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                //pass in object
                //data/message coming from text area element on screen
                prompt: data.get('prompt')
            })
        })
        //after response
        clearInterval(loadInterval);
        //turn the div into something empty because we are not sure at which point in loading we are
        //we could be at one dot or three dots but we want it to be empty
        messageDiv.innerHTML = '';
    
        //
        if (response.ok) {
            //gives us the actual response from server
            const data = await response.json()

            //but it needs to be parsed
            const parsedData = data.bot.trim();
            console.log(parsedData)
            //pass the data into the type text function that  
            typeText(messageDiv,parsedData);
            messageDiv.innerHTML=parsedData;
    
    
        } else {
            //this is to catch errors
            const err = await response.text();
            messageDiv.innerHTML = "Something went wrong";
            alert(err);
    
        }

}
*/


//to see changes we have to call handleSubmit. Add event listener for submit event and call the function
form.addEventListener('submit', handleSubmit1);
//people use the enter button to enter as well
//keyup means once we press and release key
//then call a callback function to check if button is enter then call handleSubmit
form.addEventListener('keyup', (e) => {
    if (e.keycode === 13) {
        handleSubmit1(e);
    }
});
addNewElement(true, "Insert assignment below...");