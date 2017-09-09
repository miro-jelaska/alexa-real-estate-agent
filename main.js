'use strict';
var Alexa = require('alexa-sdk');
var appId = '';
var active = '';
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = undefined;
    alexa.registerHandlers(stateHandlers);
    alexa.execute();
};

const state = {
    wellcome: 'wellcome',
    roomSize: 'roomSize',
    roomSize_advice: 'roomSize_advice',
    exit: 'exitEXIT',
    roomSize_01_howManyPeople: 'roomSize_01_howManyPeople',
    roomSize_02_fiveYearsOrMore: 'roomSize_02_fiveYearsOrMore',
    roomSize_03_numberOfPeopleInFiveYears: 'roomSize_03_numberOfPeopleInFiveYears',
    roomSize_04_anyExtraGuests: 'roomSize_04_anyExtraGuests',
    roomSize_05_doesItSoundOk: 'roomSize_05_doesItSoundOk',
    roomSize_02_01_rentOrBuy: 'roomSize_02_01_rentOrBuy'
}
const stateCommands = [];
function addCommand(newCommand){
    console.log(newCommand);
    newCommand.stop = function(){
         gotoState.call(this, state.exit, 'Ok, stoping now.');
    }
    stateCommands.push(newCommand);
}

[
    {
        id: state.wellcome,
        value: function() {
            return 'Would you like to buy a house?';
        },
        yes: function(){
            gotoState.call(this, state.roomSize);
        },
        no: function(){
            gotoState.call(this, state.exit, 'Ok, I\'ll be here if you need me. Till then...');
        },
        unhandled: function() {
            this.emit(':tell', 'Sorry, I didn\'t get that.');
        }
    },
    {
        id: state.roomSize,
        value: function() {
            return 'How many bedrooms are you looking for in your new home?';
        },
        yes: function(){
            gotoState.call(this, state.exit);
        },
        no: function(){
            gotoState.call(this, state.exit);
        },
        advice: function(){
            console.log(' state.roomSize > advice');        
            gotoState.call(this, state.roomSize_advice);
        },
        numberOf: function(){
            console.log(' state.roomSize > numberOf');
            var roomNumberSlotRaw = this.event.request.intent.slots.numericalValue.value;
            this.attributes['numberOfRooms'] = roomNumberSlotRaw;
            gotoState.call(this, state.exit, 'Great. Let\'s move on to the next question.');
        },
    },
    {
        id: state.roomSize_advice,
        value: function() {
            return 'To come up with a rough estimate, think about what your future needs will be. Is this enough information for you to take a guess?';
        },
        yes: function(){
            gotoState.call(this, state.roomSize);
        },
        no: function(){
            gotoState.call(this, state.roomSize_01_howManyPeople);
        },
    },
    {
        id: state.roomSize_01_howManyPeople,
        value: function() {
            return 'Okay. No problem. Let me walk you through the process of figuring it out. How many people are in your current household?';
        },
        numberOf: function(){
            var peopleCountSlotRaw = this.event.request.intent.slots.numericalValue.value;
            this.attributes['numberOfPeople'] = peopleCountSlotRaw;
            gotoState.call(this, state.roomSize_02_fiveYearsOrMore);
        }
    },
    {
        id: state.roomSize_02_fiveYearsOrMore,
        value: function() {
            return 'Do you plan on living in your new house for five  years or more?';
        },
        yes: function(){
            gotoState.call(this, state.roomSize_03_numberOfPeopleInFiveYears);
        },
        no: function(){
            gotoState.call(this, state.roomSize_02_01_rentOrBuy);
        },
    },
    {
        id: state.roomSize_02_01_rentOrBuy,
        value: function() {
            return 'Renting is a great solution for periods of less than five years. Are you sure you want to buy?';
        },
        yes: function(){
            gotoState.call(this, state.roomSize_03_numberOfPeopleInFiveYears);
        },
        no: function(){
            console.log('roomSize_02_01_rentOrBuy > no');
            gotoState.call(this, state.exit, 'Great. Glad I could help you with your future plans. Good bye!');
        },
    },
    {
        id: state.roomSize_03_numberOfPeopleInFiveYears,
        value: function() {
            console.log('roomSize_03_numberOfPeopleInFiveYears > value');
            return 'Great. How many people do you think will be living in your new house in five years?';
        },
        numberOf: function(){
            var peopleCountSlotRaw = this.event.request.intent.slots.numericalValue.value;
            this.attributes['numberOfPeopleInFiveYears'] = peopleCountSlotRaw;
            console.log("this.attributes['numberOfPeopleInFiveYears']", this.attributes['numberOfPeopleInFiveYears']);
            gotoState.call(this, state.roomSize_04_anyExtraGuests);
        }
    },
    {
        id: state.roomSize_04_anyExtraGuests,
        value: function() {
            return 'Would you like an extra room for your guests?';
        },
        yes: function(){
            var finalNumberOfPeople = Math.ceil((Math.max(this.attributes['numberOfPeople'], this.attributes['numberOfPeopleInFiveYears']) + 1)/2);
            this.attributes['finalNumberOfPeople'] = finalNumberOfPeople;
            gotoState.call(this, state.roomSize_05_doesItSoundOk);
        },
        no: function(){
            var finalNumberOfPeople = Math.max(this.attributes['numberOfPeople'], this.attributes['numberOfPeopleInFiveYears'])/2;
            this.attributes['finalNumberOfPeople'] = finalNumberOfPeople;
            gotoState.call(this, state.roomSize_05_doesItSoundOk);
        },
    },
    {
        id: state.roomSize_05_doesItSoundOk,
        value: function() {
            return 'Based on your answers, I would recommend ' + this.attributes['finalNumberOfPeople'] + ' bedrooms. Does that sound like a  good guess for now?';
        },
        yes: function(){
            gotoState.call(this, state.exit, 'Fantastic! Let\'s move on to the next question.');
        },
        no: function(){
            gotoState.call(this, state.roomSize_01_howManyPeople, 'Ok. Let\'s try this again.');
        },
    },
    {
        id: state.exit,
        value: function() {
            return 'Hope we helped you!';
        }
    }
].forEach(addCommand);


