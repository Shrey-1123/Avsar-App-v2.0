import { LightningElement,track,wire} from 'lwc';
import {
    APPLICATION_SCOPE,
    MessageContext,
    subscribe
} from 'lightning/messageService';
import cmpVisibilityChannel from '@salesforce/messageChannel/cmpVisibilityChannel__c';
import isGuest from '@salesforce/user/isGuest';
import basePath from "@salesforce/community/basePath";

export default class AppliedJobsParentlwc extends LightningElement {

    @track isVisible = false;
    isGuestUser = isGuest;

    

    @wire(MessageContext)
    messageContext;

    renderedCallback(){
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel(){
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

        if(message.componentName==="appliedjob"){
            this.isVisible = true;
        }
        else if(message.componentName!=="appliedjob"){
            this.isVisible = false;
        }
    }


}