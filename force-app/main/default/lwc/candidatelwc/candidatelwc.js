import { LightningElement,wire,track } from 'lwc';
import {
    MessageContext,
    publish,
    subscribe,
    APPLICATION_SCOPE
} from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/candidateAppChannel__c';
import cmpVisibilityChannel from '@salesforce/messageChannel/cmpVisibilityChannel__c';

/* LWC resposible for Header*/
export default class Candidatelwc extends LightningElement {

    
    queryTerm;
    @track isVisible = true;
    @wire(MessageContext)
    messageContext;

    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            this.queryTerm = evt.target.value;
            const payload = { queryterm : evt.target.value};
            publish(this.messageContext,messageChannel,payload);
        }
    }

    renderedCallback(){
        this.subscribemessageChannel();
    }

    subscribemessageChannel(){
        if(!this.subscription){
            this.subscription = subscribe(
                this.messageContext,
                cmpVisibilityChannel,
                (message) => this.handleMessage(message),
                {scope : APPLICATION_SCOPE}
            );
        }
    }

    handleMessage(message){
        if(message.componentName=="home"){
            this.isVisible = true;
        }
        else if(message.componentName!="home"){
            this.isVisible = false;
        }
    }
}