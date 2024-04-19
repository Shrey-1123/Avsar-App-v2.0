import { LightningElement,track,wire} from 'lwc';
import {
    APPLICATION_SCOPE,
    MessageContext,
    subscribe,
    publish
} from 'lightning/messageService';
import messageChannel from '@salesforce/messageChannel/candidateAppChannel__c';
import SideNaveFilterChannel from '@salesforce/messageChannel/SideNavFilters__c';
import cmpVisibilityChannel from '@salesforce/messageChannel/cmpVisibilityChannel__c';

export default class CandidateJobSearchFilterlwc extends LightningElement {
    @wire(MessageContext)
    messageContext;

    @track isVisible = true;

    @track searchTerm;
    @track jobfilter;
    @track expfilter;
    @track sortfilter;
    @track resetAllfilter;

    activeSections = [];
    

    activeFilterValues = [];
    jobcategoryvalues = [];
    experiencefiltervalues = [];
    sortbyfiltervalues = [];

    publishToFilterMessageChannel(){

        const jobcatfilters = this.jobcategoryvalues.toString();
        const expfilters = this.experiencefiltervalues.toString();
        const sortfilters = this.sortbyfiltervalues.toString();

        const payload = {
            jobcategoryfilters: jobcatfilters,
            experiencefilters: expfilters,
            sortfilters: sortfilters 
           
        };

        console.log('filter message published : '+ JSON.stringify(payload));
        publish(this.messageContext,SideNaveFilterChannel,payload);
    }


    get jobcategoryoptions() {
        return [
            { label: 'IT', value: 'IT' },
            { label: 'HR', value: 'HR' },
            { label: 'Finance', value: 'Finance' },
        ];
    }

    get expereincefilteroptions() {
        return [
            { label: 'Fresher', value: 'Fresher' },
            { label: 'Experienced', value: 'Experienced' }
            
        ];
    }

    get sortbyfilteroptions() {
        return [
            { label: 'Experience level', value: 'sortbyexperience' },
            { label: 'Job Posted Date', value: 'sortybyjobpostingdate' }
            
        ];
    }

    handleJobFiltersChange(event){
        
        
        this.jobcategoryvalues = event.detail.value;
        console.log('current job cat : '+this.jobcategoryvalues);
        this.publishToFilterMessageChannel();
    }

    handleExperienceFiltersChange(event){

         
         this.experiencefiltervalues = event.detail.value;
         console.log('current exp : '+this.experiencefiltervalues);
         this.publishToFilterMessageChannel();

     }

     handleSortByFiltersChange(event){
         
         
         this.sortbyfiltervalues = event.detail.value;
         console.log('current sortby : '+this.sortbyfiltervalues);
         this.publishToFilterMessageChannel();
     }

    togglesortFilter(){
        if(this.sortfilter===true){
            this.sortfilter = false;
            this.sortbyfiltervalues.splice(0,this.sortbyfiltervalues.length);
            this.publishToFilterMessageChannel();
            

        }
    }

    toggleexpFilter(){
        if(this.expfilter===true){
            this.expfilter = false;
            this.experiencefiltervalues.splice(0,this.experiencefiltervalues.length);
            this.publishToFilterMessageChannel();
            
        }
    }

    togglejobFilter(){
        if(this.jobfilter===true){
            this.jobfilter = false;
            this.jobcategoryvalues.splice(0,this.jobcategoryvalues.length);
            this.publishToFilterMessageChannel();
            
        }       
    }

    toggleresetAllFilter(){

        if(this.resetAllfilter===true){
            
            this.jobfilter = false;
            this.expfilter = false;
            this.sortfilter = false;
            this.sortbyfiltervalues.splice(0,this.sortbyfiltervalues.length);
            this.jobcategoryvalues.splice(0,this.jobcategoryvalues.length);
            this.experiencefiltervalues.splice(0,this.experiencefiltervalues.length);
            this.publishToFilterMessageChannel();

        }
    }

    handleSectionToggle(event) {
        const openSections = event.detail.openSections;
        this.activeSections = openSections;
        console.log('active sections : '+this.activeSections);
        
        if(this.activeSections.includes("jobcategory")){
            console.log('opening job section');
            this.jobfilter = true;
            this.resetAllfilter = true;

        }
        if(this.activeSections.includes("experiencelevel")){

            console.log('opening exp section');
            this.expfilter = true;
            this.resetAllfilter = true;

        }
        if(this.activeSections.includes("sortby")){

            console.log('opening sort section');
            this.sortfilter = true;
            this.resetAllfilter = true;
        }
        
    }

    connectedCallback(){
        this.subscribeToMessageChannel();
    }
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                messageChannel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }

        if(!this.subscriptionMC){
            this.subscriptionMC = subscribe(
                this.messageContext,
                cmpVisibilityChannel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(message){
        this.searchTerm = message.queryterm;
        if(message.componentName==="home"){
            this.isVisible = true;
        }
        else if(message.componentName==="appliedjob" || message.componentName==="contact" || message.componentName==="about"){
            this.isVisible = false;
        }
    }
}