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

## 2.1. Create interaction model
1. Go to [Amazon Developer console](https://developer.amazon.com) > "Alexa"
2. Pick "Get Started >" from "Alexa Skills Kit"

<img src="readme-resources/alexa-skill-kit-get-started.png" alt="alexa-skill-kit-get-started" width="150"/> 
3. Select "Add a New Skill" and fillout the "Skill information" tab as on the image below
<img src="readme-resources/create-a-new-alexa-skill-01-skill-information.jpg" alt="alexa-skill-kit-get-started" /> 


# 3. Implementation of state machine

