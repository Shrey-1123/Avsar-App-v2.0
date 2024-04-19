import { LightningElement,wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import {
    
    MessageContext,
    publish
} from 'lightning/messageService';
import Id from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';
import basePath from "@salesforce/community/basePath";
import cmpVisibilityChannel from '@salesforce/messageChannel/cmpVisibilityChannel__c';

export default class CandidateHeaderlwc extends NavigationMixin(LightningElement) {

    isGuestUser = isGuest;
    currentUserId = Id;
    popovervisible = false;
    pageReference;

    get logoutlink(){
        const sitePrefix = basePath.replace("/", "");
        return sitePrefix+"/secur/logout.jsp";
    }

      handleLogout(){


        
       /* this.currentUserId = "";
        document.cookie = "sid=;";
        const cookie = this.getSidCookie('sid');
        console.log(cookie);
        this.pageReference = {
            type: 'comm__namedPage',
            attributes: {
                name: 'Home' //api name of community page
                
            }
        };
        console.log('navigating to home page after logout'+ JSON.stringify(this.pageReference));
        if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }
        evt.stopPropagation();
        evt.preventDefault();
        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        }*/

    }

    getSidCookie(cookieName) {
        
        console.log(document.cookie.split(';'));
        const cookies = document.cookie.split(';');
        for(let i=0;i<cookies.length;i++)
        {
            let cookie = cookies[i].trim();
            console.log(cookies[i]);
            if(cookie.substring(0,cookieName.length+1)==='sid=')
            {
                return decodeURIComponent(cookie.substring(cookieName.length+1));
            }
        
        }

        return null;
    
    }
   
    togglePopoverVisibilityonMouseOver(){

        this.popovervisible = true;
    }
    togglePopoverVisibilityonMouseOut(){
        
        this.popovervisible = true;
    }
  

    handleLogin(evt){

        this.pageReference = {
            type: 'comm__namedPage',
            attributes: {
                name: 'Login' //api name of community page
            },
           /* state: {
                recordId: this.account.id //passing Id to another page to be used further
             },*/
        };
        console.log('navigating to login page '+ JSON.stringify(this.pageReference));
        if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }
        evt.stopPropagation();
        evt.preventDefault();
        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        }
       /* this[NavigationMixin.Navigate]({
        
                type: 'comm__namedPage',
                attributes: {
                    name:'Login'
                }
            
        });*/
        
    }
 

    connectedCallback(){
        console.log('Is Current user guest user : '+this.isGuestUser);
        console.log('Current user Id is : '+ this.currentUserId);
    }
    @wire(MessageContext)
    messageConext;

 

    
    showappliedjobcomponent = false;

    handleProfileVisibilty(){
        console.log('View Profile clicked');
    }

   

    handleNavigation(event){
       console.log(event.target.name);
       
       if(event.target.name==="home"){

        this.publishComponentNameToVisibilityChannel("home");
        this.pageReference = {
            type: 'comm__namedPage',
            attributes: {
                name: 'Home' //api name of community page
            }
        };
        console.log('navigating to Home page '+ JSON.stringify(this.pageReference));
        if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }
        
        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        }
       }
       else if(event.target.name==="about"){
        this.publishComponentNameToVisibilityChannel("about");
       }
       else if(event.target.name==="contact"){

        this.publishComponentNameToVisibilityChannel("contact");

       }
       else if(event.target.name==="appliedjob"){

        this.publishComponentNameToVisibilityChannel("appliedjob");
        this.pageReference = {
            type: 'standard__webPage',
            attributes: {
                url: basePath+'/appliedjobs' //api name of community page
            }
        };
        console.log('navigating to applied jobs page '+ JSON.stringify(this.pageReference));
        if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }
        
        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        }

       }  
    }

    publishComponentNameToVisibilityChannel(componentName){

        const payload = { componentName : componentName};

        publish(this.messageConext,cmpVisibilityChannel,payload);
        console.log(componentName+' published to cmpVisibilityChannel');

    }
}