function initState(){
    active =  state.wellcome;
    this.emit(':ask', stateCommands[active].value.call(this));
}

function gotoState(nextState, textOnTransition){
    if(nextState === state.exit){
        this.emit(':tell', textOnTransition);
    } 
    else {
        var response = stateCommands[active].value.call(this);
        var isDone = stateCommands[active].isDone;
        active = nextState;
        this.emit(':ask', (textOnTransition || '') +  stateCommands[active].value.call(this));
    }
}

var stateHandlers = {
    'NewSession': function() {
        initState.call(this);
    },
    'Advice': function(){
        console.log('> Advice');
        stateCommands[active].advice.call(this);
    },
    'NumberOf': function(){
        console.log('> NumberOf');
        stateCommands[active].numberOf.call(this);
    },
    'AMAZON.YesIntent': function() {
        console.log('> AMAZON.YesIntent');
        stateCommands[active].yes.call(this);
    },
    'AMAZON.NoIntent': function() {
        console.log('> AMAZON.NoIntent');
        
        stateCommands[active].no.call(this);
    },
    'AMAZON.StopIntent': function() {
        console.log('> AMAZON.StopIntent');
        console.log(stateCommands[active].stop);
        
        stateCommands[active].stop.call(this);
    },
    'AMAZON.CancelIntent': function() {
        console.log('> AMAZON.CancelIntent');
        
        stateCommands[active].cancel.call(this);
    },
    'SessionEndedRequest': function () {
        console.log('> SessionEndedRequest');
        
        this.emit(':tell', 'Goodbye!');
    },
    'Unhandled': function(){
        console.log('> Unhandled');
        stateCommands[active].unhandled.call(this);
    }
};