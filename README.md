# Alexa Real estate agent protoype 🏡
This is a documentation for a prototype of Amazon Alexa skill with multiple interconnected states.

The idea was to create an Alexa Skill that guides a person through the process of buying or renting a real estate. Buying a real estate is high-risk situation and often a stressful one riddled with self-doubt and uncertainty. Alexa Real Estate Agent would help people structure their thoughts, introduce them to the important concepts, and give them advice on request. As a result, a person would be able to know what they want and why do they want it.

From a voice assistant standpoint this meant building some kind of storyline and from a technical standpoint this meant building some kind of state machine. For each interaction with a user Alexa skill would go from one state to another.
For example, if in a current state Alexa could ask how many rooms a person wants to have in their new real estate. User could provide an exact number of rooms and trigger NumberOf intent, or he could trigger Advice intent by saying "I'm not sure.". Both intents, NumberOf and Advice, will change Alexa to another state appropriate for a storyline.

Sections:
1. Storyline - Detailed description of the whole storyline
2. How to replicate - Most important steps in replicating the skill
3. Implementation of state machine - Technical details on how the state machine was implemented

**Note** This code was tested with AWS Lambda (released on 2017-4-18) running Node.js 6.10. It may become outdated.

# 1. Storyline
The storyline depicted in the diagram provided here exactly matches the one in the code. Storyline consists of states, intentions and things Alexa should say while transitioning from one state to another.

Skill is using this intentions
* AMAZON.CancelIntent (required)
* AMAZON.HelpIntent (required)
* AMAZON.NoIntent
* AMAZON.StopIntent (require)
* AMAZON.YesIntent

where AMAZON.CancelIntent, AMAZON.HelpIntent, and AMAZON.StopIntent have been omitted from storyline for the sake of simplification.

There are also custom intentions
* Advice - Used when user is unsure or seeks help. Invocation examples: "I don't know.", "I'm not sure", "Can you help me out?"
* Error
* NumberOf{numericalValue} - Used for taking numerical inputs and storing them in a slot named "numericalValue". Invocation examples: "Five rooms", "One person"

Details of Advice and NumberOf implementations are mentioned in 2. How to replicate.

## 1.1. Storyline diagram
The following image explains the meaning behind graphics used in the diagram.

![diagram explanation](readme-resources/diagram-explanation.png)

Next diagram depicts the whole storyline. Larger images and formats are provided as well.

📥Download 
[PNG HighRes (1.6 MB)](https://raw.githubusercontent.com/MiroslavJelaska/alexa-real-estate-agent/master/readme-resources/diagram-high-resolution.png)
|
[PNG MediumRes (600 KB)](https://raw.githubusercontent.com/MiroslavJelaska/alexa-real-estate-agent/master/readme-resources/diagram-medium-resolution.png)
|
[PDF (490 KB)](https://github.com/MiroslavJelaska/alexa-real-estate-agent/raw/master/readme-resources/diagram.ai)
|
[AI (458 KB)](https://github.com/MiroslavJelaska/alexa-real-estate-agent/raw/master/readme-resources/diagram.ai)

[![Storyline diagram](readme-resources/diagram-low-resolution.png)](https://raw.githubusercontent.com/MiroslavJelaska/alexa-real-estate-agent/master/readme-resources/diagram-medium-resolution.png "Click to open larger diagram")

## 1.2. Preview of the storyline in action
Here you can watch a part of a pitch where this prototype was used. It can give you a clear idea of how this storyline works in action. Pitch was given at "Let the machines talk" hackathon by FUNKE Digital GmbH (Berlin, Germany).

[![Amazon Alexa skill pitch at "Let the machines talk" hackathon @Berlin](readme-resources/youtube-screenshot.png)](https://youtu.be/OKX5nA8ez_k?t=7m45s "Amazon Alexa skill pitch at Let the machines talk hackathon @Berlin")

# 2. How to replicate
These are just rough guides on how to replicate this skill and make it run. If you have no prior experience using [Alexa Skill Kit](https://developer.amazon.com/alexa-skills-kit) (aka ASK) I advise finding out more about it before proceeding on because this documentation is not meant to be used as introduction to Alexa Skill Kit and development.

## 2.1. Creating basic skill
1. Go to [https://developer.amazon.com](https://developer.amazon.com) > "Alexa"
2. Pick "Get Started >" from "Alexa Skills Kit"

<img src="readme-resources/alexa-skill-kit-get-started.png" alt="alexa-skill-kit-get-started" width="150"/> 
3. Select "Add a New Skill" and fillout the "Skill information" tab as on the image below
<img src="readme-resources/create-a-new-alexa-skill-01-skill-information.jpg" alt="alexa-skill-kit-get-started" /> 

4. Press "Save"
5. Press "Next" which will lead you to "Interaction Model" tab. Continue to 2.2. Inteaction model

## 2.2 Interaction model
1. Lanuch "Skill Builder" (which is curently in beta)
2. Go to "Code Editor" tab
3. Either upload interaction model JSON file or copy/paste content from provided interaction model. 📥 Download [interaction-model.json](interaction-model.json). This will provide you with all necessary intents.
4. Select "Build Model" (it will save model automatically)

## 2.3. Create Lambda for the skill
1. Go to [https://console.aws.amazon.com](https://console.aws.amazon.com)
2. AWS Lambda could possibly not be available in your current region. You can select "US East (N.Virginia)" to ensure you have it. Note: This is advice can become obsolite. Play around a bit with region setting if this doesn't work out for you.
3. Search and select "Lambda" from services
4. Press "Create function"
5. Press "Author from scratch"
6. Enter custom name and roles
7. Press "Create function"
8. "Configuration" tab > "Function code" paster source code from [main.js](main.js)
9. "Triggers" tab > "+ Add trigger" > Search for and select "Alexa Skills Kit" > Press "Submit"
10. Press "Save"
11. "Actions" > "Publish new version"
12. Copy ARN, we will need it for the steps that follow

## 2.4. Adding lambda to the skill
1. Head back to Amazon developer console page for your skill, somehow. (At the moment of writing this "Skill information" button in Skill Builder Beta works just fine).
2. Go to "Configuration" tab
3. Select "AWS Lambda ARN (Amazon Resource Name) Recommended"
4. Enter your ARN in the "Default" field
5. Select "Next"

If you've managed to find your way throught you should be ready to test and use the skill. Congrats! 🎉

# 3. Implementation of state machine

